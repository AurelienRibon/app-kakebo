<!-- ----------------------------------------------------------------------- -->
<!-- TEMPLATE -->
<!-- ----------------------------------------------------------------------- -->

<template>
  <div>
    <AddExpenseCategory v-if="index === 1" @done="onCategoryDone"></AddExpenseCategory>
    <AddExpenseDetails
      v-if="index === 2"
      :category="category"
      @done="onDetailsDone"
      @cancel="onDetailsCancel"
    ></AddExpenseDetails>
  </div>
</template>

<!-- ----------------------------------------------------------------------- -->
<!-- CODE -->
<!-- ----------------------------------------------------------------------- -->

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import AddExpenseCategory from './AddExpenseCategory.vue';
  import AddExpenseDetails from './AddExpenseDetails.vue';

  export default defineComponent({
    components: { AddExpenseCategory, AddExpenseDetails },
    emits: ['done', 'cancel'],

    setup(props, { emit }) {
      const index = ref(1);
      const category = ref('');

      return { index, category, onCategoryDone, onDetailsDone, onDetailsCancel };

      function onCategoryDone(cat: string): void {
        category.value = cat;
        index.value += 1;
      }

      function onDetailsDone(details: Record<string, unknown>): void {
        emit('done', { category: category.value, ...details });
      }

      function onDetailsCancel(): void {
        emit('cancel');
      }
    },
  });
</script>
