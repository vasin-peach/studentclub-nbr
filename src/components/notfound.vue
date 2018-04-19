<template>
  <div id="app-notfound">
    404 ไม่พบหน้าที่คุณต้องการ <br> กำลังย้อนกลับไปหน้าหลัก...
  </div>
</template>

<script>
export default {
  name: 'notfound',
  mounted() {
    setTimeout(() => {
      this.$router.push({ name: 'Login' });
    }, 2000);
  }
};
</script>

<style>

</style>
