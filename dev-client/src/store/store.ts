import { Plugins } from '@capacitor/core';
import { Ref, ref } from 'vue';
import { Expense } from '../models/expense';
import { createExpenseFromJSON, createExpensesFromJSON, ExpenseJSON, sortExpenses } from '../lib/expenses';
import { readFile, writeFile } from '../lib/fs';

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
    const expense = createExpenseFromJSON(json);
    this._expenses.value.push(expense);
    this._expensesFull.value.push(expense);
    sortExpenses(this._expenses.value);
  }

  addExpenses(jsons: ExpenseJSON[]): void {
    for (const json of jsons) {
      const expense = createExpenseFromJSON(json);
      this._expenses.value.push(expense);
      this._expensesFull.value.push(expense);
    }
    sortExpenses(this._expenses.value);
  }

  editExpense(expense: Expense, josn: ExpenseJSON): void {
    this.deleteExpense(expense);
    this.addExpense(josn);
  }

  deleteExpense(expense: Expense) {
    expense.delete();
    const index = this._expenses.value.findIndex((it) => it.id === expense.id);
    this._expenses.value.splice(index, 1);
  }

  async load(): Promise<void> {
    this._loading.value = true;

    try {
      const content = await readFile('data.json');
      const spec = JSON.parse(content);
      const specExpenses = spec.expenses as ExpenseJSON[];
      this._expensesFull.value = createExpensesFromJSON(specExpenses);
      this._expenses.value = this._expensesFull.value.filter((it) => !it.deleted);
    } catch (err) {
      console.error(err); // eslint-disable-line no-console
      this._expensesFull.value = [];
      this._expenses.value = [];
    }

    try {
      await this.sync();
    } catch (err) {
      console.error(err); // eslint-disable-line no-console
    }

    this._loading.value = false;
  }

  async sync() {
    const syncResult = await syncExpensesWithDB(this._expensesFull.value);
    if (!syncResult) {
      return;
    }

    if (syncResult.expensesToAdd.length > 0) {
      this.addExpenses(syncResult.expensesToAdd);
    }

    if (syncResult.expensesToDelete.length > 0) {
      for (const json of syncResult.expensesToDelete) {
        const index = this._expenses.value.findIndex((it) => it.id === json._id);
        this._expenses.value[index].delete();
        this._expenses.value.splice(index, 1);
      }
    }
  }

  async save(): Promise<void> {
    const content = JSON.stringify({
      expenses: this._expensesFull.value.map((it) => it.serialize()),
      version: this._version,
    });
    await writeFile('data.json', content);
  }
}

export const store = new Store();

// -----------------------------------------------------------------------------
// DB SYNC
// -----------------------------------------------------------------------------

async function syncExpensesWithDB(expenses: Expense[]): Promise<DbExpensesSyncResult | undefined> {
  const jsons = expenses.map((it) => it.serialize());
  const headers = { 'Content-Type': 'application/json' };
  const url = `${SERVER_URL}/expenses/sync`;
  const result = await Plugins.Http.request({ method: 'POST', url, headers, data: { expenses: jsons } });
  return result.status === 200 ? result.data : undefined;
}
