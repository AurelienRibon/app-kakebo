<!-- ----------------------------------------------------------------------- -->
<!-- TEMPLATE -->
<!-- ----------------------------------------------------------------------- -->

<template>
  <div>
    <AddExpenseCategory
      v-if="index === 1"
      @category-chosen="onCategoryChosen"
    ></AddExpenseCategory>

    <AddExpenseAmount
      v-if="index === 2"
      @amount-chosen="onAmountChosen"
    ></AddExpenseAmount>

    <AddExpenseDate
      v-if="index === 3"
      @date-chosen="onDateChosen"
    ></AddExpenseDate>
  </div>
</template>

<!-- ----------------------------------------------------------------------- -->
<!-- CODE -->
<!-- ----------------------------------------------------------------------- -->

<script lang="ts">
  import { defineComponent } from 'vue';
  import AddExpenseCategory from './AddExpenseCategory.vue';
  import AddExpenseAmount from './AddExpenseAmount.vue';
  import AddExpenseDate from './AddExpenseDate.vue';
  import Expense from '../models/expense';

  export default defineComponent({
    components: { AddExpenseCategory, AddExpenseAmount, AddExpenseDate },

    data() {
      return {
        expense: new Expense(),
        index: 1,
      };
    },

    methods: {
      onCategoryChosen(category: string): void {
        this.expense.category = category;
        this.index += 1;
      },
      onAmountChosen(amount: number): void {
        this.expense.amount = amount;
        this.index += 1;
      },
      onDateChosen(date: Date): void {
        this.expense.date = date;
        this.index = 1;
      },
    },
  });
</script>
