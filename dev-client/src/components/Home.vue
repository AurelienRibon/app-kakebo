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

  export default defineComponent({
    components: { HomeExpensesList },

    data() {
      return { expenses: [] as Expense[] };
    },

    async mounted() {
      this.expenses = await getExpenses();
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
</style>
