<!-- ----------------------------------------------------------------------- -->
<!-- TEMPLATE -->
<!-- ----------------------------------------------------------------------- -->

<template>
  <main>
    <Home :expenses="expenses"></Home>

    <div v-ripple class="btn-add-expense" @click="onBtnAddExpenseClick">
      <i class="mdi mdi-plus"></i>
    </div>

    <transition name="slide">
      <AddExpense
        v-if="state === 'addExpense'"
        class="panel-add-expense"
      ></AddExpense>
    </transition>
  </main>
</template>

<!-- ----------------------------------------------------------------------- -->
<!-- CODE -->
<!-- ----------------------------------------------------------------------- -->

<script lang="ts">
  import { defineComponent } from 'vue';
  import Home from './components/Home.vue';
  import AddExpense from './components/AddExpense.vue';
  import { getExpenses } from './lib/expenses';
  import Expense from './models/expense';

  type State = 'home' | 'addExpense';

  export default defineComponent({
    components: { Home, AddExpense },

    data() {
      return {
        state: 'home' as State,
        expenses: [] as Expense[],
      };
    },

    async mounted() {
      this.expenses = await getExpenses();
    },

    methods: {
      onBtnAddExpenseClick(): void {
        this.state = 'addExpense';
      },
    },
  });
</script>

<!-- ----------------------------------------------------------------------- -->
<!-- STYLE -->
<!-- ----------------------------------------------------------------------- -->

<style lang="scss" src="./main.scss"></style>

<style lang="scss" scoped>
  @import './theme.scss';

  main {
    height: 100vh;
    overflow-y: scroll;

    display: flex;
    flex-direction: column;
  }

  .btn-add-expense {
    $size: 80px;
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: $size;
    height: $size;
    font-size: $size - 10px;
    border-radius: $size;
    text-align: center;
    line-height: $size;
    background: $accent2;
    color: $app-bgcolor;
    box-shadow: 0px 6px 14px 1px rgb(0 0 0 / 55%);
  }

  .panel-add-expense {
    position: absolute;
    overflow-y: auto;
    top: 60px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background: $app-bgcolor;
    border-radius: 10px 10px 0px 0px;
    border-top: 2px solid $accent1;
    padding: 20px;
  }

  .slide-enter-active {
    transition: transform 0.5s ease;
  }

  .slide-enter-from {
    transform: translateY(100vh);
  }
</style>
