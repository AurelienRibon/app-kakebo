import { getUnknownCategoryName, hasCategoryName } from '../lib/categories';

export const EXPENSE_TYPES = ['card', 'cash', 'check', 'transfer'] as const;

export type ExpenseType = typeof EXPENSE_TYPES[number];

export class Expense {
  date: Date;
  category: string;
  amount: number;
  type: ExpenseType;

  constructor(spec: Record<string, unknown> = {}) {
    this.date = this.setupDate(spec.date);
    this.category = this.setupCategory(spec.category);
    this.amount = this.setupAmount(spec.amount);
    this.type = this.setupType(spec.type);
  }

  private setupDate(date: unknown): Date {
    return typeof date === 'string' ? new Date(date) : new Date();
  }

  private setupCategory(category: unknown): string {
    return typeof category === 'string' && hasCategoryName(category)
      ? category
      : getUnknownCategoryName();
  }

  private setupAmount(amount: unknown): number {
    return typeof amount === 'number' ? amount : 0;
  }

  private setupType(type: unknown): ExpenseType {
    return (EXPENSE_TYPES as readonly unknown[]).includes(type)
      ? (type as ExpenseType)
      : 'card';
  }
}
