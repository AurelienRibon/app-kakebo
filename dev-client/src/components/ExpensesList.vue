<!-- ----------------------------------------------------------------------- -->
<!-- TEMPLATE -->
<!-- ----------------------------------------------------------------------- -->

<template>
  <div class="container" :class="{ centered: empty }">
    <div v-if="empty" class="panel-empty">
      <div class="label">Aucune dépense enregistrée</div>
      <div class="symbol mdi mdi-piggy-bank"></div>
    </div>

    <div v-for="group of expensesByDay" :key="group[0]" class="expense-group">
      <div class="expense-group-title">
        <span>{{ formatGroupDate(group[0]) }}</span>
        <span class="spacer"></span>
        <span class="sum">{{ formatExpensesSum(group[1]) }}€</span>
      </div>

      <div
        v-for="expense of group[1]"
        :key="expense.date"
        class="expense-item"
        :class="{ 'expense-item-checked': expense.checked }"
      >
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
        <div v-ripple v-tap class="expense-item-action" @tap="edit(expense)">
          <i class="mdi mdi-pencil"></i>
        </div>
        <div v-ripple v-tap class="expense-item-action" @tap="check(expense)">
          <i class="mdi mdi-check-bold"></i>
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
  import { formatDateToDayHuman } from '../lib/dates';
  import { filterExpensesOfLastMonths, groupExpensesByDay } from '../lib/expenses-stats';
  import { Expense } from '../models/expense';

  export default defineComponent({
    props: {
      expenses: {
        type: Array as PropType<Expense[]>,
        required: true,
      },
    },

    emits: ['edit', 'check'],

    setup(props, { emit }) {
      const lastMonthsExpenses = computed(() => filterExpensesOfLastMonths(props.expenses, 3));
      const expensesByDay = computed(() => groupExpensesByDay(lastMonthsExpenses.value));
      const empty = computed(() => lastMonthsExpenses.value.length === 0);

      return {
        expensesByDay,
        empty,
        edit,
        check,
        formatExpenseAmount,
        formatExpensesSum,
        formatGroupDate,
        getExpenseIcon,
      };

      function edit(expense: Expense): void {
        emit('edit', expense);
      }

      function check(expense: Expense): void {
        emit('check', expense);
      }

      function formatExpenseAmount(expense: Expense): string {
        return formatAmount(expense.amount);
      }

      function formatExpensesSum(expenses: Expense[]): string {
        return formatAmount(expenses.reduce((acc, it) => (it.amount < 0 ? acc + it.amount : acc), 0));
      }

      function formatGroupDate(date: string): string {
        return formatDateToDayHuman(new Date(date));
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
    @include padded;
    background: $app-front-bgcolor;

    &.centered {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }

  .panel-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #909090;

    .label {
      font-size: 2em;
      text-align: center;
    }

    .symbol {
      font-size: 8em;
    }
  }

  .expense-group {
    margin-bottom: 30px;
    padding-top: 20px;
    border-top: 1px solid $border-light-color;

    &:first-of-type {
      padding-top: 0;
      border-top: 0;
    }
  }

  .expense-group-title {
    display: flex;
    align-items: baseline;

    margin-bottom: 10px;
    font-size: 1.8em;
    font-weight: 100;

    .spacer {
      flex: 1;
    }

    .sum {
      font-size: 0.5em;
      color: #6b6b6b;
    }
  }

  .expense-item {
    display: flex;
    align-items: center;
    margin: 6px 0px;
  }

  .expense-item-data {
    display: flex;
    align-items: center;
    flex: 1;
  }

  .expense-item-actions {
    display: flex;
    align-items: center;
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

  .expense-item-action {
    padding: 6px 8px;
    margin: -6px -8px;
    margin-left: 0px;
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

  .expense-item-checked {
    background-image: repeating-linear-gradient(45deg, #ccc, #ccc 30px, #dbdbdb 30px, #dbdbdb 60px);
  }
</style>
