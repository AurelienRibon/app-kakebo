<!-- ----------------------------------------------------------------------- -->
<!-- TEMPLATE -->
<!-- ----------------------------------------------------------------------- -->

<template>
  <div class="container">
    <div
      v-for="item of categories"
      :key="item.name"
      v-ripple
      class="item"
      :class="{ 'item-extra': item.extra }"
      @click="onItemClick(item.name)"
    >
      <span class="item-icon mdi" :class="item.icon"></span>
      <span class="item-name">{{ item.name }}</span>
    </div>
  </div>
</template>

<!-- ----------------------------------------------------------------------- -->
<!-- CODE -->
<!-- ----------------------------------------------------------------------- -->

<script lang="ts">
  import { defineComponent } from 'vue';
  import categories from '../meta/categories.json';

  export default defineComponent({
    emits: ['category-chosen'],

    data() {
      return {
        categories,
      };
    },

    methods: {
      onItemClick(category: string): void {
        this.$emit('category-chosen', category);
      },
    },
  });
</script>

<!-- ----------------------------------------------------------------------- -->
<!-- STYLE -->
<!-- ----------------------------------------------------------------------- -->

<style lang="scss" scoped>
  @import '../theme.scss';

  .container {
    display: grid;
    grid-template-columns: repeat(3, 100px);
    grid-auto-flow: row;
    grid-gap: 15px;
    justify-content: center;

    margin-top: 15px;
  }

  .item {
    width: 100px;
    height: 100px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    color: hsl(0, 0%, 0%);
    background: hsl(0, 0%, 100%);
    border: 1px solid black;

    &.item-extra {
      background: $accent1;
    }
  }

  .item-icon {
    font-size: 36px;
    margin-bottom: 5px;
  }
</style>
