<!-- ----------------------------------------------------------------------- -->
<!-- TEMPLATE -->
<!-- ----------------------------------------------------------------------- -->

<template>
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
    <label>périodicité</label>
    <article>
      <select v-model="periodicity">
        <option value="one-time">ponctuel</option>
        <option value="monthly">une fois par mois</option>
      </select>
    </article>
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

  <section>
    <label>libellé</label>
    <article>
      <input v-model="label" type="text" list="labels" />
    </article>
    <datalist id="labels">
      <option v-for="label of labels" :key="label" :value="label"></option>
    </datalist>
  </section>

  <ButtonsGroup class="buttons">
    <button v-ripple v-tap class="btn-secondary" @tap="cancel">ANNULER</button>
    <button v-ripple v-tap class="btn-primary" @tap="done">AJOUTER</button>
  </ButtonsGroup>
</template>

<!-- ----------------------------------------------------------------------- -->
<!-- CODE -->
<!-- ----------------------------------------------------------------------- -->

<script lang="ts">
  import { defineComponent, onMounted, ref, watch } from 'vue';
  import { addDigitToAmount } from '../lib/amounts';
  import { formatDateToDay, formatDateToMonth } from '../lib/dates';
  import { extractExpensesLabels } from '../lib/expenses';
  import { ExpenseTypeDef, getExpenseTypeDefs } from '../lib/expenses-types';
  import { store } from '../store/store';
  import ButtonsGroup from './ButtonsGroup.vue';

  export default defineComponent({
    components: { ButtonsGroup },

    props: {
      category: {
        type: String,
        required: true,
      },
    },

    emits: ['cancel', 'done'],

    setup(props, { emit }) {
      const date = ref(formatDateToDay());
      const periodicity = ref('one-time');
      const label = ref('');
      const labels = extractExpensesLabels(store.expenses, props.category);

      const amount = ref('0.00');
      const sign = ref('-');
      const type = ref('card');
      const typeDefs = getExpenseTypeDefs();

      const refAmount = ref(null);

      watch(periodicity, (value) => {
        date.value = value === 'monthly' ? formatDateToMonth() : formatDateToDay();
      });

      onMounted(focusAmount);

      return {
        amount,
        cancel,
        date,
        done,
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

      function cancel(): void {
        emit('cancel');
      }

      function done(): void {
        emit('done', {
          amount: Number(amount.value) * (sign.value === '-' ? -1 : +1),
          periodicity: periodicity.value,
          date: date.value,
          type: type.value,
          label: label.value,
        });
      }

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
    },
  });
</script>

<!-- ----------------------------------------------------------------------- -->
<!-- STYLE -->
<!-- ----------------------------------------------------------------------- -->

<style lang="scss" scoped>
  @import '../theme.scss';

  section {
    margin-bottom: 20px;
  }

  label {
    display: block;
  }

  article {
    height: 50px;
    display: flex;
    justify-content: stretch;
    border: 1px solid black;
    border-radius: 6px;

    &:focus-within {
      background: #ffedcc;
      border: 3px solid #ffa500;
    }

    input,
    select {
      display: block;
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
    border: 1px solid black;
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
