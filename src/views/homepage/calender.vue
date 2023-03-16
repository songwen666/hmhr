<template>
  <el-calendar v-model="currentDate">
    <template slot="dateCell" slot-scope="{ date, data }">
      <div class="date-content">
        <span
          class="text"
          :class="data.isSelected ? 'is-selected' : ''"
          @click="fn"
        >
          {{ getDay(data.day) }} {{ data.isSelected ? '✔️' : '' }}
        </span>
        <span v-if="isWeek(date)" class="rest">休</span>
      </div>
    </template>
  </el-calendar>
</template>

<script>
export default {
  data() {
    return {
      currentDate: new Date()
    }
  },
  methods: {
    fn() {
      // console.log('xxxxxx')
    },
    getDay(value) {
      // 数据是以 09-28
      const day = value.split('-')[2] // 11, 02
      return day.startsWith('0') ? day.slice(1) : day
    },
    // 判断是否周末
    isWeek(date) {
      return date.getDay() === 6 || date.getDay() === 0
    }
  }
}
</script>
<style lang="scss" scoped>
.is-selected {
    color: #1989FA;
  }
::v-deep td.next {
  display: none;
}
::v-deep .current ~ td {
  display: revert !important;
}

::v-deep .next ~ td {
  display: none;
}
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text {
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
}
</style>
