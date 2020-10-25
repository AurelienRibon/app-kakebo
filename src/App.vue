<template>
  <main>
    <section>
      <Home></Home>
    </section>
  </main>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import Home from './components/Home.vue';

  export default defineComponent({
    components: { Home },
  });
</script>

<style lang="scss" src="./main.scss"></style>

<style lang="scss" scoped>
  main {
    height: 100vh;

    display: flex;
    flex-direction: column;
  }

  section {
    overflow-y: scroll;
  }
</style>
