<!-- ----------------------------------------------------------------------- -->
<!-- TEMPLATE -->
<!-- ----------------------------------------------------------------------- -->

<template>
  <div class="container">
    <h1>Kakeibo</h1>

    <div class="chart">
      <i class="mdi mdi-poll"></i>
    </div>
  </div>
</template>

<!-- ----------------------------------------------------------------------- -->
<!-- CODE -->
<!-- ----------------------------------------------------------------------- -->

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({});
</script>

<!-- ----------------------------------------------------------------------- -->
<!-- STYLE -->
<!-- ----------------------------------------------------------------------- -->

<style lang="scss" scoped>
  @import '../theme.scss';

  .container {
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
