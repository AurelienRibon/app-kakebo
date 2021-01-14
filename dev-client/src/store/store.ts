import { Ref, ref } from 'vue';
import { Expense } from '../models/expense';
import { createExpenseFromJSON, createExpensesFromJSON, ExpenseJSON, sortExpenses } from '../lib/expenses';
import { readFile, writeFile } from '../lib/fs';
import { str } from '../lib/utils';

class Store {
  private _expensesFull = ref([]) as Ref<Expense[]>;
  private _expenses = ref([]) as Ref<Expense[]>;
  private _version = 1;

  get expenses(): Ref<Expense[]> {
    return this._expenses;
  }

  get version(): number {
    return this._version;
  }

  addExpense(spec: ExpenseJSON): void {
    const expense = createExpenseFromJSON(spec);
    this._expenses.value.push(expense);
    this._expensesFull.value.push(expense);
    sortExpenses(this._expenses.value);
  }

  editExpense(expense: Expense, spec: ExpenseJSON): void {
    this.removeExpense(expense);
    this.addExpense(spec);
  }

  removeExpense(expense: Expense) {
    expense.delete();
    const index = this.getExpenseIndex(expense);
    this._expenses.value.splice(index, 1);
  }

  async load(): Promise<void> {
    try {
      const content = await readFile('data.json');
      const spec = JSON.parse(content);
      const specExpenses = spec.expenses as ExpenseJSON[];
      this._expensesFull.value = createExpensesFromJSON(specExpenses);
      this._expenses.value = this._expensesFull.value.filter((it) => !it.deleted);
    } catch (err) {
      this._expensesFull.value = [];
      this._expenses.value = [];
    }
  }

  async save(): Promise<void> {
    const content = JSON.stringify({
      expenses: this._expensesFull.value.map((it) => it.serialize()),
      version: this._version,
    });
    await writeFile('data.json', content);
  }

  private getExpenseIndex(expense: Expense): number {
    const index = this._expenses.value.findIndex((it) => it.id === expense.id);
    if (index === -1) {
      throw new Error(`Expense not found: ${str(expense)}`);
    }
    return index;
  }
}

export const store = new Store();
