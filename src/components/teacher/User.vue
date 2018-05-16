<template>
  <div id="teacher_user" class="teacher-user">

    <!-- Popup Add User -->
    <b-modal size="lg" id="addUser" ref="addUser" title="เพิ่มนักเรียน" hide-footer>
      <b-form>
        <b-form-file @change="loadFile" v-model="file" :state="Boolean(file)" placeholder="เลือกไฟล์ excel" accept=".csv, .xls, .xlsx"></b-form-file>
        <!-- <div v-for="items in uploadData" v-if="uploadData"> -->
          <b-table small responsive striped :items="uploadData">
          </b-table>
        <!-- </div> -->
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

    <!-- <b-row class="teacher-user-header m-0 mb-3">
      <b-col class="club-search mb-2" cols="12" sm="4" md="4" lg="4">
        <b-form @submit.prevent="searchUser(search)">
          <b-form-input v-model="search" type="text" placeholder="ค้นหาชื่อ" :disabled="!user"></b-form-input>
        </b-form>
      </b-col>
    </b-row> -->
    <b-row class="teacher-user-body m-0">
      <b-col>
        <b-table small responsive striped hover :items="userList" :fields="userStruc">
          <template slot="name" slot-scope="data">
            {{ data.item.prefix }}{{ data.item.firstname}} {{ data.item.lastname}}
          </template>
          <template slot="club" slot-scope="data">
            {{ data.item.club || 'ไม่ได้ลง'}}
          </template>
          <template slot="menu" slot-scope="data">
            <button class="button danger" @click="userRemoveAction(data.item)">ลบ</button>
          </template>
        </b-table>
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

  // ---------- //
  // -- DATA -- //
  // ---------- //

  data() {
    return {
      uploadData: null,
      file: null,
      user: this.getUser(),
      userList: this.getUserList(),
      userStruc: [
        { key: "studentId", sortable: true, label: "รหัส" },
        { key: "name", label: "ชื่อเต็ม" },
        { key: "club", label: "ชุมนุมที่ลง" },
        { key: "education.level", sortable: true, label: "ชั้น" },
        { key: "education.class", sortable: true, label: "ห้อง" },
        { key: "menu", label: "" }
      ],
      search: null
    };
  },

  // ------------- //
  // -- METHODS -- //
  // ------------- //

  methods: {
    ...mapGetters(["getUser", "getUserList"]),
    ...mapActions(["userRemove", "reqAllUser"]),

    loadFile(files) {
      var _this = this;
      var file = files.target.files[0];
      var reader = new FileReader();

      reader.onload = function() {
        var fileData = reader.result;
        var wb = XLSX.read(fileData, {type : 'binary'});

        wb.SheetNames.forEach(function(sheetName){
          var rowObj = XLSX.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);
          _this.uploadData = rowObj
        })
      }
      reader.readAsBinaryString(file);
    },

    // show modal
    userAddActive() {
      this.$refs.addUser.show();
    },

    // club remove active
    userRemoveAction(data) {
      swal({
        type: "warning",
        title: "ยืนยันการลบนักเรียน",
        html:
          'ต้องการลบนักเรียนรหัส <b class="font-bold">' +
          data.studentId +
          "</b> ใช่หรือไม่?",
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
                  studentId: data.studentId,
                  token: this.user.token
                })
                  .then(response => {
                    this.reqAllUser(this.user.token).then(response => {
                      swal({
                        type: "success",
                        title: "ลบนักเรียนเสร็จสิ้น"
                      });
                    });
                  })
                  .catch(err => {
                    if (err.response.data.message == "user not found.") {
                      swal({
                        type: "error",
                        title: "ไม่สามารถลบได้",
                        text: "ไม่พบนักเรียนคนนี้ในระบบ กรุณาลองใหม่อีกครั้ง"
                      });
                    } else {
                      swal({
                        type: "error",
                        title: "ไม่สามารถลบได้",
                        text:
                          "เกิดข้อผิดพลาด กรุณาลองใหม่ หรือติดต่อผู้ดูแลระบบ"
                      });
                    }
                  });
              }
            }
          });
        }
      });
    }
  }
};
</script>

<style>
</style>
