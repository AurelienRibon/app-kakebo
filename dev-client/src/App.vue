<!-- ----------------------------------------------------------------------- -->
<!-- TEMPLATE -->
<!-- ----------------------------------------------------------------------- -->

<template>
  <main>
    <Home></Home>
  </main>
</template>

<!-- ----------------------------------------------------------------------- -->
<!-- CODE -->
<!-- ----------------------------------------------------------------------- -->

<script lang="ts">
  import { defineComponent } from 'vue';
  import Home from './components/Home.vue';

  export default defineComponent({
    components: { Home },
  });
</script>

<!-- ----------------------------------------------------------------------- -->
<!-- STYLE -->
<!-- ----------------------------------------------------------------------- -->

<style lang="scss" src="./main.scss"></style>

<style lang="scss" scoped>
  main {
    height: 100vh;
    overflow-y: scroll;

    display: flex;
    flex-direction: column;
  }
</style>
