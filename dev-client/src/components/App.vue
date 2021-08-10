<!-- ----------------------------------------------------------------------- -->
<!-- TEMPLATE -->
<!-- ----------------------------------------------------------------------- -->

<template>
  <main>
    <Home v-if="page === 'home'" :expenses="expenses"></Home>
    <Stats v-if="page === 'stats'" :expenses="expenses"></Stats>
    <Setup v-if="page === 'setup'" :expenses="expenses"></Setup>
    <ExpensesList
      v-if="page === 'list'"
      :expenses="expenses"
      @check="onExpenseCheck"
      @edit="onExpenseEdit"
    ></ExpensesList>

    <MenuBar class="menu-bar" @select="onMenuSelect"></MenuBar>

    <transition name="fade">
      <div v-if="loading" class="loading mdi mdi-loading"></div>
    </transition>

    <transition name="zoom">
      <div v-if="page === 'home'" v-ripple v-tap class="btn-add-expense" @tap="onBtnAddExpenseClick">
        <i class="mdi mdi-plus"></i>
      </div>
    </transition>

    <transition name="slide">
      <AddExpense
        v-if="state === 'addExpense'"
        class="panel"
        @cancel="onAddExpenseCancel"
        @done="onAddExpenseDone"
      ></AddExpense>
    </transition>

    <transition name="slide">
      <EditExpense
        v-if="state === 'editExpense'"
        class="panel"
        :expense="editedExpense"
        @cancel="onEditExpenseCancel"
        @remove="onEditExpenseRemove"
        @done="onEditExpenseDone"
      ></EditExpense>
    </transition>
  </main>
</template>

<!-- ----------------------------------------------------------------------- -->
<!-- CODE -->
<!-- ----------------------------------------------------------------------- -->

<script lang="ts">
  import { defineComponent, Ref, ref } from 'vue';
  import { Expense } from '../models/expense';
  import { MainPage } from '../models/page';
  import { ExpenseJSON } from '../lib/expenses';
  import { store } from '../store/store';
  import AddExpense from './AddExpense.vue';
  import EditExpense from './EditExpense.vue';
  import ExpensesList from './ExpensesList.vue';
  import Home from './Home.vue';
  import MenuBar from './MenuBar.vue';
  import Stats from './Stats.vue';
  import Setup from './Setup.vue';

  type State = 'idle' | 'addExpense' | 'editExpense';

  export default defineComponent({
    components: { Home, Stats, Setup, MenuBar, AddExpense, EditExpense, ExpensesList },

    setup() {
      const page = ref('home') as Ref<MainPage>;
      const state = ref('idle') as Ref<State>;
      const editedExpense = ref(new Expense()) as Ref<Expense>;
      const expenses = store.expenses;
      const loading = store.loading;

      return {
        editedExpense,
        expenses,
        loading,
        onAddExpenseCancel,
        onAddExpenseDone,
        onBtnAddExpenseClick,
        onEditExpenseCancel,
        onEditExpenseDone,
        onEditExpenseRemove,
        onExpenseCheck,
        onExpenseEdit,
        onMenuSelect,
        page,
        state,
      };

      function onMenuSelect(choice: MainPage): void {
        page.value = choice;
      }

      function onBtnAddExpenseClick(): void {
        state.value = 'addExpense';
      }

      function onAddExpenseCancel(): void {
        state.value = 'idle';
      }

      function onExpenseCheck(expense: Expense): void {
        expense.edit({ checked: !expense.checked });
        store.saveAndSync();
      }

      function onExpenseEdit(expense: Expense): void {
        editedExpense.value = expense;
        state.value = 'editExpense';
      }

      function onEditExpenseCancel(): void {
        state.value = 'idle';
      }

      function onEditExpenseDone(spec: ExpenseJSON): void {
        state.value = 'idle';
        editedExpense.value.edit(spec);
        store.saveAndSync();
      }

      function onEditExpenseRemove(): void {
        state.value = 'idle';
        editedExpense.value.edit({ deleted: true });
        store.saveAndSync();
      }

      function onAddExpenseDone(spec: ExpenseJSON): void {
        state.value = 'idle';
        store.addExpense(spec);
        store.saveAndSync();
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
    height: 70px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #ffa500;
    border-top: 1px solid #000;
    box-shadow: inset 0px 11px 16px -16px #000000;
  }

  .btn-add-expense {
    --btn-size: 80px;

    @media #{$media-phone-small} {
      --btn-size: 70px;
      bottom: 80px;
      right: 10px;
    }

    position: fixed;
    bottom: 90px;
    right: 20px;
    width: var(--btn-size);
    height: var(--btn-size);
    line-height: var(--btn-size);

    font-size: calc(var(--btn-size) - 10px);
    text-align: center;
    color: $app-front-bgcolor;
    background: $accent2;
    border-radius: var(--btn-size);
    box-shadow: 0px 2px 10px 0px #0008;
  }

  .panel {
    @include modal;
    @include padded;
    overflow-y: auto;
    background: $app-front-bgcolor;
    border-top: 4px solid $accent1;
  }

  .loading {
    position: fixed;
    top: 0;
    right: 10px;
    font-size: 40px;
    color: #8a8a8a;
    animation: spin 0.6s linear infinite;
  }

  // Animations

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
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
    transition: transform 0.3s ease;
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
