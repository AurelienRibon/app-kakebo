<!-- ----------------------------------------------------------------------- -->
<!-- TEMPLATE -->
<!-- ----------------------------------------------------------------------- -->

<template>
  <main>
    <section>
      <label>montant</label>
      <input v-model="amount" type="text" inputmode="numeric" />
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
        <div class="type-selected"><i class="mdi mdi-credit-card"></i></div>
        <div><i class="mdi mdi-cash-100"></i></div>
        <div><i class="mdi mdi-checkbook"></i></div>
        <div><i class="mdi mdi-bank-transfer-out"></i></div>
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
  import { formatDateToDay } from '../lib/dates';

  export default defineComponent({
    emits: ['done'],

    setup() {
      const date = ref(formatDateToDay(new Date()));
      const amount = ref(0);
      const periodicity = ref('one-time');
      const dateDisabled = computed(() => periodicity.value !== 'one-time');

      return { date, amount, periodicity, dateDisabled };
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

      &.type-selected {
        background: $accent1;
      }
    }
  }
</style>
