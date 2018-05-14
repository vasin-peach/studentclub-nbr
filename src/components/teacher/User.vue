<template>
  <div id="teacher_user">
    <!-- Button Link Main -->
    <router-link :to="{ name: 'Student_Club'}" class="main-button-link" v-if="user.permission >= 2">
      <i class="fas fa-chevron-circle-left"></i>
      <div class="button-text">หน้าหลัก</div>
    </router-link>
    {{ getUserList() }}
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'Teacher_User',

  // ---------- //
  // -- DATA -- //
  // ---------- //

  data() {
    return {
      user: this.getUser()
    };
  },

  // ------------- //
  // -- METHODS -- //
  // ------------- //

  methods: {
    ...mapGetters(['getUser', 'getUserList'])
  }
};
</script>

<style>

</style>
