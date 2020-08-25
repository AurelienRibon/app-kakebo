<template>
  <section>
    <main>
      <AddExpense></AddExpense>
    </main>
  </section>
</template>

<style lang="scss" scoped>
  section {
    height: 100vh;

    display: flex;
    flex-direction: column;
  }

  main {
    flex: 1;
    padding: 20px;

    display: flex;
    flex-direction: column;

    overflow-y: auto;
  }
</style>

<script>
  import AddExpense from './components/AddExpense.vue';

  export default {
    components: { AddExpense },
  };
</script>
