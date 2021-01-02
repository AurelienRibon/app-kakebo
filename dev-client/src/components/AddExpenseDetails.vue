<!-- ----------------------------------------------------------------------- -->
<!-- TEMPLATE -->
<!-- ----------------------------------------------------------------------- -->

<template>
  <section>
    <label>montant</label>
    <input v-autofocus :value="amount" type="number" inputmode="numeric" @beforeinput="onAmountInput" />
  </section>

  <section>
    <label>périodicité</label>
    <select v-model="periodicity">
      <option value="one-time">ponctuel</option>
      <option value="monthly">une fois par mois</option>
    </select>
  </section>

  <section v-if="periodicity === 'one-time'">
    <label>date</label>
    <input v-model="date" type="date" />
  </section>

  <section v-if="periodicity === 'monthly'">
    <label>date de début</label>
    <input v-model="date" type="month" />
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
        @tap="type = def.name"
      >
        <i class="mdi" :class="def.icon"></i>
      </div>
    </div>
  </section>

  <section>
    <label>libellé</label>
    <input v-model="label" type="text" list="labels" />

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
  import { defineComponent, ref, watch } from 'vue';
  import { updateAmount } from '../lib/amounts';
  import { formatDateToDay, formatDateToMonth } from '../lib/dates';
  import { extractExpensesLabels } from '../lib/expenses';
  import { getExpenseTypeDefs } from '../models/expense';
  import { store } from '../models/store';
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
      const type = ref('card');
      const typeDefs = getExpenseTypeDefs();

      watch(periodicity, (value) => {
        date.value = value === 'monthly' ? formatDateToMonth() : formatDateToDay();
      });

      return { date, periodicity, label, labels, amount, onAmountInput, type, typeDefs, cancel, done };

      function cancel(): void {
        emit('cancel');
      }

      function done(): void {
        emit('done', {
          amount: -Number(amount.value),
          periodicity: periodicity.value,
          date: date.value,
          type: type.value,
          label: label.value,
        });
      }

      function onAmountInput(event: InputEvent): void {
        event.preventDefault();

        if (event.inputType === 'deleteContentBackward') {
          amount.value = updateAmount(amount.value, null);
        } else if (event.inputType === 'insertText' && typeof event.data === 'string' && /^\d$/.test(event.data)) {
          amount.value = updateAmount(amount.value, event.data);
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

  input,
  select {
    display: block;
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-size: 1.8em;
    border: 1px solid black;
    border-radius: 6px;
    outline: none;
    padding: 0 10px;

    &[inputmode='numeric'] {
      text-align: right;
      caret-color: #0000;
    }

    &:focus {
      background: #ffedcc;
      border: 3px solid #ffa500;
      padding: 0 8px;
      line-height: 46px;
    }
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
