<!-- ----------------------------------------------------------------------- -->
<!-- TEMPLATE -->
<!-- ----------------------------------------------------------------------- -->

<template>
  <main>
    <Home :expenses="expenses"></Home>

    <div v-ripple v-tap class="btn-add-expense" @tap="onBtnAddExpenseClick">
      <i class="mdi mdi-plus"></i>
    </div>

    <transition name="fade">
      <div v-if="state === 'addExpense'" class="smoke"></div>
    </transition>

    <transition name="slide">
      <AddExpense v-if="state === 'addExpense'" class="panel-add-expense" @cancel="onExpenseCancel"></AddExpense>
    </transition>
  </main>
</template>

<!-- ----------------------------------------------------------------------- -->
<!-- CODE -->
<!-- ----------------------------------------------------------------------- -->

<script lang="ts">
  import { defineComponent } from 'vue';
  import { getExpenses } from './lib/expenses';
  import { Expense } from './models/expense';
  import Home from './components/Home.vue';
  import AddExpense from './components/AddExpense.vue';

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
      onExpenseCancel(): void {
        this.state = 'home';
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
    height: var(--h);
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
    line-height: $size;

    font-size: $size - 10px;
    text-align: center;
    color: $app-bgcolor;
    background: $accent2;
    border-radius: $size;
    box-shadow: 0px 6px 14px 1px rgb(0 0 0 / 55%);
  }

  .panel-add-expense {
    @include modal;
    overflow-y: auto;
    padding: 20px;

    background: $app-bgcolor;
    border-top: 4px solid $accent1;
  }

  .smoke {
    @include modal;
    background: #000a;
  }

  // Transitions

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-leave-active {
    transition-duration: 0.8s;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .slide-enter-active,
  .slide-leave-active {
    transition: transform 0.4s ease;
  }

  .slide-enter-from,
  .slide-leave-to {
    transform: translateY(var(--h));
  }
</style>
