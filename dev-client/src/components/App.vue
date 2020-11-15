<!-- ----------------------------------------------------------------------- -->
<!-- TEMPLATE -->
<!-- ----------------------------------------------------------------------- -->

<template>
  <main>
    <Home v-if="page === 'home'"></Home>
    <ExpensesList v-if="page === 'list'" :expenses="expenses"></ExpensesList>

    <MenuBar class="menu-bar" @select="onMenuSelect"></MenuBar>

    <transition name="zoom">
      <div v-if="page === 'home'" v-ripple v-tap class="btn-add-expense" @tap="onBtnAddExpenseClick">
        <i class="mdi mdi-plus"></i>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="state === 'addExpense'" class="smoke"></div>
    </transition>

    <transition name="slide">
      <AddExpense
        v-if="state === 'addExpense'"
        class="panel-add-expense"
        @cancel="onExpenseCancel"
        @done="onExpenseDone"
      ></AddExpense>
    </transition>
  </main>
</template>

<!-- ----------------------------------------------------------------------- -->
<!-- CODE -->
<!-- ----------------------------------------------------------------------- -->

<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { getExpenses } from '../lib/expenses';
  import { Expense } from '../models/expense';
  import { MainPage } from '../models/page';
  import AddExpense from './AddExpense.vue';
  import ExpensesList from './ExpensesList.vue';
  import Home from './Home.vue';
  import MenuBar from './MenuBar.vue';

  type State = 'idle' | 'addExpense';

  export default defineComponent({
    components: { Home, MenuBar, AddExpense, ExpensesList },

    setup() {
      const page = ref('home' as MainPage);
      const state = ref('idle' as State);
      const expenses = ref([] as Expense[]);

      onMounted(async () => {
        expenses.value = await getExpenses();
      });

      return { state, page, expenses, onBtnAddExpenseClick, onExpenseCancel, onExpenseDone, onMenuSelect };

      function onBtnAddExpenseClick(): void {
        state.value = 'addExpense';
      }

      function onExpenseCancel(): void {
        state.value = 'idle';
      }

      function onExpenseDone(data: Record<string, unknown>): void {
        expenses.value.unshift(new Expense(data));
        state.value = 'idle';
      }

      function onMenuSelect(choice: MainPage): void {
        page.value = choice;
      }
    },
  });
</script>

<!-- ----------------------------------------------------------------------- -->
<!-- STYLE -->
<!-- ----------------------------------------------------------------------- -->

<style lang="scss" scoped>
  @import '../theme.scss';

  main {
    height: var(--h);
    overflow-y: scroll;

    display: flex;
    flex-direction: column;
  }

  .menu-bar {
    height: 60px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #ffa500;
    border-top: 2px solid #000;
  }

  .btn-add-expense {
    $size: 80px;

    position: fixed;
    bottom: 80px;
    right: 20px;
    width: $size;
    height: $size;
    line-height: $size;

    font-size: $size - 10px;
    text-align: center;
    color: $app-bgcolor;
    background: $accent2;
    border-radius: $size;
    box-shadow: 0px 4px 8px 0px #0009;
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

  .zoom-enter-active {
    transition: transform 0.3s ease-out;
  }

  .zoom-leave-active {
    transition: transform 0.15s ease-in;
  }

  .zoom-enter-from,
  .zoom-leave-to {
    transform: scale(0);
  }

  .zoom-enter-to,
  .zoom-leave-from {
    transform: scale(1);
  }
</style>
