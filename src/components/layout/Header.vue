<template>
  <div class="header-container">
    <b-row class="header ml-0 mr-0">
      <b-col>
        <div class="brand mr-2">
          <img src="/static/imgs/icon.png">
        </div>
        <router-link :to="{ name: 'Student_Club'}" class="font-white decoration-none">
          ระบบลงทะเบียนชุมนุมออนไลน์
        </router-link>
      </b-col>
    </b-row>
    <b-row class="club-profile m-0 mb-3" v-if="user.profile">
      <b-col class="text-right">
        {{ user.profile.prefix }}{{ user.profile.firstname}} {{ user.profile.lastname}} (
        <span class="font-red" v-if="user.permission >= 2">Teacher Mode </span>
        <span v-else>{{ user.studentId }}</span>
        )
        <router-link :to="{name: 'Logout'}" class="font-danger">ออกจากระบบ</router-link>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'Header',
  data() {
    return {
      user: this.getUser()
    };
  },
  methods: {
    ...mapGetters(['getUser'])
  }
};
</script>

<style>

</style>
