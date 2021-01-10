<!-- ----------------------------------------------------------------------- -->
<!-- TEMPLATE -->
<!-- ----------------------------------------------------------------------- -->

<template>
  <div class="container">
    <div v-for="sameDayExpenses of expensesByDay" :key="sameDayExpenses.date" class="expense-group">
      <div class="expense-group-title">
        {{ formatExpenseDate(sameDayExpenses) }}
      </div>
      <div v-for="expense of sameDayExpenses.expenses" :key="expense.date" class="expense-items">
        <div class="expense-item">
          <div
            class="expense-item-category"
            :class="{
              'expense-item-extra': expense.isExtra(),
              'expense-item-recurring': expense.isRecurring(),
            }"
          >
            <span class="mdi" :class="getExpenseIcon(expense)"></span>
            <span>{{ expense.category }}</span>
          </div>
          <div class="expense-item-label">{{ expense.label }}</div>
          <div class="expense-item-amount" :class="{ 'expense-item-positive': expense.isPositive() }">
            {{ formatExpenseAmount(expense) }}€
          </div>
          <div v-ripple v-tap class="expense-item-edit" @tap="edit(expense)">
            <i class="mdi mdi-pencil"></i>
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
  import { computed, defineComponent, PropType } from 'vue';
  import { formatAmount } from '../lib/amounts';
  import { getCategoryDef } from '../lib/categories';
  import { formatDate } from '../lib/dates';
  import { splitExpensesByDay } from '../lib/expenses';
  import { Expense } from '../models/expense';

  export default defineComponent({
    props: {
      expenses: {
        type: Array as PropType<Expense[]>,
        required: true,
      },
    },

    emits: ['edit'],

    setup(props, { emit }) {
      const expensesByDay = computed(() => splitExpensesByDay(props.expenses));
      return { expensesByDay, edit, formatExpenseAmount, formatExpenseDate, getExpenseIcon };

      function edit(expense: Expense): void {
        emit('edit', expense);
      }

      function formatExpenseAmount(expense: Expense): string {
        return formatAmount(expense.amount);
      }

      function formatExpenseDate(expense: Expense): string {
        return formatDate(expense.date);
      }

      function getExpenseIcon(expense: Expense): string {
        return getCategoryDef(expense.category).icon;
      }
    },
  });
</script>

<!-- ----------------------------------------------------------------------- -->
<!-- STYLE -->
<!-- ----------------------------------------------------------------------- -->

<style lang="scss" scoped>
  @import '../theme.scss';

  .container {
    padding: 20px 10px 70px 10px;
  }

  .expense-group {
    margin-bottom: 30px;
    padding-top: 20px;
    border-top: 1px solid #adadad;

    &:first-of-type {
      padding-top: 0;
      border-top: 0;
    }
  }

  .expense-group-title {
    margin-bottom: 10px;
    font-size: 1.8em;
    font-weight: 100;
  }

  .expense-item {
    display: flex;
    align-items: center;
    margin: 6px 0px;
  }

  .expense-item-label {
    flex: 1;
    margin: 0 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .expense-item-amount {
    font-weight: bold;

    &.expense-item-positive {
      color: #e09200;
    }
  }

  .expense-item-edit {
    padding: 6px 8px;
    margin: -6px -8px;
    margin-left: 0px;
    border-radius: 100px;
    color: #a5a5a5;
  }

  .expense-item-category {
    padding: 2px 6px;
    border: 1px solid black;
    border-radius: 20px;
    font-size: 0.9em;

    & > span:first-of-type {
      margin-right: 2px;
    }

    &.expense-item-extra {
      background: $accent1;
    }

    &.expense-item-recurring {
      border-style: dashed;
    }
  }
</style>
