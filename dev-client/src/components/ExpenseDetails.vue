<!-- ----------------------------------------------------------------------- -->
<!-- TEMPLATE -->
<!-- ----------------------------------------------------------------------- -->

<template>
  <section v-if="full">
    <label>catégorie</label>
    <article>
      <select v-model="category">
        <option v-for="it of categories" :key="it.name">{{ it.name }}</option>
      </select>
    </article>
  </section>

  <section>
    <label>montant</label>
    <article class="input-amount">
      <div v-ripple v-tap class="sign" @tap="updateSign">
        <span>{{ sign }}</span>
      </div>
      <input ref="refAmount" :value="amount" type="number" inputmode="numeric" @beforeinput="updateAmount" />
    </article>
  </section>

  <section>
    <label>libellé</label>
    <article>
      <input v-model="label" type="text" list="labels" />
    </article>
    <datalist id="labels">
      <option v-for="label of labels" :key="label" :value="label"></option>
    </datalist>
  </section>

  <section v-if="periodicity === 'one-time'">
    <label>date</label>
    <article>
      <input v-model="date" type="date" />
    </article>
  </section>

  <section v-if="periodicity === 'monthly'">
    <label>date de début</label>
    <article>
      <input v-model="date" type="month" />
    </article>
  </section>

  <section>
    <label>périodicité</label>
    <article>
      <select v-model="periodicity">
        <option value="one-time">ponctuel</option>
        <option value="monthly">une fois par mois</option>
      </select>
    </article>
  </section>

  <section>
    <label>type</label>
    <div class="type-container">
      <div
        v-for="def of typeDefs"
        :key="def.name"
        v-ripple
        v-tap
        :class="{ selected: def.name === type }"
        @tap="updateType(def)"
      >
        <i class="mdi" :class="def.icon"></i>
      </div>
    </div>
  </section>
</template>

<!-- ----------------------------------------------------------------------- -->
<!-- CODE -->
<!-- ----------------------------------------------------------------------- -->

<script lang="ts">
  import { defineComponent, onMounted, ref, watch } from 'vue';
  import { addDigitToAmount, formatAmount } from '../lib/amounts';
  import { formatDateToDay, formatDateToMonth } from '../lib/dates';
  import { getCategoryDefs } from '../lib/categories';
  import { extractExpensesLabels } from '../lib/expenses';
  import { ExpenseTypeDef, getExpenseTypeDefs } from '../lib/expenses-types';
  import { Expense } from '../models/expense';
  import { store } from '../store/store';

  export default defineComponent({
    props: {
      expense: {
        type: Expense,
        required: true,
      },
      autofocus: {
        type: Boolean,
      },
      full: {
        type: Boolean,
      },
    },

    setup(props) {
      // Expense properties
      const date = ref(formatDate(props.expense.date, props.expense.periodicity));
      const periodicity = ref(props.expense.periodicity);
      const label = ref(props.expense.label);
      const amount = ref(formatAmount(props.expense.amount, true));
      const sign = ref(props.expense.getSign());
      const type = ref(props.expense.type);
      const category = ref(props.expense.category);

      // Misc values
      const categories = getCategoryDefs();
      const labels = extractExpensesLabels(store.expenses.value, props.expense.category);
      const typeDefs = getExpenseTypeDefs();
      const refAmount = ref(null);

      watch(periodicity, (value) => {
        date.value = formatDate(new Date(date.value), value);
      });

      if (props.autofocus) {
        onMounted(focusAmount);
      }

      return {
        amount,
        categories,
        category,
        date,
        label,
        labels,
        periodicity,
        sign,
        type,
        typeDefs,
        refAmount,
        updateAmount,
        updateSign,
        updateType,
      };

      function updateType(typeDef: ExpenseTypeDef): void {
        type.value = typeDef.name;
      }

      function updateSign(): void {
        sign.value = sign.value === '-' ? '+' : '-';
        focusAmount();
      }

      function updateAmount(event: InputEvent): void {
        event.preventDefault();

        if (event.inputType === 'deleteContentBackward') {
          amount.value = addDigitToAmount(amount.value, null);
        } else if (event.inputType === 'insertText' && typeof event.data === 'string' && /^\d$/.test(event.data)) {
          amount.value = addDigitToAmount(amount.value, event.data);
        }
      }

      function focusAmount() {
        const el = refAmount.value as HTMLElement | null;
        if (el) {
          el.focus();
        }
      }

      function formatDate(date: Date, periodicity: string) {
        return periodicity === 'monthly' ? formatDateToMonth(date) : formatDateToDay(date);
      }
    },

    methods: {
      bundle() {
        return {
          category: this.category,
          amount: Number(this.amount) * (this.sign === '-' ? -1 : +1),
          periodicity: this.periodicity,
          date: this.date,
          type: this.type,
          label: this.label,
        };
      },
    },
  });
</script>

<!-- ----------------------------------------------------------------------- -->
<!-- STYLE -->
<!-- ----------------------------------------------------------------------- -->

<style lang="scss" scoped>
  @import '../theme.scss';

  section {
    margin-bottom: 14px;
  }

  label {
    display: block;
  }

  article {
    height: 50px;
    display: flex;
    justify-content: stretch;
    border: 1px solid $border-dark-color;
    border-radius: 6px;

    &:focus-within {
      background: #ffedcc;
      border: 3px solid #ffa500;
    }

    input,
    select {
      display: flex;
      align-items: center;

      flex: 1;
      width: 100%;
      padding: 0 10px;

      background: none;
      border: 0;
      outline: none;
      font-size: 1.4em;

      &[inputmode='numeric'] {
        text-align: right;
        caret-color: #0000;
      }
    }
  }

  .sign {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    font-size: 1.6em;
  }

  .type-container {
    display: flex;
    height: 45px;
    border: 1px solid $border-dark-color;
    border-radius: 6px;

    & > div {
      flex: 1;
      text-align: center;
      line-height: 45px;
      font-size: 2em;
      border-radius: 6px;
      transition: background 0.3s ease;

      &.selected {
        background: $accent1;
      }
    }
  }

  .buttons {
    margin-top: 30px;
  }
</style>
