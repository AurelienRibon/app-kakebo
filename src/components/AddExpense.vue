<template>
  <div>
    <nav>&#187; Étape {{ index }} sur 4</nav>

    <AddExpenseCategory v-if="index === 1" @categoryChosen="onCategoryChosen"></AddExpenseCategory>

    <AddExpenseAmount v-if="index === 2" @amountChosen="onAmountChosen"></AddExpenseAmount>

    <AddExpenseDate v-if="index === 3" @dateChosen="onDateChosen"></AddExpenseDate>
  </div>
</template>

<script>
  import AddExpenseCategory from './AddExpenseCategory';
  import AddExpenseAmount from './AddExpenseAmount';
  import AddExpenseDate from './AddExpenseDate';
  import Expense from '../models/expense';

  export default {
    components: { AddExpenseCategory, AddExpenseAmount, AddExpenseDate },

    data() {
      return {
        expense: new Expense(),
        index: 1,
      };
    },

    methods: {
      onCategoryChosen(category) {
        this.expense.category = category;
        this.index += 1;
      },
      onAmountChosen(amount) {
        this.expense.amount = amount;
        this.index += 1;
      },
      onDateChosen(date) {
        this.expense.date = date;
        this.index = 1;
      },
    },
  };
</script>
