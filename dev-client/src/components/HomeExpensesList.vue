<!-- ----------------------------------------------------------------------- -->
<!-- TEMPLATE -->
<!-- ----------------------------------------------------------------------- -->

<template>
  <div>
    <div
      v-for="sameDayExpenses of expensesByDay"
      :key="sameDayExpenses.date"
      class="expense-group"
    >
      <div class="expense-group-title">
        {{ formatExpenseDate(sameDayExpenses) }}
      </div>
      <div
        v-for="expense of sameDayExpenses.expenses"
        :key="expense.date"
        class="expense-items"
      >
        <div class="expense-item">
          <div class="expense-item-category">
            <span class="mdi" :class="getExpenseIcon(expense)"></span>
            <span>{{ expense.category }}</span>
          </div>
          <div class="expense-item-amount">
            {{ formatExpenseAmount(expense) }}€
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- ----------------------------------------------------------------------- -->
<!-- CODE -->
<!-- ----------------------------------------------------------------------- -->

<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { formatAmount } from '../lib/amounts';
  import { getCategoryDef } from '../lib/categories';
  import { formatDate } from '../lib/dates';
  import { SameDayExpenses, splitExpensesByDay } from '../lib/expenses';
  import Expense from '../models/expense';

  export default defineComponent({
    props: {
      expenses: {
        type: Array as PropType<Expense[]>,
        default: () => [],
      },
    },

    computed: {
      expensesByDay(): SameDayExpenses[] {
        return splitExpensesByDay(this.expenses);
      },
    },

    methods: {
      formatExpenseAmount(expense: Expense): string {
        return formatAmount(expense.amount);
      },
      formatExpenseDate(expense: Expense): string {
        return formatDate(expense.date);
      },
      getExpenseIcon(expense: Expense): string {
        return getCategoryDef(expense.category).icon;
      },
    },
  });
</script>

<!-- ----------------------------------------------------------------------- -->
<!-- STYLE -->
<!-- ----------------------------------------------------------------------- -->

<style lang="scss" scoped>
  .expense-group {
    margin-bottom: 20px;
  }

  .expense-group-title {
    margin-bottom: 10px;
  }

  .expense-item {
    display: flex;
    align-items: center;
    justify-content: space-between;

    height: 28px;
  }

  .expense-item-amount {
    font-weight: bold;
  }

  .expense-item-category {
    background: #ffa500;
    padding: 2px 6px;
    border-radius: 20px;

    & > span:first-of-type {
      margin-right: 2px;
    }
  }
</style>
