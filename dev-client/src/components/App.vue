<!-- ----------------------------------------------------------------------- -->
<!-- TEMPLATE -->
<!-- ----------------------------------------------------------------------- -->

<template>
  <main>
    <Home v-if="page === 'home'"></Home>
    <ExpensesList v-if="page === 'list'" :expenses="expenses" @edit="onExpenseEdit"></ExpensesList>

    <MenuBar class="menu-bar" @select="onMenuSelect"></MenuBar>

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
  import { defineComponent, onMounted, ref } from 'vue';
  import { Expense } from '../models/expense';
  import { MainPage } from '../models/page';
  import { ExpenseSpec } from '../lib/expenses';
  import { store } from '../store/store';
  import AddExpense from './AddExpense.vue';
  import EditExpense from './EditExpense.vue';
  import ExpensesList from './ExpensesList.vue';
  import Home from './Home.vue';
  import MenuBar from './MenuBar.vue';

  type State = 'idle' | 'addExpense' | 'editExpense';

  export default defineComponent({
    components: { Home, MenuBar, AddExpense, EditExpense, ExpensesList },

    setup() {
      const page = ref<MainPage>('home');
      const state = ref<State>('idle');
      const expenses = ref<Expense[]>([]);
      const editedExpense = ref<Expense>(new Expense());

      onMounted(async () => {
        await store.load();
        expenses.value = store.expenses.value;
      });

      return {
        editedExpense,
        expenses,
        onAddExpenseCancel,
        onAddExpenseDone,
        onBtnAddExpenseClick,
        onEditExpenseCancel,
        onEditExpenseDone,
        onEditExpenseRemove,
        onExpenseEdit,
        onMenuSelect,
        page,
        state,
      };

      function onBtnAddExpenseClick(): void {
        state.value = 'addExpense';
      }

      function onAddExpenseCancel(): void {
        state.value = 'idle';
      }

      function onExpenseEdit(expense: Expense): void {
        editedExpense.value = expense;
        state.value = 'editExpense';
      }

      function onEditExpenseCancel(): void {
        state.value = 'idle';
      }

      function onEditExpenseDone(spec: ExpenseSpec): void {
        store.editExpense(editedExpense.value, spec);
        state.value = 'idle';
      }

      function onEditExpenseRemove(): void {
        store.removeExpense(editedExpense.value);
        state.value = 'idle';
      }

      async function onAddExpenseDone(spec: ExpenseSpec): Promise<void> {
        store.addExpenseFromSpec(spec);
        await store.save();
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
    $size: 80px;

    position: fixed;
    bottom: 90px;
    right: 20px;
    width: $size;
    height: $size;
    line-height: $size;

    font-size: $size - 10px;
    text-align: center;
    color: $app-bgcolor;
    background: $accent2;
    border-radius: $size;
    box-shadow: 0px 2px 10px 0px #0008;
  }

  .panel {
    @include modal;
    overflow-y: auto;
    padding: 20px;

    background: $app-bgcolor;
    border-top: 4px solid $accent1;
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
