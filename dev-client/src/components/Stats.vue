<!-- ----------------------------------------------------------------------- -->
<!-- TEMPLATE -->
<!-- ----------------------------------------------------------------------- -->

<template>
  <div ref="refRoot" class="container">
    <h1>dépenses par catégorie</h1>
    <div id="sumByCategory" class="chart"></div>
  </div>
</template>

<!-- ----------------------------------------------------------------------- -->
<!-- CODE -->
<!-- ----------------------------------------------------------------------- -->

<script lang="ts">
  import { defineComponent, onMounted, PropType, ref } from 'vue';
  import { Expense } from '../models/expense';

  export default defineComponent({
    props: {
      expenses: {
        type: Array as PropType<Expense[]>,
        required: true,
      },
    },

    setup(props) {
      const refRoot = ref(null);

      onMounted(async () => {
        const el = refRoot.value as HTMLElement | null;
        const width = el ? el.clientWidth - 20 : 0;
        const vegaEmbed = await import('vega-embed');

        await vegaEmbed.default(
          '#sumByCategory',
          {
            $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
            width,
            height: 300,
            autosize: { type: 'fit', contains: 'padding' },
            data: { values: props.expenses.map((it) => it.toVisualObject()).filter((it) => !it.positive) },
            transform: [{ calculate: '-datum.amount', as: 'amount' }],
            mark: 'bar',
            encoding: {
              x: { aggregate: 'sum', field: 'amount', title: null, axis: { labelFontSize: 14 } },
              y: { field: 'category', type: 'nominal', sort: '-x', title: null, axis: { labelFontSize: 14 } },
              color: { field: 'extra', legend: null },
            },
          },
          { actions: false }
        );
      });

      return { refRoot };
    },
  });
</script>

<!-- ----------------------------------------------------------------------- -->
<!-- STYLE -->
<!-- ----------------------------------------------------------------------- -->

<style lang="scss" scoped>
  .container {
    padding: 20px 0 70px 0;
    background: #ececec;
    flex: 1;
  }

  h1 {
    font-weight: 100;
    font-size: 1.6em;
    margin: 10px;
  }

  .chart {
    box-shadow: 0px 4px 10px 0px #00000036;
    padding: 10px;
    background: white;
  }
</style>
