import { Ref, ref } from 'vue';
import { Expense } from '../models/expense';
import { createExpenseFromSpec, createExpensesFromSpec, ExpenseSpec, sortExpenses } from '../lib/expenses';
import { readFile, writeFile } from '../lib/fs';
import { str } from '../lib/utils';

class Store {
  private _expenses = ref<Expense[]>([]);
  private _version = 1;

  get expenses(): Ref<Expense[]> {
    return this._expenses;
  }

  get version(): number {
    return this._version;
  }

  addExpense(expense: Expense) {
    this._expenses.value.push(expense);
    sortExpenses(this._expenses.value);
  }

  addExpenseFromSpec(spec: ExpenseSpec): void {
    const expense = createExpenseFromSpec(spec);
    this.addExpense(expense);
  }

  removeExpense(expense: Expense) {
    const index = this._expenses.value.findIndex((it) => it.id === expense.id);
    if (index === -1) {
      throw new Error(`Expense not found: ${str(expense)}`);
    }
    this._expenses.value.splice(index, 1);
  }

  async load(): Promise<void> {
    const content = await readFile('data.json');
    const spec = JSON.parse(content);
    const specExpenses = spec.expenses as ExpenseSpec[];
    this._expenses.value = createExpensesFromSpec(specExpenses);
  }

  async save(): Promise<void> {
    const content = JSON.stringify({
      expenses: this._expenses.value.map((it) => it.serialize()),
      version: this._version,
    });
    await writeFile('data.json', content);
  }
}

export const store = new Store();
