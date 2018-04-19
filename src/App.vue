<template>
  <div id="app">
    <transition name="app-fade" mode="out-in">
      <div v-if="loading.loading.full">
        <div class="loading-wrapper">
          <div class="loading-fade"></div>
          <div class="loading-block">
            <div class="text-center">
              <i class="fas fa-spinner fa-spin"></i><br>
              <span>L</span>
              <span>O</span>
              <span>A</span>
              <span>D</span>
              <span>I</span>
              <span>N</span>
              <span>G</span>
              <span>.</span>
              <span>.</span>
            </div>
          </div>
        </div>
      </div>
      <transition name="app-fade" mode="out-in" v-else>
        <router-view/>
      </transition>
    </transition>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
export default {
  name: 'App',
  mounted() {
    // this.session();
  },
  computed: {
    ...mapState(['loading'])
  },
  methods: {
    // ...mapActions(['session'])
  }
};
</script>

<style>
.app-fade-enter-active,
.app-fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}
.app-fade-enter,
.app-fade-leave-to {
  opacity: 0;
}
</style>
