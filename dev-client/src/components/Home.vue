<!-- ----------------------------------------------------------------------- -->
<!-- TEMPLATE -->
<!-- ----------------------------------------------------------------------- -->

<template>
  <div class="container">
    <h1>Kakeibo</h1>

    <div class="summary">
      <div class="summary-item balance">
        <div class="label">balance</div>
        <div class="value" :class="{ positive: monthBalance > 0 }">{{ monthBalance }}€</div>
      </div>

      <div class="summary-item debits">
        <div class="label">dépenses du mois</div>
        <div class="value">{{ monthBalanceOfDebits }}€</div>
        <div class="details">
          <div>
            <div class="label">ponctuelles</div>
            <div class="value">{{ monthBalanceOfOneTimeDebits }}€</div>
          </div>
          <div>
            <div class="label">récurrentes</div>
            <div class="value">{{ monthBalanceOfRecurringDebits }}€</div>
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
  import { Expense } from '../models/expense';
  import { formatAmount } from '../lib/amounts';
  import {
    computeBalance,
    computeBalanceOfDebits,
    computeBalanceOfOneTimeDebits,
    computeBalanceOfRecurringDebits,
    filterExpensesOfCurrentMonth,
  } from '../lib/expenses-stats';

  export default defineComponent({
    props: {
      expenses: {
        type: Array as PropType<Expense[]>,
        required: true,
      },
    },

    setup(props) {
      const currentExpenses = computed(() => filterExpensesOfCurrentMonth(props.expenses));
      const monthBalance = computed(() => formatAmount(computeBalance(currentExpenses.value)));
      const monthBalanceOfDebits = computed(() => formatAmount(computeBalanceOfDebits(currentExpenses.value)));
      const monthBalanceOfOneTimeDebits = computed(() =>
        formatAmount(computeBalanceOfOneTimeDebits(currentExpenses.value))
      );
      const monthBalanceOfRecurringDebits = computed(() =>
        formatAmount(computeBalanceOfRecurringDebits(currentExpenses.value))
      );

      return {
        monthBalance,
        monthBalanceOfDebits,
        monthBalanceOfOneTimeDebits,
        monthBalanceOfRecurringDebits,
      };
    },
  });
</script>

<!-- ----------------------------------------------------------------------- -->
<!-- STYLE -->
<!-- ----------------------------------------------------------------------- -->

<style lang="scss" scoped>
  @import '../theme.scss';

  .container {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  h1 {
    font-size: 3em;
    font-weight: 200;
    margin: 30px 20px 10px 20px;
    color: #8e8e8e;

    @media #{$media-phone-small} {
      font-size: 2.4em;
      margin-top: 20px;
    }
  }

  .summary {
    @include padded;
    flex: 1;
    padding-top: 30px;
    background: $app-front-bgcolor;
    box-shadow: 0px -1px 10px 0px #00000036;

    .summary-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 1.6em;
      border-bottom: 1px solid $border-light-color;
      padding-bottom: 30px;

      &:first-of-type {
        margin-bottom: 30px;
      }

      @media #{$media-phone-small} {
        font-size: 1.4em;
      }
    }

    .label {
      color: $text-faint-color;
    }

    .value {
      font-size: 1.7em;
      font-weight: 100;

      &.positive {
        color: $accent1;
      }
    }

    .details {
      width: 100%;
      margin-top: 20px;
      display: grid;
      grid-template-columns: 50% 50%;

      & > div {
        text-align: center;
      }

      .label {
        font-size: 0.7em;
      }

      .value {
        font-size: 0.9em;
      }
    }
  }
</style>
