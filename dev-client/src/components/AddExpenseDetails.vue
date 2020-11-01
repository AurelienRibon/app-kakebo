<!-- ----------------------------------------------------------------------- -->
<!-- TEMPLATE -->
<!-- ----------------------------------------------------------------------- -->

<template>
  <main>
    <section>
      <label>montant</label>
      <input :value="amount" type="number" autofocus inputmode="numeric" @beforeinput="amountChanged" />
    </section>

    <section>
      <label for="date">date</label>
      <input id="date" v-model="date" type="date" :disabled="dateDisabled" />
    </section>

    <section>
      <label>périodicité</label>
      <select v-model="periodicity">
        <option value="one-time">ponctuel</option>
        <option value="monthly">une fois par mois</option>
      </select>
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
      <label for="label">libellé</label>
      <input id="label" type="text" />
    </section>

    <section>
      <label for="note">commentaire</label>
      <input id="note" type="text" />
    </section>
  </main>
</template>

<!-- ----------------------------------------------------------------------- -->
<!-- CODE -->
<!-- ----------------------------------------------------------------------- -->

<script lang="ts">
  import { computed, defineComponent, ref } from 'vue';
  import { updateAmount } from '../lib/amounts';
  import { formatDateToDay } from '../lib/dates';
  import { getExpenseTypeDefs } from '../lib/expenses';

  export default defineComponent({
    emits: ['done'],

    setup() {
      const date = ref(formatDateToDay(new Date()));
      const amount = ref('0.00');
      const periodicity = ref('one-time');
      const type = ref('card');
      const typeDefs = getExpenseTypeDefs();
      const dateDisabled = computed(() => periodicity.value !== 'one-time');

      const amountChanged = (event: InputEvent) => {
        event.preventDefault();

        switch (event.inputType) {
          case 'deleteContentBackward':
            amount.value = updateAmount(amount.value, null);
            break;
          case 'insertText':
            if (typeof event.data === 'string' && /^\d$/.test(event.data)) {
              amount.value = updateAmount(amount.value, event.data);
            }
            break;
        }
      };

      return { date, amount, periodicity, type, typeDefs, dateDisabled, amountChanged };
    },
  });
</script>

<!-- ----------------------------------------------------------------------- -->
<!-- CODE -->
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
</style>
