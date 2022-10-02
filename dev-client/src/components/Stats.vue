<!-- ----------------------------------------------------------------------- -->
<!-- TEMPLATE -->
<!-- ----------------------------------------------------------------------- -->

<template>
  <div ref="refRoot" class="stats-container">
    <h1>A propos<br />du mois</h1>

    <div class="card stat">
      <h2>dépenses par catégorie</h2>
      <canvas id="amountsByCategory" height="260"></canvas>
    </div>

    <div class="card stat">
      <h2>solde sur le mois</h2>
      <canvas id="balanceByDay" height="260"></canvas>
    </div>

    <h1>A propos<br />de l'année</h1>

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
    filterNonExceptionalExpenses,
    sumExpensesByCategory,
    sumExpensesByDay,
  } from '../lib/stats';

  const CHART_TEXT_COLOR = '#ededed';
  const CHART_GRID_COLOR = '#555';

  Chart.defaults.global.defaultFontColor = CHART_TEXT_COLOR;

  export default defineComponent({
    props: {
      expenses: {
        type: Array as PropType<Expense[]>,
        required: true,
      },
    },

    setup(props) {
      const filteredExpenses = filterNonExceptionalExpenses(props.expenses);

      const monthExpenses = filterExpensesOfCurrentMonth(filteredExpenses);
      const monthNegativeExpenses = monthExpenses.filter((it) => !it.isPositive());

      const amountsByCategory = sumExpensesByCategory(monthNegativeExpenses, 5);
      const amountsByDay = sumExpensesByDay(monthNegativeExpenses);

      const aggregatedBalanceByDay = computeAggregatedBalanceByDay(monthExpenses);
      const aggregatedBalanceByMonth = computeAggregatedBalanceByMonth(filteredExpenses);
      const aggregatedBalanceByMonthAll = computeAggregatedBalanceByMonth(props.expenses);

      const balanceByMonth = computeBalanceByMonth(filteredExpenses);
      const balanceOfDebitsByMonth = computeBalanceOfDebitsByMonth(filteredExpenses);

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
              yAxes: [{ type: 'linear', ticks: { beginAtZero: true }, gridLines: { color: CHART_GRID_COLOR } }],
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
                data: balanceByMonth.map((it) => it[1]).map((it) => (it > 0 ? it : 0)),
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
              yAxes: [{ type: 'linear', ticks: { beginAtZero: true }, gridLines: { color: CHART_GRID_COLOR } }],
            },
          },
        });

        new Chart('aggregatedBalanceByMonth', {
          type: 'line',
          data: {
            labels: balanceByMonth.map((it) => it[0]),
            datasets: [
              {
                label: 'Solde total',
                data: aggregatedBalanceByMonthAll.map((it) => ({ t: it[0], y: it[1] })),
                backgroundColor: '#36a2eb88',
                borderColor: '#36a2eb',
                borderWidth: 2,
                pointRadius: 0,
              },
              {
                label: 'Solde quotidien',
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
              xAxes: [{ type: 'time' }],
              yAxes: [{ type: 'linear', ticks: { beginAtZero: true }, gridLines: { color: CHART_GRID_COLOR } }],
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
      margin-left: 20px;
      margin-right: 20px;
      margin-bottom: 50px;

      @media #{$media-phone-small} {
        margin-left: 10px;
        margin-right: 10px;
      }
    }

    h1 {
      font-weight: 100;
      font-size: 2.6em;
      color: $text;
      padding-right: 10px;
      padding-bottom: 10px;
      margin-bottom: 10px;
      text-align: right;

      &:not(:first-of-type) {
        margin-top: 50px;
        padding-top: 40px;
        border-top: 60px solid $background2;
      }
    }

    h2 {
      font-weight: 100;
      font-size: 1.6em;
      border-bottom: 1px solid $border1;
      padding-bottom: 10px;
      margin-bottom: 10px;
    }
  }
</style>
