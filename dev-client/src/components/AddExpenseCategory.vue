<!-- ----------------------------------------------------------------------- -->
<!-- TEMPLATE -->
<!-- ----------------------------------------------------------------------- -->

<template>
  <h1>dépenses fréquentes</h1>
  <section>
    <div
      v-for="item of categoriesFrequent"
      :key="item.name"
      v-ripple
      class="item"
      :class="{ 'item-extra': item.extra }"
      @click="onItemClick(item.name)"
    >
      <span class="item-icon mdi" :class="item.icon"></span>
      <span class="item-name">{{ item.name }}</span>
    </div>
  </section>

  <h1>dépenses peu fréquentes</h1>
  <section>
    <div
      v-for="item of categoriesInfrequent"
      :key="item.name"
      v-ripple
      class="item"
      :class="{ 'item-extra': item.extra }"
      @click="onItemClick(item.name)"
    >
      <span class="item-icon mdi" :class="item.icon"></span>
      <span class="item-name">{{ item.name }}</span>
    </div>
  </section>
</template>

<!-- ----------------------------------------------------------------------- -->
<!-- CODE -->
<!-- ----------------------------------------------------------------------- -->

<script lang="ts">
  import { defineComponent } from 'vue';
  import { CategoryDef } from '../lib/categories';
  import categories from '../meta/categories.json';

  export default defineComponent({
    emits: ['done'],

    data() {
      return {
        categories: categories as CategoryDef[],
      };
    },

    computed: {
      categoriesFrequent(): CategoryDef[] {
        return this.categories.filter((it) => !it.infrequent);
      },
      categoriesInfrequent(): CategoryDef[] {
        return this.categories.filter((it) => !!it.infrequent);
      },
    },

    methods: {
      onItemClick(category: string): void {
        this.$emit('done', category);
      },
    },
  });
</script>

<!-- ----------------------------------------------------------------------- -->
<!-- STYLE -->
<!-- ----------------------------------------------------------------------- -->

<style lang="scss" scoped>
  @import '../theme.scss';

  h1 {
    font-weight: 300;
    font-size: 1.5em;
  }

  section {
    display: grid;
    grid-template-columns: repeat(3, 100px);
    grid-auto-flow: row;
    grid-gap: 15px;
    justify-content: center;

    margin-top: 15px;
    margin-bottom: 30px;
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
    border-radius: 10px;

    &.item-extra {
      background: $accent1;
    }
  }

  .item-icon {
    font-size: 36px;
    margin-bottom: 5px;
  }
</style>
