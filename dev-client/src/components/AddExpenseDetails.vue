<!-- ----------------------------------------------------------------------- -->
<!-- TEMPLATE -->
<!-- ----------------------------------------------------------------------- -->

<template>
  <ExpenseDetails ref="refDetails" autofocus :expense="expense"></ExpenseDetails>
  <ButtonsGroup class="buttons">
    <button v-ripple v-tap class="btn-flat" @tap="cancel">ANNULER</button>
    <button v-ripple v-tap class="btn-primary" @tap="done">AJOUTER</button>
  </ButtonsGroup>
</template>

<!-- ----------------------------------------------------------------------- -->
<!-- CODE -->
<!-- ----------------------------------------------------------------------- -->

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { getCategoryDef } from '../lib/categories';
  import { config } from '../models/config';
  import { Expense } from '../models/expense';
  import ButtonsGroup from './ButtonsGroup.vue';
  import ExpenseDetails from './ExpenseDetails.vue';

  export default defineComponent({
    components: { ButtonsGroup, ExpenseDetails },

    props: {
      category: {
        type: String,
        required: true,
      },
    },

    emits: ['cancel', 'done'],

    setup(props, { emit }) {
      const kind = getCategoryDef(props.category).defaultKind;
      const expense = new Expense({ category: props.category, kind, date: config.lastExpenseDate });
      const refDetails = ref(null);

      return { cancel, done, expense, refDetails };

      function cancel(): void {
        emit('cancel');
      }

      function done(): void {
        const el = refDetails.value as typeof ExpenseDetails | null;
        const expenseSpec = el?.bundle();
        config.lastExpenseDate = expenseSpec.date;
        emit('done', expenseSpec);
      }
    },
  });
</script>

<!-- ----------------------------------------------------------------------- -->
<!-- STYLE -->
<!-- ----------------------------------------------------------------------- -->

<style lang="scss" scoped>
  .buttons {
    margin-top: 30px;
  }
</style>
