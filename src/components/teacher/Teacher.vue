<template>
  <div class="teacher">
    <headerContainer></headerContainer>
    <router-view/>
  </div>
</template>

<script>
import headerContainer from '../layout/Header';
export default {
  name: 'Teacher',

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
