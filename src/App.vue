<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<!-- 改了下这个的颜色蓝的看不见 -->
<style>
  #nprogress .bar {
  background: #66FFFF !important;
}
</style>
