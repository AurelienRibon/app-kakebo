<!-- ----------------------------------------------------------------------- -->
<!-- TEMPLATE -->
<!-- ----------------------------------------------------------------------- -->

<template>
  <div class="container">
    <div v-ripple v-tap class="item" @tap="select('home')">
      <i class="mdi mdi-home"></i>
      <span>acceuil</span>
    </div>

    <div v-ripple v-tap class="item" @tap="select('stats')">
      <i class="mdi mdi-chart-bar"></i>
      <span>stats</span>
    </div>

    <div v-ripple v-tap class="item" @tap="select('list')">
      <i class="mdi mdi-format-list-bulleted-square"></i>
      <span>liste</span>
    </div>
  </div>
</template>

<!-- ----------------------------------------------------------------------- -->
<!-- CODE -->
<!-- ----------------------------------------------------------------------- -->

<script lang="ts">
  import { defineComponent } from 'vue';
  import { MainPage } from '../models/page';

  export default defineComponent({
    emits: ['select'],

    setup(props, ctx) {
      return { select };

      function select(name: MainPage) {
        ctx.emit('select', name);
      }
    },
  });
</script>

<!-- ----------------------------------------------------------------------- -->
<!-- STYLE -->
<!-- ----------------------------------------------------------------------- -->

<style lang="scss" scoped>
  .container {
    display: flex;
  }

  .item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    i {
      font-size: 34px;
      line-height: 40px;
      height: 40px;
      margin-bottom: -6px;
    }
  }
</style>
