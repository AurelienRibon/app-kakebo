import { getUnknownCategoryName, hasCategoryName } from '../lib/categories';

export default class Expense {
  date: Date;
  category: string;
  amount: number;

  constructor(spec: Record<string, unknown> = {}) {
    this.date = this.setupDate(spec.date);
    this.category = this.setupCategory(spec.category);
    this.amount = this.setupAmount(spec.amount);
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
}
