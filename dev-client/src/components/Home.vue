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
  import { defineComponent, PropType } from 'vue';
  import { Expense } from '../models/expense';
  import HomeExpensesList from './HomeExpensesList.vue';

  export default defineComponent({
    components: { HomeExpensesList },

    props: {
      expenses: {
        type: Array as PropType<Expense[]>,
        required: true,
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
    font-size: 4.3em;
    font-weight: 200;
    margin-bottom: 20px;
  }

  .chart {
    color: $accent2;
    font-size: 200px;
    text-align: center;
  }
</style>
