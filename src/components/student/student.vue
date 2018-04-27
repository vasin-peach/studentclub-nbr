<template>
  <div class="app-student">
    <headerContainer></headerContainer>
    <router-view/>
  </div>
</template>

<script>
import headerContainer from '../layout/Header';
export default {
  name: 'student',

  // -------------- //
  // -- TEMPLATE -- //
  // -------------- //

  components: {
    headerContainer
  }
};
</script>

<style>

</style>
