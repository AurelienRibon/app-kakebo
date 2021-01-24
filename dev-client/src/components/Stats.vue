<!-- ----------------------------------------------------------------------- -->
<!-- TEMPLATE -->
<!-- ----------------------------------------------------------------------- -->

<template>
  <div ref="refRoot" class="container">
    <h1>dépenses par catégorie</h1>

    <div v-if="!loaded" class="loading">
      <div class="label">Calcul en cours...</div>
      <div class="mdi mdi-coffee"></div>
    </div>

    <div v-show="loaded" id="sumByCategory" class="chart"></div>
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
      const loaded = ref(false);

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

        loaded.value = true;
      });

      return { refRoot, loaded };
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
    flex: 1;
    background: $app-front-bgcolor;
  }

  h1 {
    font-weight: 100;
    font-size: 1.6em;
    margin: 10px;
  }

  .chart {
    box-shadow: 0px 4px 10px 0px #00000036;
    padding: 10px;
  }

  .loading {
    @extend .chart;

    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 0;

    & > .label {
      color: $text-faint-color;
    }

    & > .mdi {
      color: $text-faint-color;
      font-size: 6em;
    }
  }
</style>
