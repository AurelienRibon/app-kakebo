<!-- ----------------------------------------------------------------------- -->
<!-- TEMPLATE -->
<!-- ----------------------------------------------------------------------- -->

<template>
  <main>
    <h1>DATE</h1>

    <form action="#">
      <input ref="input" type="date" />
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

  export default defineComponent({
    emits: ['date-chosen'],

    computed: {
      input(): HTMLInputElement {
        return this.$refs.input as HTMLInputElement;
      },
    },

    mounted() {
      this.reset();
      this.focus();
    },

    methods: {
      reset(): void {
        const today = new Date().toISOString().slice(0, 10);
        this.input.value = today;
      },
      focus(): void {
        this.input.focus();
      },
      onOkClick(): void {
        const date = new Date(this.input.value);
        this.$emit('date-chosen', date);
      },
    },
  });
</script>

<!-- ----------------------------------------------------------------------- -->
<!-- STYLE -->
<!-- ----------------------------------------------------------------------- -->

<style lang="scss" scoped>
  main {
    background: transparent;
  }

  input {
    caret-color: transparent;
    outline: none;
    border: 0;
    background: #093759;
    color: white;
    font-size: 20px;
    padding: 10px;
    width: 100%;
  }

  .buttons {
    margin-top: 20px;
    text-align: right;
  }
</style>
