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
        <b-row class="club-header m-0 mb-3">
          <b-col cols="12" sm="6" md="4" lg="6" class="club-search">
            <b-form @submit.prevent="searchClub(search)">
              <b-form-input v-model="search" type="text" placeholder="ค้นหา" :disabled="!clubTemp || clubTemp == 'empty'"></b-form-input>
            </b-form>
          </b-col>
          <b-col class="club-filter" cols="12" sm="3" md="4" lg="3">
            <b-form @submit.prevent>
              <b-form-select v-model="filter" :disabled="!clubTemp || clubTemp == 'empty'">
                <option :value="null">-- คัดกรอง --</option>
                <option :value="'filter_1'">ยังไม่เต็ม</option>
                <option :value="'filter_2'">ระดับชั้น มัธยมต้น</option>
                <option :value="'filter_3'">ระดับชั้น มัธยมปลาย</option>
                <option :value="'filter_4'">ระดับชั้น มัธยมปลาย</option>
              </b-form-select>
            </b-form>
          </b-col>
          <b-col class="club-sort" cols="">
            <b-form @submit.prevent>
              <b-form-select v-model="sort" :disabled="!clubTemp || clubTemp == 'empty'">
                <option :value="null">-- เรียงตาม --</option>
                <option :value="'sort_1'">ใหม่ -> เก่า</option>
                <option :value="'sort_2'">เก่า -> ใหม่</option>
                <option :value="'sort_3'">จำนวนคน</option>
              </b-form-select>
            </b-form>
          </b-col>
        </b-row>
        <!-- <b-row class="club-block m-0"> -->
        <transition name="app-fade" mode="out-in">
          <transition-group name="club" class="club-block row m-0" tag="div" v-if="!getLoading().half">
            <b-col class="club-item" v-for="(data, count) in clubShow" :key="count" cols="12" sm="6" md="4" lg="3" xl="3">
              <div class="card">
                <div class="card-img-container">
                  <img class="card-img-top" v-bind:src="data.img">
                </div>
                <div class="card-body">
                  <h4 class="card-title">{{ data.name }}</h4>
                  <p class="card-text">
                    {{ data.desc || ' ไม่มีคำอธิบาย. '}}
                  </p>
                </div>
              </div>
            </b-col>
          </transition-group>
          <!-- </b-row> -->

          <div class="loading-half-wrapper" v-else>
            <div class="loading-half-fade">
              <div v-if="clubTemp == 'empty'" class="text-center">
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
import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'student_club',

  // ---------- //
  // -- DATA -- //
  // ---------- //

  data() {
    return {
      search: null,
      filter: null,
      sort: null,
      clubData: null,
      clubTemp: null,
      clubShow: null,
      currentPage: 1,
      notfound: false,
      start: 0,
      end: 12
    };
  },

  // ------------- //
  // -- MOUNTED -- //
  // ------------- //

  mounted() {
    this.clubData = this.getClubRange(this.$store.state)(0, 24);
    if (this.clubData) {
      this.clubTemp = this.clubData;
    }
  },

  // ----------- //
  // -- WATCH -- //
  // ----------- //

  watch: {
    // Search
    search: function(name) {
      this.searchClub(name);
    },

    // Page Change
    currentPage: function(page) {
      this.start = 12 * (page - 1);
      this.end = 12 * page;
      this.clubShow = this.clubTemp.slice(this.start, this.end);
    },

    // Data temp change
    clubTemp: function() {
      this.clubShow = this.clubTemp.slice(this.start, this.end);
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
      if (select) {
      }
    },

    // Sort change
    sort: function(select) {
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
            break;
        }
      } else {
        // cancel sort (old -> new)
        this.clubTemp.sort(this.sort_old_new);
      }
    }
  },

  // ------------- //
  // -- METHODS -- //
  // ------------- //

  methods: {
    ...mapGetters(['getClubAll', 'getClubRange', 'getLoading']),
    ...mapMutations(['halfLoadingChange']),

    // Search club
    searchClub(name) {
      if (this.clubTemp) {
        this.clubTemp = this.clubData.filter(data => {
          return data.name.indexOf(name) > -1;
        });
      }
    },
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

.club-item {
  transition: all 0.5s ease-in-out;
  margin-top: 30px;
  transform: translateY(-30px);
}
.club-enter,
.club-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.club-leave-active {
}
</style>

