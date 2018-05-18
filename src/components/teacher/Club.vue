<template>
  <div id="teacher_club">
    <!-- Button Link Main -->
    <router-link :to="{ name: 'Student_Club'}" class="main-button-link" v-if="user.permission >= 2">
      <i class="fas fa-chevron-circle-left"></i>
      <div class="button-text">หน้าหลัก</div>
    </router-link>

    <b-row class="teacher-club-body m-0">
      <b-col v-if="clubList">
        <div v-for="(club, index) in clubList" :key="club.name">
          <div class="box" v-b-toggle="'club-info-' + index">
            <b-row class="m-0">
              <b-col>
                <span>{{ club.name }}</span>
              </b-col>
              <b-col class="text-right">
                <span>
                  {{ club.entry.current }} / {{ club.entry.max }}
                </span>
              </b-col>
            </b-row>
          </div>
          <b-collapse :id="'club-info-' + index" class="box-collapse">
            <div class="wrapper">
              <p class="card-text">
                <b-row class="m-0 mb-3 mt-2">
                  <b-col>
                    <span style="font-size: 20px;">
                      ชุมนุม:
                      <b>{{ club.name }}</b>
                    </span>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <b-table responsive striped hover sm :items="club.student" :fields="fields">
                      <template slot="name" slot-scope="data">
                        {{ data.item.prefix}}{{ data.item.firstname}} {{ data.item.lastname}}
                      </template>
                      <template slot="level" slot-scope="data">
                        {{ data.item.education.level}}/{{ data.item.education.class }}
                      </template>
                    </b-table>
                  </b-col>
                </b-row>
              </p>
            </div>
          </b-collapse>
        </div>

      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Teacher_Club",

  // ---------- //
  // -- DATA -- //
  // ---------- //

  data() {
    return {
      index: null,
      user: this.getUser(),
      clubList: this.getClubList(),
      fields: [
        { key: "studentId", label: "รหัสนักเรียน", sortable: true },
        { key: "name", label: "ชื่อเต็ม" },
        { key: "level", sortable: true, label: "มัธยม" }
      ]
    };
  },

  // ------------- //
  // -- METHODS -- //
  // ------------- //

  methods: {
    ...mapGetters(["getUser", "getClubList"])
  }
};
</script>

<style>
</style>
