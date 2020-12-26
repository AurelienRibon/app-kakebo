<!-- ----------------------------------------------------------------------- -->
<!-- TEMPLATE -->
<!-- ----------------------------------------------------------------------- -->

<template>
  <main>
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
      <input type="text" />
    </section>

    <section>
      <label>commentaire</label>
      <input type="text" />
    </section>

    <ButtonsSection class="buttons">
      <button v-ripple v-tap class="btn-secondary" @tap="cancel">ANNULER</button>
      <button v-ripple v-tap class="btn-primary-2" @tap="done">AJOUTER</button>
    </ButtonsSection>
  </main>
</template>

<!-- ----------------------------------------------------------------------- -->
<!-- CODE -->
<!-- ----------------------------------------------------------------------- -->

<script lang="ts">
  import { defineComponent, ref, watch } from 'vue';
  import { updateAmount } from '../lib/amounts';
  import { formatDateToDay, formatDateToMonth } from '../lib/dates';
  import { getExpenseTypeDefs } from '../lib/expenses';
  import ButtonsSection from './ButtonsSection.vue';

  export default defineComponent({
    components: { ButtonsSection },
    emits: ['cancel', 'done'],

    setup(props, context) {
      const date = ref(formatDateToDay());
      const periodicity = ref('one-time');

      watch(periodicity, (value) => {
        date.value = value === 'monthly' ? formatDateToMonth() : formatDateToDay();
      });

      const amount = ref('0.00');

      const onAmountInput = (event: InputEvent) => {
        event.preventDefault();
        amount.value = setAmount(event, amount.value);
      };

      const type = ref('card');
      const typeDefs = getExpenseTypeDefs();

      const cancel = () => context.emit('cancel');
      const done = () => context.emit('done', bundle());

      return { date, periodicity, amount, onAmountInput, type, typeDefs, cancel, done };

      function bundle() {
        return {
          amount: -Number(amount.value),
          periodicity: periodicity.value,
          date: date.value,
          type: type.value,
        };
      }

      function setAmount(event: InputEvent, amount: string): string {
        if (event.inputType === 'deleteContentBackward') {
          return updateAmount(amount, null);
        } else if (event.inputType === 'insertText' && typeof event.data === 'string' && /^\d$/.test(event.data)) {
          return updateAmount(amount, event.data);
        } else {
          return amount;
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
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 15px;
    background: $accent1;
    border-top: 1px solid black;
  }
</style>
