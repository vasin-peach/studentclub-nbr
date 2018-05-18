<template>
  <div id="teacher_user" class="teacher-user">

    <!-- Popup Add User -->
    <b-modal size="lg" id="addUser" ref="addUser" title="เพิ่มนักเรียน" hide-footer>
      <div class="mb-2">
        <a href="/static/files/แบบฟอร์มเพิ่มนักเรียน.xlsx" target="_blank">ดาวน์โหลดแบบฟอร์มสำหรับเพิ่มนักเรียน</a>
      </div>
      <b-form class="row m-0">
        <b-form-file class="col" @change="loadFile" v-model="file" :state="Boolean(file)" placeholder="เลือกไฟล์ excel" accept=".csv, .xls, .xlsx"></b-form-file>
        <div class="btn btn-success col-1 ml-2" @click="addUserSubmit()">เพิ่ม</div>
        <b-table small responsive striped :items="uploadData">
        </b-table>
      </b-form>
    </b-modal>

    <!-- Button Link Main -->
    <router-link :to=" { name: 'Student_Club'} " class="main-button-link " v-if="user.permission>= 2">
      <i class="fas fa-chevron-circle-left"></i>
      <div class="button-text">หน้าหลัก</div>
    </router-link>

    <div class="user-button-link" v-if="user.permission >= 2" @click="userAddActive()">
      <i class="fas fa-plus-circle"></i>
      <div class="button-text">เพิ่ม</div>
    </div>

    <b-row class="teacher-user-head m-0">
      <b-col>
        <b-form @submit.prevent="searchUser(search)">
          <b-form-input name="filter-search" v-model="search" placeholder="ค้นหาโดยชื่อ" :disabled="!userList"></b-form-input>
        </b-form>
      </b-col>
      <b-col cols="12" sm="4">
        <b-form-group class="font-bold">
          <b-form-select v-model="level" :disabled="!userList">
            <option :value="null">-- เลือกตามชั้นปี --</option>
            <option :value="'1'">ชั้นมัธยมปีที่ 1</option>
            <option :value="'2'">ชั้นมัธยมปีที่ 2</option>
            <option :value="'3'">ชั้นมัธยมปีที่ 3</option>
            <option :value="'4'">ชั้นมัธยมปีที่ 4</option>
            <option :value="'5'">ชั้นมัธยมปีที่ 5</option>
            <option :value="'6'">ชั้นมัธยมปีที่ 6</option>
          </b-form-select>
        </b-form-group>
      </b-col>
    </b-row>

    <b-row class="teacher-user-title m-0 mb-3">
      <b-col class="flex-right">
        <div class="button info text-center mr-2" style="width: 110px" @click="checkAll()">เลือกทั้งหน้า</div>
        <div class="button danger text-center" style="width: 50px" :class="{'disabled': Object.values(check).filter(item => { return item != false }).length == 0}" @click="userRemoveActive()">ลบ</div>
      </b-col>
    </b-row>

    <transition name="app-fade" mode="out-in">
      <b-row class="teacher-user-body m-0" v-if="!loading">
        <b-col>
          <div v-if="userListShow == 'empty'" class="text-center mb-3">
            <i class="fas fa-exclamation-circle fa-3x mb-1"></i> <br> ไม่พบข้อมูล
          </div>
          <b-table small responsive striped hover :items="userListShow" :fields="userStruc" v-else>
            <template slot="check" slot-scope="data">
              <b-form-checkbox v-model="check[data.index]" :value="data.item.studentId" style="position: relative; left: 40%; top: 4px; tranform: translateX: -50%;"></b-form-checkbox>
            </template>
            <template slot="name" slot-scope="data">
              {{ data.item.prefix }}{{ data.item.firstname}} {{ data.item.lastname}}
            </template>
            <template slot="club" slot-scope="data">
              {{ data.item.club || 'ไม่ได้ลง'}}
            </template>
          </b-table>
        </b-col>
      </b-row>
    </transition>

    <b-row class="teacher-user-footer m-0">
      <b-col v-if="userListTemp && !loading">
        <b-pagination class="flex-center" size="md" :total-rows="userListTemp.length" v-model="currentPage" :per-page="30" :disabled="userListShow == 'empty' || !user">
        </b-pagination>
      </b-col>
    </b-row>

  </div>
</template>

<script>
import XLSX from "xlsx";
import { mapGetters, mapActions } from "vuex";
import swal from "sweetalert2";
export default {
  name: "Teacher_User",

  created() {
    this.initUser();
  },

  // ----------- //
  // -- WATCH -- //
  // ----------- //

  watch: {
    search: function(sId) {
      var _this = this;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(function() {
        _this.searchUser(sId);
      }, 500);
    },

    level: function(m) {
      if (!m) return (this.userListTemp = this.userList);
      this.userListTemp = this.userList.filter(item => {
        return item.education.level == m;
      });
    },

    userListTemp: function(data) {
      if (data) {
        if (data.length == 0) {
          this.userListShow = "empty";
        } else {
          this.userListShow = this.userListTemp.slice(this.start, this.end);
        }
      }
    },

    userListShow: function(data) {
      this.loading = true;
      var _this = this;
      setTimeout(() => {
        _this.loading = false;
      }, 500);
    },

    currentPage: function(page) {
      this.start = 30 * (page - 1);
      this.end = 30 * page;
      this.userListShow = this.userListTemp.slice(this.start, this.end);
    }
  },

  // ---------- //
  // -- DATA -- //
  // ---------- //

  data() {
    return {
      check: [false],
      unCheck: 0,
      start: 0,
      end: 30,
      currentPage: 1,
      loading: false,
      search: null,
      level: null,
      uploadData: null,
      file: null,
      user: this.getUser(),
      userList: this.getUserList(),
      userListTemp: null,
      userListShow: null,
      userStruc: [
        { key: "check", label: "" },
        { key: "studentId", sortable: true, label: "รหัส" },
        { key: "name", label: "ชื่อเต็ม" },
        { key: "club", label: "ชุมนุมที่ลง" },
        { key: "education.level", sortable: true, label: "ชั้น" },
        { key: "education.class", sortable: true, label: "ห้อง" }
      ]
    };
  },

  // ------------- //
  // -- METHODS -- //
  // ------------- //

  methods: {
    ...mapGetters(["getUser", "getUserList"]),
    ...mapActions(["userRemove", "reqAllUser", "userAdd"]),

    // check all
    checkAll() {
      if (this.unCheck == 0) {
        Object.keys(this.userListShow).forEach(key => {
          this.$set(this.check, key, this.userListShow[key].studentId);
          this.unCheck = 1;
        });
      } else {
        Object.keys(this.userListShow).forEach(key => {
          this.$set(this.check, key, false);
          this.unCheck = 0;
        });
      }
    },

    // Init User
    initUser() {
      if (this.userList) {
        this.userListTemp = this.userList;
        this.search = null;
        this.level = null;
      }
    },

    // Search User
    searchUser(sId) {
      if (this.userListTemp) {
        this.userListTemp = this.userList.filter(data => {
          var fullname =
            data.prefix + data.firstname + data.lastname + data.studentId;
          return fullname.indexOf(sId) > -1;
        });
      }
    },

    addUserSubmit() {
      this.userAdd({ token: this.user.token, data: this.uploadData })
        .then(resposne => {
          this.reqAllUser(this.user.token).then(response => {
            swal({
              type: "success",
              title: "เพิ่มนักเรียนเสร็จสิ้น",
              text: "ได้บันทึกนักเรียนทั้งหมดลงในฐานข้อมูลแล้ว."
            });
          });
        })
        .catch(err => {
          swal({
            type: "error",
            title: "ผิดพลาด",
            text: "ไม่สามารถเพิ่มนักเรียนได้ กรุณาติดต่อผู้ดูแลระบบ."
          });
        });
    },

    loadFile(files) {
      var _this = this;
      var file = files.target.files[0];
      var reader = new FileReader();
      if (file) {
        reader.onload = function() {
          var fileData = reader.result;
          var wb = XLSX.read(fileData, { type: "binary" });

          wb.SheetNames.forEach(function(sheetName) {
            var rowObj = XLSX.utils.sheet_to_row_object_array(
              wb.Sheets[sheetName]
            );
            _this.uploadData = rowObj;
          });
        };
        reader.readAsBinaryString(file);
      }
    },

    // show modal
    userAddActive() {
      this.$refs.addUser.show();
    },

    // club remove active
    userRemoveActive() {
      // create user list by index
      var data = this.check;

      swal({
        type: "warning",
        title: "ยืนยันการลบนักเรียน",
        text: "ต้องการลบนักเรียนที่เลือก ใช่หรือไม่?",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "ใช่, ลบ",
        cancelButtonText: "ไม่, ยกเลิก"
      }).then(result => {
        if (result.value) {
          // password confirm
          swal({
            type: "warning",
            title: "ยืนยันรหัสผ่าน",
            text: "กรุณาใส่รหัสผ่านของคุณ",
            input: "password",
            showCancelButton: true,
            confirmButtonText: "ยืนยัน",
            showLoaderOnConfirm: true,
            preConfirm: password => {
              // password was wrong
              if (this.user.profile.password != password) {
                swal.showValidationError("รหัสผ่านไม่ถูกต้อง");
              } else {
                this.userRemove({
                  data: data,
                  token: this.user.token
                })
                  .then(response => {
                    this.reqAllUser(this.user.token).then(response => {
                      this.initUser();
                      swal({
                        type: "success",
                        title: "ลบนักเรียนเสร็จสิ้น",
                        text: "นักเรียนที่เลือกได้ถูกลบแล้ว"
                      });
                    });
                  })
                  .catch(err => {
                    swal({
                      type: "error",
                      title: "ไม่สามารถลบได้",
                      text: "เกิดข้อผิดพลาด กรุณาลองใหม่ หรือติดต่อผู้ดูแลระบบ"
                    });
                  });
              }
            }
          });
        }
      });
    }
  },

  computed: {}
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
