import { Expense } from '../models/expense';
import { createExpenseFromSpec, createExpensesFromSpec, ExpenseSpec } from '../lib/expenses';
import { readFile, writeFile } from '../lib/fs';

class Store {
  private _expenses = [] as Expense[];
  private _version = 1;

  get expenses(): Expense[] {
    return this._expenses;
  }

  get version(): number {
    return this._version;
  }

  addExpense(expense: Expense) {
    this._expenses.push(expense);
  }

  addExpenseFromSpec(spec: ExpenseSpec): void {
    const expense = createExpenseFromSpec(spec);
    this._expenses.push(expense);
  }

  async load(): Promise<void> {
    const content = await readFile('data.json');
    const spec = JSON.parse(content);
    const specExpenses = spec.expenses as ExpenseSpec[];
    this._expenses = createExpensesFromSpec(specExpenses);
  }

  async save(): Promise<void> {
    const content = JSON.stringify({
      expenses: this.expenses.map((it) => it.serialize()),
      version: this.version,
    });
    await writeFile('data.json', content);
  }
}

export const store = new Store();