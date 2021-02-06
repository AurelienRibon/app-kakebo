<!-- ----------------------------------------------------------------------- -->
<!-- TEMPLATE -->
<!-- ----------------------------------------------------------------------- -->

<template>
  <div ref="refRoot" class="container">
    <div class="stat">
      <h1>dépenses par catégorie</h1>
      <canvas id="amountsByCategory" height="260"></canvas>
    </div>

    <div class="stat">
      <h1>évolution sur le mois</h1>
      <canvas id="balanceByDay" height="260"></canvas>
    </div>
  </div>
</template>

<!-- ----------------------------------------------------------------------- -->
<!-- CODE -->
<!-- ----------------------------------------------------------------------- -->

<script lang="ts">
  import Chart from 'chart.js';
  import { defineComponent, onMounted, PropType } from 'vue';
  import { Expense } from '../models/expense';
  import {
    computeBalanceByDay,
    filterExpensesOfCurrentMonth,
    sumExpensesByCategory,
    sumExpensesByDay,
  } from '../lib/expenses-stats';

  export default defineComponent({
    props: {
      expenses: {
        type: Array as PropType<Expense[]>,
        required: true,
      },
    },

    setup(props) {
      const allExpenses = filterExpensesOfCurrentMonth(props.expenses);
      const negExpenses = allExpenses.filter((it) => !it.isPositive());

      const amountsByCategory = sumExpensesByCategory(negExpenses, 5);
      const amountsByDay = sumExpensesByDay(negExpenses);
      const balanceByDay = computeBalanceByDay(allExpenses);

      onMounted(() => {
        new Chart('amountsByCategory', {
          type: 'pie',
          data: {
            labels: amountsByCategory.map((it) => it[0]),
            datasets: [
              {
                data: amountsByCategory.map((it) => -it[1]),
                backgroundColor: ['#ff6384', '#4bc0c0', '#36a2eb', '#9966ff', '#ffa500', '#ccc'],
                borderWidth: 0,
              },
            ],
          },
        });

        new Chart('balanceByDay', {
          type: 'line',
          data: {
            datasets: [
              {
                label: 'Balance',
                data: balanceByDay.map((it) => ({ t: it[0], y: it[1] })),
                backgroundColor: '#ff638488',
                borderColor: '#ff6384',
                borderWidth: 2,
                pointRadius: 0,
              },
              {
                label: 'Dépenses',
                type: 'bar',
                data: amountsByDay.map((it) => ({ t: it[0], y: -it[1] })),
                backgroundColor: '#ff6384',
              },
            ],
          },
          options: {
            scales: {
              xAxes: [{ type: 'time', time: { round: 'day' } }],
              yAxes: [{ type: 'linear', ticks: { beginAtZero: true } }],
            },
          },
        });
      });
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
    padding-left: 0;
    padding-right: 0;
    flex: 1;
  }

  .stat {
    background: $app-front-bgcolor;
    box-shadow: 0px 2px 10px 0px #00000036;
    padding: 20px 10px;
    margin-bottom: 50px;
  }

  h1 {
    font-weight: 100;
    font-size: 1.6em;
    border-bottom: 1px solid $border-light-color;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }
</style>
