<!-- ----------------------------------------------------------------------- -->
<!-- TEMPLATE -->
<!-- ----------------------------------------------------------------------- -->

<template>
  <section>
    <h1>Kakeibo</h1>

    <div class="chart">
      <i class="mdi mdi-poll"></i>
    </div>

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
            <span class="mdi" :class="getIcon(expense)"></span>
            <span>{{ expense.category }}</span>
          </div>
          <div class="expense-item-amount">
            {{ formatExpenseAmount(expense) }}€
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<!-- ----------------------------------------------------------------------- -->
<!-- CODE -->
<!-- ----------------------------------------------------------------------- -->

<script lang="ts">
  import { defineComponent } from 'vue';
  import { formatAmount } from '../lib/amounts';
  import { getCategoryDef } from '../lib/categories';
  import { formatDate } from '../lib/dates';
  import {
    getExpenses,
    SameDayExpenses,
    splitExpensesByDay,
  } from '../lib/expenses';
  import Expense from '../models/expense';

  export default defineComponent({
    data() {
      return { allExpenses: [] as Expense[] };
    },

    computed: {
      expensesByDay(): SameDayExpenses[] {
        return splitExpensesByDay(this.allExpenses);
      },
    },

    async mounted() {
      this.allExpenses = await getExpenses();
    },

    methods: {
      formatExpenseAmount(expense: Expense): string {
        return formatAmount(expense.amount);
      },
      formatExpenseDate(expense: Expense): string {
        return formatDate(expense.date);
      },
      getIcon(expense: Expense): string {
        return getCategoryDef(expense.category).icon;
      },
    },
  });
</script>

<!-- ----------------------------------------------------------------------- -->
<!-- STYLE -->
<!-- ----------------------------------------------------------------------- -->

<style lang="scss" scoped>
  section {
    display: flex;
    flex-direction: column;
    padding: 20px;
  }

  h1 {
    font-family: Montserrat, sans-serif;
    font-size: 40px;
    font-weight: 200;
    margin-bottom: 20px;
  }

  .chart {
    color: #44657f;
    font-size: 200px;
    text-align: center;
  }

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
