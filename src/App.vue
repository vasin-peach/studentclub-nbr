<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  name: 'App',
  mounted() {
    this.session();
  },
  methods: {
    ...mapActions(['session'])
  }
};
</script>

<style>

</style>
