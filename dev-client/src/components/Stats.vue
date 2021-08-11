<!-- ----------------------------------------------------------------------- -->
<!-- TEMPLATE -->
<!-- ----------------------------------------------------------------------- -->

<template>
  <div ref="refRoot" class="stats-container">
    <h1>A propos du mois</h1>

    <div class="card stat">
      <h2>dépenses par catégorie</h2>
      <canvas id="amountsByCategory" height="260"></canvas>
    </div>

    <div class="card stat">
      <h2>solde sur le mois</h2>
      <canvas id="balanceByDay" height="260"></canvas>
    </div>

    <h1>A propos de l'année</h1>

    <div class="card stat">
      <h2>dépenses par mois</h2>
      <canvas id="balanceByMonth" height="360"></canvas>
    </div>

    <div class="card stat">
      <h2>solde sur l'année</h2>
      <canvas id="aggregatedBalanceByMonth" height="260"></canvas>
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
    computeAggregatedBalanceByDay,
    computeAggregatedBalanceByMonth,
    computeBalanceByMonth,
    computeBalanceOfDebitsByMonth,
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
      const monthExpenses = filterExpensesOfCurrentMonth(props.expenses);
      const monthNegativeExpenses = monthExpenses.filter((it) => !it.isPositive());

      const amountsByCategory = sumExpensesByCategory(monthNegativeExpenses, 5);
      const amountsByDay = sumExpensesByDay(monthNegativeExpenses);

      const aggregatedBalanceByDay = computeAggregatedBalanceByDay(monthExpenses);
      const aggregatedBalanceByMonth = computeAggregatedBalanceByMonth(props.expenses);

      const balanceByMonth = computeBalanceByMonth(props.expenses);
      const balanceOfDebitsByMonth = computeBalanceOfDebitsByMonth(props.expenses);

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
                label: 'Solde',
                type: 'line',
                data: aggregatedBalanceByDay.map((it) => ({ t: it[0], y: it[1] })),
                backgroundColor: '#4bc0c088',
                borderColor: '#4bc0c0',
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

        new Chart('balanceByMonth', {
          type: 'bar',
          data: {
            labels: balanceByMonth.map((it) => it[0]),
            datasets: [
              {
                label: 'Économies',
                data: balanceByMonth.map((it) => it[1]),
                backgroundColor: '#4bc0c0',
              },
              {
                label: 'Dépenses',
                data: balanceOfDebitsByMonth.map((it) => it[1]),
                backgroundColor: '#ff6384',
              },
            ],
          },
          options: {
            scales: {
              xAxes: [{ stacked: true }],
              yAxes: [{ ticks: { beginAtZero: true } }],
            },
          },
        });

        new Chart('aggregatedBalanceByMonth', {
          type: 'line',
          data: {
            labels: balanceByMonth.map((it) => it[0]),
            datasets: [
              {
                label: 'Solde',
                data: aggregatedBalanceByMonth.map((it) => ({ t: it[0], y: it[1] })),
                backgroundColor: '#4bc0c088',
                borderColor: '#4bc0c0',
                borderWidth: 2,
                pointRadius: 0,
              },
            ],
          },
          options: {
            scales: {
              xAxes: [{ stacked: true }],
              yAxes: [{ ticks: { beginAtZero: true } }],
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

  .stats-container {
    @include padded;
    padding-left: 0 !important;
    padding-right: 0 !important;
    flex: 1;

    .stat {
      margin-bottom: 50px;
    }

    h1 {
      font-weight: 100;
      font-size: 1.6em;
      color: #8c8c8c;
      padding-bottom: 10px;
      margin-bottom: 30px;
      margin-right: 10px;
      text-align: right;

      &:not(:first-of-type) {
        margin-top: 150px;
      }
    }

    h2 {
      font-weight: 100;
      font-size: 1.6em;
      border-bottom: 1px solid $border-light-color;
      padding-bottom: 10px;
      margin-bottom: 10px;
    }
  }
</style>
