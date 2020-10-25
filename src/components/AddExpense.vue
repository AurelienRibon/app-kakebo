<template>
  <div>
    <nav>Étape {{ index }} sur 4</nav>
    <AddExpenseCategory v-if="index === 1" @categoryChosen="onCategoryChosen"></AddExpenseCategory>
    <AddExpenseAmount v-if="index === 2" @amountChosen="onAmountChosen"></AddExpenseAmount>
    <AddExpenseDate v-if="index === 3" @dateChosen="onDateChosen"></AddExpenseDate>
  </div>
</template>

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
      onDateChosen(date: number): void {
        this.expense.date = date;
        this.index = 1;
      },
    },
  });
</script>
