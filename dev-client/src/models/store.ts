import { Expense } from './expense';
import { readFile, writeFile } from '../lib/fs';
import { createExpense } from '../lib/expenses';

class Store {
  private _expenses = [] as Expense[];
  private _version = 1;

  get expenses(): Expense[] {
    return this._expenses;
  }

  get version(): number {
    return this._version;
  }

  async load(): Promise<void> {
    const content = await readFile('data.json');
    const spec = JSON.parse(content) as Record<string, unknown>;
    const specExpenses = spec.expenses as Record<string, unknown>[];
    this._expenses = specExpenses.map(createExpense);
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
