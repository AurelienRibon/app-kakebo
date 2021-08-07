import { Ref, ref } from 'vue';
import { Storage } from '@capacitor/storage';
import { Expense } from '../models/expense';
import { createExpenseFromJSON, createExpensesFromJSON, ExpenseJSON, sortExpenses } from '../lib/expenses';

const IS_PROD = process.env.NODE_ENV === 'production';
const SERVER_URL = IS_PROD ? 'https://kakebo-server.herokuapp.com' : 'http://192.168.1.42:5000';

interface DbExpensesSyncResult {
  expensesToAdd: ExpenseJSON[];
  expensesToDelete: ExpenseJSON[];
}

class Store {
  private _expensesFull = ref([]) as Ref<Expense[]>;
  private _expenses = ref([]) as Ref<Expense[]>;
  private _loading = ref(false);
  private _version = 1;

  get expenses(): Ref<Expense[]> {
    return this._expenses;
  }

  get loading(): Ref<boolean> {
    return this._loading;
  }

  get version(): number {
    return this._version;
  }

  addExpense(json: ExpenseJSON): void {
    this._registerExpenses([json]);
  }

  deleteExpense(expense: Expense): void {
    this._deleteExpenses([expense.serialize()]);
  }

  editExpense(expense: Expense, json: ExpenseJSON): void {
    this.deleteExpense(expense);
    this.addExpense(json);
  }

  async loadAndSync(): Promise<void> {
    await this.load();
    this.sync();
  }

  async saveAndSync(): Promise<void> {
    await this.save();
    this.sync();
  }

  async load(): Promise<void> {
    try {
      const { value } = await Storage.get({ key: 'data' });
      const spec = value ? JSON.parse(value) : { expenses: [] };
      const specExpenses = spec.expenses as ExpenseJSON[];
      this._expensesFull.value = createExpensesFromJSON(specExpenses);
      this._expenses.value = this._expensesFull.value.filter((it) => !it.deleted);
    } catch (err) {
      console.error(err); // eslint-disable-line no-console
      this._expensesFull.value = [];
      this._expenses.value = [];
    }
  }

  async save(): Promise<void> {
    const value = JSON.stringify({
      expenses: this._expensesFull.value.map((it) => it.serialize()),
      version: this._version,
    });

    await Storage.set({ key: 'data', value });
  }

  async sync() {
    this._loading.value = true;

    try {
      await this._syncImpl();
    } catch (err) {
      console.error(err); // eslint-disable-line no-console
    }

    this._loading.value = false;
  }

  // Internal API
  // ---------------------------------------------------------------------------

  private async _syncImpl() {
    const syncResult = await syncExpensesWithDB(this._expensesFull.value);
    if (!syncResult) {
      return;
    }

    if (syncResult.expensesToAdd.length > 0) {
      this._registerExpenses(syncResult.expensesToAdd);
    }

    if (syncResult.expensesToDelete.length > 0) {
      this._deleteExpenses(syncResult.expensesToDelete);
    }
  }

  private _registerExpenses(jsons: ExpenseJSON[]): void {
    for (const json of jsons) {
      const expense = createExpenseFromJSON(json);
      this._expensesFull.value.push(expense);

      if (!expense.deleted) {
        this._expenses.value.push(expense);
      }
    }

    sortExpenses(this._expenses.value);
  }

  private _deleteExpenses(jsons: ExpenseJSON[]): void {
    for (const json of jsons) {
      const index = this._expenses.value.findIndex((it) => it.id === json._id);
      this._expenses.value[index].delete();
      this._expenses.value.splice(index, 1);
    }
  }
}

export const store = new Store();

// -----------------------------------------------------------------------------
// DB SYNC
// -----------------------------------------------------------------------------

async function syncExpensesWithDB(expenses: Expense[]): Promise<DbExpensesSyncResult | undefined> {
  const body = JSON.stringify({ expenses: expenses.map((it) => it.serialize()) });
  const headers = { 'Content-Type': 'application/json' };
  const url = `${SERVER_URL}/expenses/sync`;
  const res = await fetch(url, { method: 'POST', mode: 'cors', headers, body });
  return res.status === 200 ? res.json() : undefined;
}
