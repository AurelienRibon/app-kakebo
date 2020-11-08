<!-- ----------------------------------------------------------------------- -->
<!-- TEMPLATE -->
<!-- ----------------------------------------------------------------------- -->

<template>
  <div>
    <AddExpenseCategory v-if="index === 1" @done="onCategoryDone"></AddExpenseCategory>
    <AddExpenseDetails v-if="index === 2" @done="onDetailsDone" @cancel="onDetailsCancel"></AddExpenseDetails>
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

    setup(props, context) {
      const index = ref(1);
      let category = '';

      function onCategoryDone(cat: string): void {
        category = cat;
        index.value += 1;
      }

      function onDetailsDone(details: Record<string, unknown>): void {
        context.emit('done', { category, ...details });
      }

      function onDetailsCancel(): void {
        context.emit('cancel');
      }

      return { index, onCategoryDone, onDetailsDone, onDetailsCancel };
    },
  });
</script>
