<template>
  <div id="app-logout">

  </div>
</template>

<script>
import { mapActions } from 'vuex';
import router from '../../router';
export default {
  name: 'logout',
  mounted() {
    this.logout();
  },
  methods: {
    ...mapActions(['logout'])
  }
};
</script>

<style>

</style>
