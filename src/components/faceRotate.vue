<template>
  <div class="container" :style="containerStyle">
    <div class="main" v-show="containerDisplay">
      <div class="face">
        <div class="card" v-if="flag">
          <div class="title-head">
            <div class="matches">
              <img :src="serverIp + websockReceive.img_v" alt="头像">
            </div>
            <div class="matches">
              <img v-if="websockReceive.img_f !== ''" :src="serverIp + websockReceive.img_f" alt="头像">
              <p class="tips" v-else>无对比图片</p>
            </div>
          </div>
          <div class="signin">
            <div class="other-matches">
              <div class="other-head">
                <img :src="serverIp + websockReceive.other_matches[0].Url" alt="头像">
                <p class="score">{{websockReceive.other_matches[0].Score}}</p>
              </div>
              <div class="other-head">
                <img :src="serverIp + websockReceive.other_matches[1].Url" alt="头像">
                <p class="score">{{websockReceive.other_matches[1].Score}}</p>
              </div>
              <div class="other-head">
                <img :src="serverIp + websockReceive.other_matches[2].Url" alt="头像">
                <p class="score">{{websockReceive.other_matches[2].Score}}</p>
              </div>
            </div>
            <p class="success-msg">{{websockReceive.time}}</p>
            <p v-if="websockReceive.hit_flag === true" class="success-msg">
              <b>{{websockReceive.name}}</b> 欢迎您
            </p>
            <p v-else class="success-msg">无匹配结果</p>
          </div>
        </div>
        <div v-show="!flag" id="myChart" :style="{width: '30rem', height: '30rem',margin:'auto'}"></div>
      </div>
      <div class="basemsg">
        <div class="date">
          <p>{{basemsg.date}}</p>
        </div>
        <div class="time">
          <p>{{basemsg.time}}</p>
          <P>今日来访人数：{{list.length}}</P>
        </div>
      </div>
    </div>
    <div class="side" v-if="containerDisplay">
      <h1 class="title" @click="test">记录</h1>
      <ul class="face-list" v-if="list.length > 0">
        <li class="list-item" v-for="item in list">
          <div class="face">
            <img :src="serverIp + item.img_v" alt="头像">
          </div>
          <div class="msg">
            <p :title="item.name">名称：{{item.name}}</p>
            <p>时间：{{item.time}}</p>
            <p>比分：{{item.score}}</p>
            <p>结果：{{item.hit_flag?"成功":"失败"}}</p>
          </div>
        </li>
      </ul>
      <p class="tips" v-else>暂无记录</p>
    </div>
    <p v-else>重新规划布局</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: "face",

      screenWidth: document.body.clientWidth,
      screenHeight: document.body.clientHeight,
      containerDisplay: true,
      containerStyle: {
        backgroundColor: "",
      },

      serverIp: "http://192.168.1.100:8080",
      flag: false,
      websock: {},
      websockReceive: {},
      list: [],
      basemsg: {
        date: "",
        time: ""
      }
    };
  },
  mounted() {
    //页面刚进入时开启长连接
    this.initWebSocket();
    this.nowTimes();
    this.drawLine();

    const that = this;
    var resizeTime;
    window.onresize = function() {
      that.containerStyle.backgroundColor = "#fff";
      that.containerDisplay = false;
      clearTimeout(resizeTime);
      resizeTime = setTimeout(function() {
        window.screenWidth = document.body.clientWidth;
        window.screenHeight = document.body.clientHeight;
        that.screenWidth = window.screenWidth;
        that.screenHeight = window.screenHeight;
        that.containerStyle.backgroundColor = "";
        that.containerDisplay = true;
        document.documentElement.style.fontSize = document.documentElement.clientWidth / 120 + 'px';
        if(that.screenWidth > that.screenHeight){
          that.$router.push('/face');
        }
      }, 500);
    };
  },
  destroyed: function() {
    //页面销毁时关闭长连接
    this.websocketclose();
  },
  methods: {
    initWebSocket() {
      //初始化weosocket
      const host = "ws://platform2.wookitech.com:8083";
      const wsuri = host + "/cameraDicernServer";
      this.websock = new WebSocket(wsuri);
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onclose = this.websocketclose;
    },

    websocketonopen() {
      console.log("WebSocket连接成功");
    },
    websocketonerror(res) {
      //错误
      console.log("WebSocket连接发生错误");
    },
    websocketonmessage(res) {
      //数据接收
      try {
        const redata = JSON.parse(res.data);
        console.log(redata);
        this.websockReceive = redata;
        this.websockReceive.other_matches = JSON.parse(redata.other_matches);
        this.flag = true;
        this.list.unshift(this.websockReceive);
        let temp = this;
        clearTimeout(this.GLOBAL.dataTimeOut);
        this.GLOBAL.dataTimeOut = setTimeout(function() {
          temp.websockReceive = {};
          temp.flag = false;
        }, 30000);
      } catch (err) {
        console.log(err.message);
      }
    },

    websocketsend(agentData) {
      //数据发送
      this.websock.send(agentData);
    },

    websocketclose(res) {
      //关闭
      try {
        console.log("connection closed (" + res.code + ")");
      } catch (err) {
        console.log(err.message);
      }
    },
    test(){
      let testData = { "id": 376, "img_f": "/v1/feature/img/2", "img_v": "/v1/log/img/376", "time": "2018-12-17T08:05:10.218186358Z", "score": "936 分", "label": "00","name": "栋强", "type": 3, "channel_id": 2, "capture_count": 101, "hit_count": 25, "hit_flag": true, "sublib_id": 1, "sublib_name": "VIP", "capture_count_today": 101, "hit_count_today": 25, "capture_count_all": 377, "hit_count_all": 87, "other_matches": "[{\"Feature_id\":2,\"Sublib_id\":1,\"Hit_flag\":true,\"Score\":936,\"Url\":\"/v1/feature/img/2\"},{\"Feature_id\":6,\"Sublib_id\":1,\"Hit_flag\":false,\"Score\":864,\"Url\":\"/v1/feature/img/6\"},{\"Feature_id\":4,\"Sublib_id\":1,\"Hit_flag\":false,\"Score\":856,\"Url\":\"/v1/feature/img/4\"}]", "face_id": 631, "face_left": 880, "face_top": 15, "face_right": 1065, "face_bottom": 237};
      try {
        const redata = testData;
        console.log(redata);
        this.websockReceive = redata;
        this.websockReceive.other_matches = JSON.parse(redata.other_matches);
        this.flag = true;
        this.list.unshift(this.websockReceive);
        let temp = this;
        let timer;
        clearTimeout(timer);
        timer = setTimeout(function() {
          temp.websockReceive = {};
          temp.flag = false;
        }, 30000);
      } catch (err) {
        console.log(err.message);
      }
    },
    drawLine(){
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        title: { text: '今日每时人数' },
        tooltip: {},
        xAxis: {
          data: ["0时","1时","2时","3时","4时","5时","6时","7时","8时","9时","10时","11时","12时","13时","14时","15时","16时","17时","18时","19时","20时"],
          axisLabel: {
            textStyle: {
              fontWeight: 'bolder'
            }
          }
        },
        yAxis: {
          axisLabel: {
            textStyle: {
              fontWeight: 'bolder'
            }
          }
        },
        series: [{
          name: '人数',
          type: 'line',
          smooth: true,
          data: [5, 20, 36, 10, 10, 26, 12, 36, 10, 10, 20, 23, 36, 10, 16, 20, 20, 36, 10, 10, 20],
          areaStyle: {
            normal: {
              color: '#0093d4'
            }
          },
          itemStyle : {
            normal: {
              color: "#0093d4",
              lineStyle: {
                  color: "#0093d4"
              },
              label : {
                show: true,
                textStyle: {
                  color: '#000',
                  fontWeight: 'bolder'
                }
              }
            }
          }
        }]
      });
    },

    getTime() {
      let today = new Date();
      let YYYY = today.getFullYear();
      let MM = today.getMonth() + 1;
      let DD = today.getDate();
      let h = today.getHours();
      let m = today.getMinutes();
      let s = today.getSeconds();
      let week = today.getDay();
      MM = MM < 10 ? "0" + MM : MM;
      DD = DD < 10 ? "0" + DD : DD;
      h = h < 10 ? "0" + h : h;
      m = m < 10 ? "0" + m : m;
      s = s < 10 ? "0" + s : s;
      this.basemsg.date = YYYY + "-" + MM + "-" + DD;
      // this.basemsg.time = h + ":" + m;
    },
    nowTimes() {
      this.getTime();
      // setInterval(this.nowTimes,10000);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  width: 100%;
  height: 100%;
}
.main {
  width: 100%;
  height: 70%;
  float: left;
}
.main .face {
  width: 100%;
  height: 90%;
  padding: 2rem;
  box-sizing: border-box;
}
.main .face .card {
  width: 100%;
  height: 100%;
  background-color: rgba(13, 115, 187, 0.8);
  border-radius: 1rem;
  box-shadow: 0 1rem 2rem rgba(4, 28, 45, 0.8);
}
.main .face .card .title-head {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.main .face .card .matches {
  width: 10rem;
  height: 10rem;
  display: block;
  margin: 2rem 1rem;
}
.main .face .card .matches img {
  display: block;
}
.main .face .card .matches .tips {
  min-width: 10rem;
  text-align: center;
}
.main .face .card .signin {
  width: 100%;
  height: 18rem;
}
.signin .other-matches {
  display: flex;
  justify-content: center;
  align-items: center;
}
.signin .other-matches .other-head {
  width: 5rem;
  height: 6rem;
  margin: 1rem;
}
.signin .other-matches .other-head img {
  width: 5rem;
  height: 5rem;
}
.signin .other-matches .other-head .score {
  text-align: center;
}
.signin .success-msg {
  text-align: center;
  font-size: 2rem;
}
.main .basemsg {
  width: 100%;
  height: 10%;
  background-color: rgba(0, 0, 0, 0.8);
}
.main .basemsg .date,
.main .basemsg .time {
  width: 50%;
  height: 100%;
  float: left;
  color: #eee;
  font-size: 4rem;
  text-align: center;
  line-height: 100%;
}
.main .basemsg .date p,
.main .basemsg .time p {
  margin-top: 10%;
}
.side {
  width: 100%;
  height: 30%;
  float: left;
  background-color: rgba(0, 0, 0, 0.1);
  border: 1px solid #666;
  box-sizing: border-box;
}
.side .title {
  text-align: center;
  color: #fff;
}
.side .face-list {
  width: 100%;
  height: 80%;
  overflow: auto;
}
.side .face-list .list-item {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid #666;
}
.side .face-list .list-item .face {
  width: 6rem;
}
.side .face-list .list-item .face img {
  width: 100%;
}
.side .face-list .list-item .msg {
  width: 24rem;
  margin-left: 1rem;
  color: #fff;
}
.side .face-list .list-item .msg p {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.side .tips {
  text-align: center;
  color: #eee;
}
</style>
