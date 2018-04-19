<template>
  <div id="app-student-club">
    <div class="club-container">
      <div class="header row m-0">
        Header
      </div>
      <div class="body">
        <transition name="app-fade" mode="out-in">
          <div v-if="getClubAll()">
            <b-row class="club-block m-0">
              <b-col v-for="data in getClubRange(this.$store.state)(0, 24)" :key="data.key" cols="12" sm="6" md="4" lg="3" xl="2">
                <b-card :title="data.name" :img-src="data.img" img-top>
                  <p class="card-text">
                    {{ data.desc || 'ไม่มีคำอธิบาย.'}}
                  </p>
                </b-card>
              </b-col>
            </b-row>
          </div>
          <div class="loading-half-wrapper" v-else>
            <div class="loading-half-fade">
              <div class="loading-half-block">
                <div class="text-center">
                  <i class="fas fa-spinner fa-spin"></i><br>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'student_club',
  methods: {
    ...mapGetters(['getClubAll', 'getClubRange'])
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

