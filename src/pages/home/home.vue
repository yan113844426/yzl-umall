<template>
  <div>
    <!--在绘图之前，我们需要为 ECharts 准备一个具备大小（宽高）的 DOM -->
    <div id="main" style="width: 600px;height:400px;"></div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
//用echarts我们需要引入
import echarts from "echarts";
export default {
  computed: {
    ...mapGetters({
     //我们需要展示分类的数据，所以需要取过来用
      list: "cate/list"
    })
  },
  methods: {
    ...mapActions({
      reqList: "cate/reqList"
    })
  },
  watch: {
    list: {
      handler() {
          //监听有数据以后，我们就开始画图
        if (this.list.length > 0) {
          //画图
          let myChart = echarts.init(document.getElementById("main"));
          // 指定图表的配置项和数据
          var option = {
            title: {
              text: "分类页面的数量"
            },
            tooltip: {},
            legend: {
              
              data: ["子分类数量"]//图例
            },
            xAxis: {
              //数据回来以后根据数据去画图，
              data: this.list.map(item=>item.catename),
            },
            yAxis: {},
            // series 数据
            series: [
              {
                name: "子分类数量", //图例
                type: "bar",
                data:this.list.map(item=>item.children?item.children.length:0)
              },
            ]
          };
          //配置图表
          myChart.setOption(option);
        }
      },
      deep: true
    }
  },
  mounted() {
    //触发请求
    this.reqList();
  }
};
</script>
<style scoped>
.box {
  width: 80%;
  margin: 20px auto;
  height: 500px;
}
</style>