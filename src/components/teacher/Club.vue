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
                  <b-col class="text-right">
                    <b-form @submit.prevent="printUser(club, index)">
                      <button class="button info text-right" style="width: 100px" :class="{'disabled': club.student.length == 0}" :disabled="club.student.length == 0">
                        ปริ้นรายชื่อ
                      </button>
                    </b-form>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <b-table responsive striped hover sm :items="club.student" :fields="fields" :id="'table-' + index">
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
import XLSX from "xlsx";
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
    ...mapGetters(["getUser", "getClubList"]),

    printUser(data, index) {
      var fields = [
        [data.name],
        ["ลำดับ", "รหัสนักเรียน", "ชื่อเต็ม", "ชั้น", "ห้อง"]
      ];
      data.student.forEach(item => {
        fields.push([
          index,
          item.studentId,
          item.prefix + item.firstname + " " + item.lastname,
          item.education.level,
          item.education.class
        ]);
      });

      const ws = XLSX.utils.aoa_to_sheet(fields);
      const wb = XLSX.utils.book_new();

      ws["!cols"] = [
        { wch: 6 },
        { wch: 10 },
        { wch: 25 },
        { wch: 10 },
        { wch: 6 }
      ];

      XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
      XLSX.writeFile(wb, data.name + ".xlsx");
    }
  }
};
</script>

<style>
</style>
