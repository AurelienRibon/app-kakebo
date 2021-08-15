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
  import { getCategoryDefaultKind } from '../lib/categories';
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
      const kind = getCategoryDefaultKind(props.category);
      const expense = new Expense({ category: props.category, kind });
      const refDetails = ref(null);

      return { cancel, done, expense, refDetails };

      function cancel(): void {
        emit('cancel');
      }

      function done(): void {
        const el = refDetails.value as typeof ExpenseDetails | null;
        emit('done', el && el.bundle());
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
