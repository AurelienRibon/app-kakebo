<template>
  <section>
    <h1>Kakebo</h1>

    <div class="chart">
      <i class="mdi mdi-poll"></i>
    </div>

    <div class="entries">
      <div class="entry-title">Cette semaine</div>
      <div class="entry-bar"></div>
      <div class="entry-bar"></div>
      <div class="entry-title">La semaine dernière</div>
      <div class="entry-bar"></div>
      <div class="entry-bar"></div>
      <div class="entry-bar"></div>
      <div class="entry-bar"></div>
      <div class="entry-bar"></div>
      <div class="entry-bar"></div>
      <div class="entry-bar"></div>
      <div class="entry-bar"></div>
      <div class="entry-bar"></div>
      <div class="entry-title">Il y a deux semaines</div>
      <div class="entry-bar"></div>
      <div class="entry-bar"></div>
      <div class="entry-bar"></div>
      <div class="entry-bar"></div>
      <div class="entry-bar"></div>
      <div class="entry-bar"></div>
      <div class="entry-bar"></div>
    </div>
  </section>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({});
</script>

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

  .entries {
    .entry-title {
      margin-top: 20px;
      margin-bottom: 10px;
    }

    .entry-bar {
      height: 30px;
      background-color: #44657f;
      margin-bottom: 10px;
    }
  }
</style>
