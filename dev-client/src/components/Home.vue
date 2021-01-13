<!-- ----------------------------------------------------------------------- -->
<!-- TEMPLATE -->
<!-- ----------------------------------------------------------------------- -->

<template>
  <div class="container">
    <h1>Kakeibo</h1>

    <div class="summary">
      <div class="summary-item debits">
        <div class="label">dépenses du mois</div>
        <div class="value">{{ monthDebit }}€</div>
      </div>
      <div class="summary-item balance">
        <div class="label">balance</div>
        <div class="value" :class="{ positive: monthBalance > 0 }">{{ monthBalance }}€</div>
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
  import { computeMonthBalance, computeMonthExpenses } from '../lib/expenses';

  export default defineComponent({
    props: {
      expenses: {
        type: Array as PropType<Expense[]>,
        required: true,
      },
    },

    setup(props) {
      const today = new Date();
      const monthDebit = computed(() => formatAmount(computeMonthExpenses(props.expenses, today)));
      const monthBalance = computed(() => formatAmount(computeMonthBalance(props.expenses, today)));
      return { monthDebit, monthBalance };
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
    background: #ececec;
  }

  h1 {
    font-size: 3em;
    font-weight: 200;
    margin: 30px 20px 10px 20px;
    color: #8e8e8e;
  }

  .summary {
    flex: 1;
    padding-top: 40px;
    background: #fcfcfc;
    box-shadow: 0px -1px 10px 0px #00000036;

    .summary-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 1.6em;
      border-bottom: 1px solid #8e8e8e88;
      padding-bottom: 30px;

      &:first-of-type {
        margin-bottom: 30px;
      }
    }

    .label {
      color: #8e8e8e;
    }

    .value {
      font-size: 1.7em;
      font-weight: 100;

      &.positive {
        color: $accent1;
      }
    }
  }
</style>
