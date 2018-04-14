<template>
  <div id="app-login">
    <div class="wrapper">
      <div class="box">
        <!-- header -->
        <div class="box-header row">
          <div class="col">
            <img src="@img/icon.png">
            <span class="font-roboto">ลงทะเบียนชุมนุม</span>
            <span>โรงเรียนนวมินทราชินูทิศเบญจมราชาลัย <br> ระบบลงทะเบียนชุมนุมออนไลน์</span>
          </div>
        </div>
        <!-- body -->
        <div class="box-body row">
          <b-form>
            <!-- input -->
            <b-form-group id="usernameGroup" class="input-group" label-for="username">
              <div class="input-container">
                <span class="input-label">
                  <b>ชื่อผู้ใช้:</b> รหัสนักเรียน 5 หลัก</span>
                <input v-validate="'required|numeric|digits:5'" v-model="form.username" :class="{'is-danger': errors.has('username')}" name="username" type="text" placeholder="15111" maxlength="5">
                <p v-show="errors.has('username')">{{ errors.first('username') }}</p>
              </div>
            </b-form-group>

            <b-form-group id="passwordGroup" class="input-group" label-for="password">
              <div class="input-container">
                <span class="input-label">
                  <b>รหัสผ่าน:</b> เลขบัตรประชาชน 13 หลัก</span>
                <input v-validate="'required|numeric|digits:13'" v-model="form.password" :class="{'is-danger': errors.has('password') }" name="password" type="password" placeholder="•••••••••••••" maxlength="13">
                <p v-show="errors.has('password')">{{ errors.first('password') }}</p>
              </div>
            </b-form-group>

          </b-form>
        </div>

        <!-- footer -->
        <div class="box-footer">
          <div class="button-wrapper">
            <button type="submit">
              เข้าสู่ระบบ
              <i class="fas fa-chevron-circle-right"></i>
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { Validator } from 'vee-validate';
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
  name: 'login',
  data() {
    return {
      form: {}
    };
  }
};
</script>

<style>

</style>
