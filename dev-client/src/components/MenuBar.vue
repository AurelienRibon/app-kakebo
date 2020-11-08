<template>
  <div class="container">
    <div class="item">
      <i class="mdi mdi-home"></i>
      <span>acceuil</span>
    </div>

    <div class="item">
      <i class="mdi mdi-poll"></i>
      <span>stats</span>
    </div>

    <div class="item">
      <i class="mdi mdi-format-list-bulleted-square"></i>
      <span>liste</span>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  export default defineComponent({});
</script>

<style lang="scss" scoped>
  .container {
    display: flex;
    justify-content: space-around;
  }

  .item {
    width: 70px;
    display: flex;
    flex-direction: column;
    align-items: center;

    i {
      font-size: 34px;
      line-height: 40px;
      height: 40px;
      margin-bottom: -6px;
    }
  }
</style>
