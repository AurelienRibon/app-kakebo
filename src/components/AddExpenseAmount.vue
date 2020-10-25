<!-- ----------------------------------------------------------------------- -->
<!-- TEMPLATE -->
<!-- ----------------------------------------------------------------------- -->

<template>
  <main>
    <h1>MONTANT</h1>

    <form action="#">
      <div class="signs" @click="onSignsClick">
        <div :class="{ unselected: !positive }">&plus;</div>
        <div :class="{ unselected: positive }">&minus;</div>
      </div>
      <input ref="input" type="text" @keydown="onKeyDown" inputmode="numeric" />
      <div>€</div>
    </form>

    <div class="buttons">
      <button v-ripple @click="onOkClick">OK</button>
    </div>
  </main>
</template>

<!-- ----------------------------------------------------------------------- -->
<!-- CODE -->
<!-- ----------------------------------------------------------------------- -->

<script lang="ts">
  import { defineComponent } from 'vue';
  import { formatAmount } from '../lib/amount-formatter';

  export default defineComponent({
    data() {
      return {
        positive: false,
      };
    },

    mounted() {
      this.reset();
      this.focus();
    },

    methods: {
      reset() {
        this.$refs.input.value = '0.00';
      },
      focus() {
        this.$refs.input.focus();
      },
      onKeyDown(event: KeyboardEvent) {
        event.preventDefault();

        if (event.key === 'Backspace') {
          this.$refs.input.value = '0.00';
        } else if (/\d/.test(event.key)) {
          const value = this.$refs.input.value;
          const newDigit = event.key;
          this.$refs.input.value = formatAmount(value, newDigit);
        }
      },
      onSignsClick() {
        this.positive = !this.positive;
        this.focus();
      },
      onOkClick() {
        const amount = Number(this.$refs.input.value);
        this.$emit('amountChosen', amount);
      },
    },
  });
</script>

<!-- ----------------------------------------------------------------------- -->
<!-- CODE -->
<!-- ----------------------------------------------------------------------- -->

<style lang="scss" scoped>
  main {
    background: transparent;
  }

  form {
    display: flex;

    & > * {
      font-size: 50px;
      color: white;
    }
  }

  input {
    flex: 1;
    caret-color: transparent;
    outline: none;
    border: 0;
    background: none;
    min-width: 0px;
    text-align: right;
  }

  .signs {
    display: flex;

    .unselected {
      color: #5555558a;
    }
  }

  .buttons {
    margin-top: 20px;
    text-align: right;
  }
</style>
