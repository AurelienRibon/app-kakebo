import { Ref, ref } from 'vue';
import { Storage } from '@capacitor/storage';
import { Expense, ExpenseSpec } from '../models/expense';
import { createExpenseFromJSON, createExpensesFromJSONs, ExpenseJSON, sortExpenses } from '../lib/expenses';

const IS_PROD = process.env.NODE_ENV === 'production';
const SERVER_URL = IS_PROD ? 'https://kakebo-server.herokuapp.com' : 'http://192.168.1.42:5000';

type DbExpensesSyncResult = ExpenseJSON[];

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

  addExpense(spec: ExpenseSpec): void {
    const expense = new Expense(spec);
    this._expensesFull.value.push(expense);
    this._refreshExpenses();
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
      this._setExpenses(createExpensesFromJSONs(specExpenses));
    } catch (err) {
      console.error(err); // eslint-disable-line no-console
      this._setExpenses([]);
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
      const changed = await this._syncExpenses();
      if (changed) {
        await this.save();
      }
    } catch (err) {
      console.error(err); // eslint-disable-line no-console
    }

    this._loading.value = false;
  }

  // Internal API
  // ---------------------------------------------------------------------------

  private async _syncExpenses() {
    const syncResult = await syncExpensesWithDB(this._expensesFull.value);
    if (!syncResult) {
      return;
    }

    let changed = false;

    if (syncResult.length > 0) {
      this._upsertExpenseJSONs(syncResult);
      changed = true;
    }

    return changed;
  }

  private _upsertExpenseJSONs(jsons: ExpenseJSON[]): void {
    const knownExpensesById = new Map(this._expensesFull.value.map((it) => [it.id, it]));

    for (const json of jsons) {
      const expense = createExpenseFromJSON(json);
      knownExpensesById.set(expense.id, expense);
    }

    this._setExpenses(Array.from(knownExpensesById.values()));
  }

  private _setExpenses(expenses: Expense[]): void {
    this._expensesFull.value = expenses;
    this._refreshExpenses();
  }

  private _refreshExpenses(): void {
    this._expenses.value = this._expensesFull.value.filter((it) => !it.deleted);
    sortExpenses(this._expenses.value);
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
