<!-- ----------------------------------------------------------------------- -->
<!-- TEMPLATE -->
<!-- ----------------------------------------------------------------------- -->

<template>
  <div>
    <AddExpenseCategory
      v-if="index === 1"
      @done="onCategoryChosen"
    ></AddExpenseCategory>

    <AddExpenseDetails
      v-if="index === 2"
      @done="onExpenseDone"
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
  import { Expense } from '../models/expense';

  export default defineComponent({
    components: { AddExpenseCategory, AddExpenseDetails },

    setup() {
      const expense = new Expense();
      const index = ref(1);

      function onCategoryChosen(category: string): void {
        expense.category = category;
        index.value += 1;
      }

      function onExpenseDone(): void {
        void 0;
      }

      return { expense, index, onCategoryChosen, onExpenseDone };
    },
  });
</script>
