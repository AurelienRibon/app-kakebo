<!-- ----------------------------------------------------------------------- -->
<!-- TEMPLATE -->
<!-- ----------------------------------------------------------------------- -->

<template>
  <section>
    <div v-for="sameDayExpenses of expensesByDay" :key="sameDayExpenses.date" class="expense-group">
      <div class="expense-group-title">
        {{ formatExpenseDate(sameDayExpenses) }}
      </div>
      <div v-for="expense of sameDayExpenses.expenses" :key="expense.date" class="expense-items">
        <div class="expense-item">
          <div class="expense-item-category">
            <span class="mdi" :class="getExpenseIcon(expense)"></span>
            <span>{{ expense.category }}</span>
          </div>
          <div class="expense-item-amount">{{ formatExpenseAmount(expense) }}€</div>
        </div>
      </div>
    </div>
  </section>
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

    setup(props) {
      const expensesByDay = computed(() => splitExpensesByDay(props.expenses));
      return { expensesByDay, formatExpenseAmount, formatExpenseDate, getExpenseIcon };

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

  section {
    padding: 20px;
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
    font-size: 1.2em;
  }

  .expense-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 6px 0px;
  }

  .expense-item-amount {
    font-weight: bold;
  }

  .expense-item-category {
    background: $accent1;
    padding: 2px 6px;
    border-radius: 20px;

    & > span:first-of-type {
      margin-right: 2px;
    }
  }
</style>
