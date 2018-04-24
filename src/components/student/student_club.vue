<template>
  <div id="app-student-club">
    <div class="club-container">
      <b-row class="header ml-0 mr-0">
        <b-col>
          <div class="brand mr-2">
            <img src="/static/imgs/icon.png">
          </div>
          <div class="font-white">
            ระบบลงทะเบียนชุมนุมออนไลน์
          </div>
        </b-col>
      </b-row>
      <div class="body">
        <b-row class="club-profile m-0 mb-3" v-if="user.profile">
          <b-col class="text-right">{{ user.profile.prefix }}{{ user.profile.firstname}} {{ user.profile.lastname}} ( {{ user.studentId }} )
            <router-link :to="{name: 'Logout'}" class="font-danger">ออกจากระบบ</router-link>
          </b-col>
        </b-row>
        <b-row class="club-header m-0 mb-3">
          <b-col class="club-search mb-2" cols="12" sm="6" md="4" lg="6">
            <b-form @submit.prevent="searchClub(search)">
              <b-form-input v-model="search" type="text" placeholder="ค้นหา" :disabled="!clubTemp || clubTemp == 'empty'"></b-form-input>
            </b-form>
          </b-col>
          <b-col class="club-filter mb-2" cols="12" sm="3" md="4" lg="3">
            <b-form @submit.prevent>
              <b-form-select v-model="filter" :disabled="!clubTemp || clubTemp == 'empty'">
                <option :value="null">-- คัดกรอง --</option>
                <option :value="'filter_1'">ยังไม่เต็ม</option>
                <option :value="'filter_2'">เต็มแล้ว</option>
                <option :value="'filter_3'">ระดับชั้น มัธยมต้น</option>
                <option :value="'filter_4'">ระดับชั้น มัธยมปลาย</option>
                <option :value="'filter_5'">ทั้งมัธยมต้นและปลาย</option>
              </b-form-select>
            </b-form>
          </b-col>
          <b-col class="club-sort mb-2" cols="">
            <b-form @submit.prevent>
              <b-form-select v-model="sort" :disabled="!clubTemp || clubTemp == 'empty'">
                <option :value="null">-- เรียงตาม --</option>
                <option :value="'sort_1'">ใหม่ -> เก่า</option>
                <option :value="'sort_2'">เก่า -> ใหม่</option>
                <option :value="'sort_3'">จำนวนที่ลง</option>
                <option :value="'sort_4'">จำนวนที่รับ</option>
              </b-form-select>
            </b-form>
          </b-col>
        </b-row>

        <!-- Popup Entry Club -->
        <b-modal id="entry" ref="entry" hide-footer>
          <div v-if="entry && user">
            <b-img-lazy blank-color="#6a011f" v-bind:src="'/static/clubs/' + entry.img" class="w-100 mb-3" style="object-fit: cover; object-position: center; min-height: 300px" />
            <b-row class="m-0">
              <b-col>
                <p class="h2 font-bold">{{ entry.name }}</p>
                <div v-if="user.permission >= 2">
                  <span class="font-success">แก้ไขชุมนุม</span>
                  <span class="font-danger">ลบชุมนุม</span>
                </div>
              </b-col>
            </b-row>
            <b-row class="m-0">
              <b-col>
                <p>{{ entry.desc || 'ไม่มีคำอธิบาย' }}</p> <hr>
              </b-col>
            </b-row>
            <b-row class="m-0">
              <b-col class="font-bold">ผู้รับผิดชอบ</b-col>
            </b-row>
            <b-row class="m-0" v-for="owner in entry.owner" :key="owner.key">
              <b-col>
                <span>{{ owner.prefix }} {{ owner.firstname }} {{ owner.lastname}}</span>
              </b-col>
            </b-row>
            <b-row class="m-0 mt-3">
              <b-col cols="12" sm="12" md="12">
                <span class="font-bold">ระดับชั้นที่รับ:</span>
                <span>{{ entry.receive == 'both' ? 'ทั้งหมด' : entry.receive == 'junior' ? 'มัธยมต้น' : entry.receive == 'senior' ? 'มันธยมปลาย' : '' }}</span>
              </b-col>
              <b-col class="mt-1" cols="12">
                <span class="font-bold">จำนวน: </span>
                <span :class="{'font-danger': entry.entry.current >= entry.entry.max}">{{ entry.entry.current}} / {{ entry.entry.max }}</span>
                <i class="fas fa-user fa-1x" v-if="entry.entry.current < entry.entry.max"></i>
                <i class="fas fa-user-times fa-1x font-danger" v-else></i><hr>
              </b-col>
            </b-row>
            <b-row class="m-0 p-3">
              <b-col class="text-center">
                <div v-if="entry.receive == 'junior' || entry.recieve == 'senior'">
                  <b-btn class="bg-red" disabled v-if="entry.receive == 'junior' && user.profile.education.level >= 4">เฉพาะมัธยมต้น</b-btn>
                  <b-btn class="bg-red" disabled v-if="entry.receive == 'senior' && user.profile.education.level <= 3">เฉพาะมัธยมต้น</b-btn>
                </div>
                <div v-else-if="entry.entry.current >= entry.entry.max">
                  <b-btn class="bg-red" disabled>จำนวนเต็มแล้ว</b-btn>
                </div>
                <div v-else>
                  <b-btn class="bg-red" @click="submitClub(entry)" v-if="!user.profile.club">ลงทะเบียนชุมนุม</b-btn>
                  <b-btn class="bg-red" disabled v-if="user.profile.club && user.profile.club != entry.name">นักเรียนได้ลงชุมนุม
                    <b class="font-bold font-white">{{user.profile.club}}</b> ไปแล้ว</b-btn>
                  <b-btn class="bg-danger" v-if="user.profile.club == entry.name" @click="cancelClub(entry)">ออกจากชุมนุม</b-btn>
                </div>
              </b-col>
            </b-row>
          </div>
        </b-modal>

        <!-- Popup Edit Club -->
        <b-modal id="edit" ref="edit" title="แก้ไขชุมนุม" hide-footer>
          <div v-if="edit">
            {{ edit }}
          </div>
        </b-modal>

        <!-- Popup Add Club -->
        <b-modal id="add" ref="add" title="เพิ่มชุมนุม" size="lg" hide-footer v-if="user.profile">
          <b-form @submit.prevent="addClubSubmit" v-if="user.profile.permission >= 2">
            <b-form-group name="add_name" label="ชื่อชุมนุม" class="font-bold">
              <b-form-input v-model="clubSubmit.name" v-validate="'required'" type="text" placeholder="ชื่อชุมนุม" required></b-form-input>
            </b-form-group>
            <b-form-group label="รายละเอียดชุมนุม" class="font-bold">
              <b-form-textarea name="add_desc" v-validate="'required'" v-model="clubSubmit.desc" :rows="4" placeholder="รายละเอียดของชุมนุม" required></b-form-textarea>
            </b-form-group>
            <b-row>
              <b-col>
                <b-form-group label="จำนวนที่รับ" class="font-bold">
                  <b-form-input name="add_max" v-validate="'required|numeric'" v-model="clubSubmit.max" type="number" placeholder="จำนวนนักเรียนที่รับ" required></b-form-input>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group label="ชั้นที่รับ" class="font-bold">
                  <b-form-select name="add_receive" v-validate="'required'" v-model="clubSubmit.receive" :options="receiveOptions" placholder="ชั้นปีที่รับ" required></b-form-select>
                </b-form-group>
              </b-col>
            </b-row>
            <b-form-group>
              <span class="font-bold">ผู้รับผิดชอบ</span>
              <span @click="clubOwnerInc(+1)">
                <i class="fas fa-plus-circle font-blue"></i>
              </span>
              <span @click="clubOwnerInc(-1)">
                <i class="fas fa-minus-circle font-danger"></i>
              </span>
              <hr>
              <b-row v-for="item in clubOwnerNum" :key="item">
                <b-col cols="12" sm="3">
                  <b-form-group label="คำนำหน้าชื่อ">
                    <b-form-input name="add_prefix" v-model="clubSubmit.prefix[item]" v-validate="'required'" placeholder="เช่น นาย นางสาว" required></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group label="ชื่อจริง">
                    <b-form-input name="add_firstname" v-model="clubSubmit.firstname[item]" v-validate="'required'" placeholder="เช่น สมศักดิ์" required></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col cols="12" sm="5">
                  <b-form-group label="นามสกุล">
                    <b-form-input name="add_lastname" v-model="clubSubmit.lastname[item]" v-validate="'required'" placeholder="เช่น สมใจหมาย" required></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col cols="12">
                  <hr>
                </b-col>
              </b-row>
            </b-form-group>
            <b-form-group>
              <span class="font-bold">รูปชุมนุม</span>
              <b-form-file name="add_img" v-model="clubSubmit.img" accept=".jpg, .png, .gif" placeholder="เลือกภาพของคุณ..." class="mt-2" required></b-form-file>
              <span v-show="errors.has('add_img')" class="fa-1x font-danger">{{ errors.first('add_img') }}</span>
            </b-form-group>
            <hr>
            <div class="center">
              <b-btn type="submit" class="font-center bg-red">เพิ่มชุมนุม</b-btn>
            </div>
          </b-form>
        </b-modal>

        <!-- Button Add Club -->
        <div class="club-button-add" @click="clubAddActive()" v-if="user.permission >= 2">
          <i class="fas fa-plus-circle"></i>
        </div>

        <transition name="app-fade" mode="out-in">
          <transition-group name="club" class="club-block row m-0" tag="div" v-if="!getLoading().half && clubTemp != 'notfound'">
            <b-col class="club-item" v-for="(data, count) in clubShow" :key="count" cols="12" sm="6" md="4" lg="3" xl="3">
              <div class="card">
                <div class="card-button-edit" @click="clubEditActive(data)" v-if="user.permission >= 2">
                  <i class="fas fa-pen-square"></i>
                </div>
                <div class="card-button-remove" @click="clubRemoveActive(data)" v-if="user.permission >= 2">
                  <i class="fas fa-times-circle"></i>
                </div>
                <div @click="entryClub(data)">
                  <div class="card-img-container">
                    <b-img-lazy blank-color="#6a011f" class="card-img-top" v-bind:src="'/static/clubs/' + data.img" />
                  </div>
                  <div class="card-body">
                    <h4 class="card-title">{{ data.name }}</h4>
                    <p class="card-text">
                      {{ data.desc || ' ไม่มีคำอธิบาย. '}}
                    </p>
                  </div>
                  <div class="card-footer">
                    <b-row class="m-0">
                      <b-col class="p-0" cols="12" sm="12" md="12">
                        ระดับชั้น:
                        <span class="font-light">{{ data.receive == 'both' ? 'ทั้งหมด' : data.receive == 'junior' ? 'มัธยมต้น' : data.receive == 'senior' ? 'มันธยมปลาย' : '' }}</span>
                      </b-col>
                      <b-col class="p-0 mt-1" cols="12">
                        <i class="fas fa-user fa-1x font-red" v-if="data.entry.current < data.entry.max"></i>
                        <i class="fas fa-user-times fa-1x font-danger" v-else></i>
                        <span :class="{'font-danger': data.entry.current >= data.entry.max}">{{ data.entry.current}} / {{ data.entry.max }}</span>
                      </b-col>
                    </b-row>
                  </div>
                </div>
              </div>
            </b-col>
          </transition-group>

          <div class="loading-half-wrapper" v-else>
            <div class="loading-half-fade">
              <div v-if="clubTemp == 'notfound'" class="text-center">
                <i class="fas fa-exclamation-circle fa-3x mb-1"></i> <br> ไม่พบข้อมูล
              </div>
              <div class="loading-half-block" v-else>
                <div class="text-center">
                  <i class="fas fa-spinner fa-spin fa-3x"></i><br>
                </div>
              </div>
            </div>
          </div>
        </transition>
        <div class="footer">
          <b-row class="m-0">
            <b-col v-if="clubShow">
              <b-pagination size="md" :total-rows="clubTemp.length" v-model="currentPage" :per-page="12" :disabled="!clubTemp || clubTemp == 'empty'">
              </b-pagination>
            </b-col>
          </b-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { Validator } from 'vee-validate';
import swal from 'sweetalert2';

const messages = {
  en: {
    messages: {
      digits: (name, val) => 'กรุณาใส่ตัวตัวเลขให้ครบ ' + val + ' ตัว',
      numeric: () => 'จำเป็นต้องเป็นตัวเลขเท่านั้น',
      required: () => 'กรุณากรอกข้อมูล'
    }
  }
};
Validator.localize(messages);

export default {
  name: 'student_club',

  // ---------- //
  // -- DATA -- //
  // ---------- //

  data() {
    return {
      user: this.getUser(),
      search: null,
      filter: null,
      sort: null,
      clubData: null,
      clubTemp: null,
      clubShow: null,
      currentPage: 1,
      notfound: false,
      start: 0,
      end: 12,
      timeout: null,
      entry: null,
      edit: null,
      receiveOptions: [
        { value: 'both', text: 'ทั้งมัธยมต้นและปลาย' },
        { value: 'junior', text: 'เฉพาะมัธยมต้น' },
        { value: 'senior', text: 'เฉพาะมัธยมปลาย' }
      ],
      clubOwnerNum: 1,
      clubSubmit: {
        prefix: {},
        firstname: {},
        lastname: {}
      }
    };
  },

  // ------------- //
  // -- MOUNTED -- //
  // ------------- //

  created() {
    this.initClub();
  },

  // ----------- //
  // -- WATCH -- //
  // ----------- //

  watch: {
    // Search
    search: function(name) {
      var _this = this;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(function() {
        _this.searchClub(name);
      }, 500);
    },

    // Page Change
    currentPage: function(page) {
      this.start = 12 * (page - 1);
      this.end = 12 * page;
      this.clubShow = this.clubTemp.slice(this.start, this.end);
    },

    // Data temp change
    clubTemp: function() {
      if (this.clubTemp) {
        this.clubShow = this.clubTemp.slice(this.start, this.end);
        if (!this.clubTemp.length) {
          this.clubTemp = 'notfound';
        }
      } else {
        this.clubTemp = 'notfound';
      }
    },

    // Data show change
    clubShow: function() {
      this.halfLoadingChange(true);
      setTimeout(() => {
        this.halfLoadingChange(false);
      }, 200);
    },

    // Filter change
    filter: function(select) {
      this.filterTemp(select);
      this.sortTemp(this.sort);
    },

    // Sort change
    sort: function(select) {
      this.filterTemp(this.filter);
      this.sortTemp(select);
    }
  },

  // ------------- //
  // -- METHODS -- //
  // ------------- //

  methods: {
    ...mapGetters(['getClubAll', 'getClubRange', 'getLoading', 'getUser']),
    ...mapMutations(['halfLoadingChange']),
    ...mapActions([
      'userUpdate',
      'userSelf',
      'clubUpdateCurrent',
      'clubGet',
      'clubRemove',
      'clubAdd'
    ]),

    // init club {
    initClub() {
      this.clubData = this.getClubAll();
      if (this.clubData) {
        this.clubTemp = this.clubData;
        this.sortTemp(null);
        this.filter = null;
        this.sort = null;
      }
    },

    // entry club {
    entryClub(data) {
      if (data) {
        this.entry = data;
        this.$refs.entry.show();
      }
    },

    // edit club
    clubEditActive(data) {
      if (data) {
        this.edit = data;
        this.$refs.edit.show();
      }
    },

    // club add
    clubAddActive() {
      this.$refs.add.show();
    },
    clubOwnerInc(amount) {
      if (this.clubOwnerNum + amount > 0) {
        this.clubOwnerNum += amount;
      }
    },

    addClubSubmit() {
      this.$validator.validateAll().then(result => {
        this.clubAdd({ data: this.clubSubmit, token: this.user.token })
          .then(response => {
            this.clubGet(this.user.token).then(response => {
              this.initClub();
            });
            this.$refs.add.hide();
            swal({
              type: 'success',
              title: 'เพิ่มชุมนุมเสร็จสิ้น',
              html:
                'ชุมนุม <b class="font-bold">' +
                this.clubSubmit.name +
                '</b> ได้ถูกเพิ่มแล้ว.',
              timer: 2500
            }).then(() => {
              this.clubOwnerNum = 1;
              this.clubSubmit = {
                prefix: {},
                firstname: {},
                lastname: {}
              };
            });
          })
          .catch(err => {
            if (err.data.message == 'Failed to create club. Club has exist.') {
              swal({
                type: 'error',
                title: 'ไม่สามารถเพิ่มชุมนุมได้',
                html:
                  'ชื่อชุมนุม <b class="font-bold">' +
                  this.clubSubmit.name +
                  '</b> ได้ถูกใช้ไปแล้ว กรุณาลองชื่ออื่น.'
              });
            }
            this.clubGet(this.user.token).then(response => {
              this.initClub();
            });
            this.$refs.add.hide();
          });
      });
    },

    // submit club
    submitClub(data) {
      swal({
        title: 'ยืนยันการลงทะเบียน',
        html:
          'นักเรียนต้องการลงทะเบียนชุมนุม <b class="font-bold">' +
          data.name +
          '</b> ใช่หรือไม่?',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ใช่, ลงทะเบียน',
        cancelButtonText: 'ไม่, ยกเลิก'
      }).then(result => {
        // confirm submit club
        if (result.value == true) {
          this.clubUpdateCurrent({
            name: data.name,
            amount: 1,
            token: this.user.token
          })
            .then(() => {
              this.userUpdate({ club: data.name }).then(() => {
                swal({
                  type: 'success',
                  title: 'ลงทะเบียนเสร็จสิ้น',
                  html:
                    'นักเรียนได้ลงทะเบียนชุมนุม <b class="font-bold">' +
                    data.name +
                    '</b> แล้ว.',
                  timer: 2500
                });
                this.userSelf(this.user.token);
                this.clubGet(this.user.token).then(response => {
                  this.initClub();
                });
              });
            })
            .catch(() => {
              this.clubGet(this.user.token).then(response => {
                this.initClub();
              });
            });
          this.$refs.entry.hide();
        }
      });
    },

    // cancle club
    cancelClub(data) {
      swal({
        title: 'ยืนยันการออกชุมนุม',
        html:
          'นักเรียนต้องการออกจากชุมนุม <b class="font-bold">' +
          data.name +
          '</b> ใช่หรือไม่?',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ใช่, ออกจากชุมนุม',
        cancelButtonText: 'ไม่, ยกเลิก'
      }).then(result => {
        // confirm submit club
        if (result.value == true) {
          this.clubUpdateCurrent({
            name: data.name,
            amount: -1,
            token: this.user.token
          })
            .then(() => {
              this.userUpdate({ club: null }).then(() => {
                swal({
                  type: 'success',
                  title: 'ออกจากชุมนุมเสร็จสิ้น',
                  html:
                    'นักเรียนได้ออกจากชุมนุม <b class="font-bold">' +
                    data.name +
                    '</b> แล้ว.',
                  timer: 2500
                });
                this.userSelf(this.user.token);
                this.clubGet(this.user.token).then(response => {
                  this.initClub();
                });
              });
            })
            .catch(() => {
              this.clubGet(this.user.token).then(response => {
                this.initClub();
              });
            });
          this.$refs.entry.hide();
        }
      });
    },

    // Search club
    searchClub(name) {
      if (this.clubTemp) {
        this.clubTemp = this.clubData.filter(data => {
          return data.name.indexOf(name) > -1;
        });
        this.sortTemp(this.sort);
      }
    },

    // Filter Club
    filterTemp(select) {
      if (select) {
        // filter
        switch (select) {
          case 'filter_1': // ยังไม่เต็ม
            this.clubTemp = this.clubData.filter(elm => {
              return elm.entry.current != elm.entry.max;
            });
            break;
          case 'filter_2': //เต็มแล้ว
            this.clubTemp = this.clubData.filter(elm => {
              return elm.entry.current >= elm.entry.max;
            });
            break;
          case 'filter_3': //ม.ต้น junior
            this.clubTemp = this.clubData.filter(elm => {
              return elm.receive == 'junior';
            });
            break;
          case 'filter_4': //ม.ปลาย senior
            this.clubTemp = this.clubData.filter(elm => {
              return elm.receive == 'senior';
            });
            break;
          case 'filter_5': //รับทั้งหมด
            this.clubTemp = this.clubData.filter(elm => {
              return elm.receive == 'both';
            });
            break;
        }
      } else {
        this.clubTemp = this.clubData;
      }
    },

    // Sort Club
    sortTemp(select) {
      if (select) {
        // sort
        switch (select) {
          case 'sort_1': // new -> old
            this.clubTemp.sort(this.sort_new_old);
            break;

          case 'sort_2': // old -> new
            this.clubTemp.sort(this.sort_old_new);
            break;

          case 'sort_3': // number
            this.clubTemp.sort(this.sort_entry);
            break;
          case 'sort_4': // number
            this.clubTemp.sort(this.sort_max);
            break;
        }
      } else {
        // default
        this.clubTemp.sort(this.sort_new_old);
      }
    },

    // Sort Function //
    sort_new_old(a, b) {
      if (a.created_on > b.created_on) {
        return -1;
      }
      if (a.created_on < b.created_on) {
        return 1;
      }
      return 0;
    },
    sort_old_new(a, b) {
      if (a.created_on < b.created_on) {
        return -1;
      }
      if (a.created_on > b.created_on) {
        return 1;
      }
      return 0;
    },
    sort_entry(a, b) {
      if (a.entry.current > b.entry.current) {
        return -1;
      }
      if (a.entry.current < b.entry.current) {
        return 1;
      }
      return 0;
    },
    sort_max(a, b) {
      if (a.entry.max > b.entry.max) {
        return -1;
      }
      if (a.entry.max < b.entry.max) {
        return 1;
      }
      return 0;
    },

    // Remove Club
    clubRemoveActive(data) {
      swal({
        type: 'warning',
        title: 'ยืนยันการลบชุมนุม',
        html:
          'ต้องการลบชุมนุม <b class="font-bold">' +
          data.name +
          '</b> ใช่หรือไม่?',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'ใช่, ลบ',
        cancelButtonText: 'ไม่, ยกเลิก'
      }).then(result => {
        if (result.value) {
          // password confirm
          swal({
            type: 'warning',
            title: 'ยืนยันรหัสผ่าน',
            text: 'กรุณาใส่รหัสผ่านของคุณ',
            input: 'password',
            showCancelButton: true,
            confirmButtonText: 'ยืนยัน',
            showLoaderOnConfirm: true,
            preConfirm: password => {
              // password was wrong
              if (this.user.profile.password != password) {
                swal.showValidationError('รหัสผ่านไม่ถูกต้อง');
              } else {
                this.clubRemove({
                  name: data.name,
                  token: this.user.token
                }).then(response => {
                  swal({
                    type: 'success',
                    title: 'ลบชุมนุมเสร็จสิ้น'
                  });
                  this.clubGet(this.user.token).then(response => {
                    this.initClub();
                  });
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
.app-fade-enter-active,
.app-fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}
.app-fade-enter,
.app-fade-leave-to {
  opacity: 0;
}
</style>

