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

<script>
  export default {
    mounted() {
      this.reset();
      this.focus();
    },

    methods: {
      reset() {
        const today = new Date().toISOString().slice(0, 10);
        this.$refs.input.value = today;
      },
      focus() {
        this.$refs.input.focus();
      },
      onOkClick() {
        const date = new Date(this.$refs.input.value);
        console.log(date);
        this.$emit('dateChosen', date);
      },
    },
  };
</script>
