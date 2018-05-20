<template>
  <div class="teacher-option">

    <!-- Button Link Main -->
    <router-link :to="{ name: 'Student_Club'}" class="main-button-link" v-if="user.permission >= 2">
      <i class="fas fa-chevron-circle-left"></i>
      <div class="button-text">หน้าหลัก</div>
    </router-link>

    <b-row class="teacher-option-body m-0">
      <b-col class="text-center mt-2">
        <hr>
        <span class="color-danger bold">ปิด</span>
        <switches v-model="enabled" theme="bootstrap" :color="color"></switches>
        <span class="color-success bold">เปิด</span>
      </b-col>
      <b-col cols="12" class="text-center color-danger">
        ปิดหรือเปิดการลงทะเบียนชุมนุมของนักเรียน <br> เมื่อทำการปิดนักเรียนจะไม่สามารถเข้าสู่ระบบได้ <hr>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Switches from "vue-switches";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Teacher_Option",

  mounted() {
    this.webEnabledState().then(response => {
      this.$set(this, "enabled", response);
      this.$set(this, "color", response ? "success" : "danger");
    });
  },

  // ---------- //
  // -- DATA -- //
  // ---------- //

  data() {
    return {
      user: this.getUser(),
      enabled: false,
      color: "danger"
    };
  },

  // ----------- //
  // -- WATCH -- //
  // ----------- //

  watch: {
    enabled: function(value) {
      this.color = value ? "success" : "danger";
      this.webEnabled({ token: this.user.token, data: value });
    }
  },

  // ------------- //
  // -- METHODS -- //
  // ------------- //

  methods: {
    ...mapGetters(["getUser"]),
    ...mapActions(["webEnabled", "webEnabledState"])
  },

  components: {
    Switches
  }
};
</script>

<style>
</style>
