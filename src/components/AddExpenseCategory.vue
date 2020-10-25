<!-- ----------------------------------------------------------------------- -->
<!-- TEMPLATE -->
<!-- ----------------------------------------------------------------------- -->

<template>
  <div>
    <h1>CATÉGORIE</h1>

    <div class="container">
      <div
        v-for="(item, index) of expenseCategories"
        :key="index"
        class="item"
        :class="{ 'item-extra': item.extra }"
        v-ripple
        @click="onItemClick(item.id)"
      >
        <span class="item-icon mdi" :class="item.icon"></span>
        <span class="item-name">{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<!-- ----------------------------------------------------------------------- -->
<!-- CODE -->
<!-- ----------------------------------------------------------------------- -->

<script lang="ts">
  import { defineComponent } from 'vue';
  import expenseCategories from '../meta/expense-categories.json';

  export default defineComponent({
    data() {
      return {
        expenseCategories,
      };
    },

    methods: {
      onItemClick(category) {
        this.$emit('categoryChosen', category);
      },
    },
  });
</script>

<!-- ----------------------------------------------------------------------- -->
<!-- STYLE -->
<!-- ----------------------------------------------------------------------- -->

<style lang="scss" scoped>
  .container {
    display: grid;
    grid-template-columns: repeat(auto-fill, 100px);
    grid-auto-flow: row;
    grid-gap: 15px;
    justify-content: center;
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

    &.item-extra {
      background: hsl(45, 100%, 62%);
    }

    .item-icon {
      font-size: 36px;
      margin-bottom: 5px;
    }
  }
</style>
