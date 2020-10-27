<!-- ----------------------------------------------------------------------- -->
<!-- TEMPLATE -->
<!-- ----------------------------------------------------------------------- -->

<template>
  <section>
    <h1>Kakeibo</h1>

    <div class="chart">
      <i class="mdi mdi-poll"></i>
    </div>

    <HomeExpensesList :expenses="expenses"></HomeExpensesList>

    <div v-ripple="onBtnAddExpenseClick" class="btn-add-expense">
      <i class="mdi mdi-plus"></i>
    </div>
  </section>
</template>

<!-- ----------------------------------------------------------------------- -->
<!-- CODE -->
<!-- ----------------------------------------------------------------------- -->

<script lang="ts">
  import { defineComponent } from 'vue';
  import HomeExpensesList from './HomeExpensesList.vue';
  import { getExpenses } from '../lib/expenses';
  import Expense from '../models/expense';

  type State = 'home' | 'addExpense';

  export default defineComponent({
    components: { HomeExpensesList },

    data() {
      return {
        state: 'home' as State,
        expenses: [] as Expense[],
      };
    },

    async mounted() {
      this.expenses = await getExpenses();
    },

    methods: {
      onBtnAddExpenseClick(): void {
        this.state = 'addExpense';
      },
    },
  });
</script>

<!-- ----------------------------------------------------------------------- -->
<!-- STYLE -->
<!-- ----------------------------------------------------------------------- -->

<style lang="scss" scoped>
  @import '../theme.scss';

  section {
    display: flex;
    flex-direction: column;
    padding: 20px;
  }

  h1 {
    font-family: Montserrat, sans-serif;
    font-size: 3.4em;
    font-weight: 100;
    margin-bottom: 20px;
  }

  .chart {
    color: $accent2;
    font-size: 200px;
    text-align: center;
  }

  .btn-add-expense {
    $size: 80px;
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: $size;
    height: $size;
    font-size: $size - 10px;
    border-radius: $size;
    text-align: center;
    line-height: $size;
    background: $accent2;
    color: $app-bgcolor;
    box-shadow: 0px 6px 14px 1px rgb(0 0 0 / 55%);
  }
</style>
