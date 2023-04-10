<template>
  <div id="app">
    <div style="height: 100px"></div>
    <el-button size="mini" type="primary" @click="showPlayer = true"
      >显示</el-button
    >
    <el-button size="mini" type="danger" @click="showPlayer = false"
      >隐藏</el-button
    >
    <el-button size="mini" type="warning" @click="getHasPlayedTime"
      >获取视频已播放时长</el-button
    >
    <div v-if="showPlayer" class="center">
      <lee-player :options="options" ref="aaaaaaa"></lee-player>
    </div>
    <div class="send">
      <el-input
        size="mini"
        v-model="newDanmu"
        placeholder="写入弹幕~~"
        clearable
        style="width: 500px"
      />
      <el-button
        size="mini"
        type="primary"
        @click="addDanmu"
        :loading="sendLoading"
        >发送</el-button
      >
    </div>
  </div>
</template>
<script>
import { danmuFunc } from './utils/danmuFunc';
export default {
  name: 'App',
  data() {
    return {
      newDanmu: '',
      sendLoading: false,
      showPlayer: true,
      options: {
        el: 'video',
        width: document.querySelector('#app').offsetWidth, // 宽度，不传则默认跟随父级
        height: (document.querySelector('#app').offsetWidth * 550) / 818,
        lang: 'zh', // 语言：en | zh
        theme: '#000', // 主题色
        // 视频链接
        url: [
          {
            quality: 'auto',
            url: 'https://qinius.kujiajia.xyz/teaching/chatgpt-video/video/0%E5%85%88%E5%AF%BC%E8%AF%BE.m3u8',
          },
          {
            quality: 'high',
            url: 'https://qinius.kujiajia.xyz/teaching/chatgpt-video/video/0%E5%85%88%E5%AF%BC%E8%AF%BE.m3u8',
          },
          {
            quality: 'superhigh',
            url: 'https://qinius.kujiajia.xyz/teaching/chatgpt-video/video/0%E5%85%88%E5%AF%BC%E8%AF%BE.m3u8',
          },
          {
            quality: 'lossless',
            url: 'https://qinius.kujiajia.xyz/teaching/chatgpt-video/video/0%E5%85%88%E5%AF%BC%E8%AF%BE.m3u8',
          },
        ],
        subUrl: [],
        poster: '',
        type: 'hls', // 视频类型：mp4、hls、flv、rtmp
        autoplay: false, // 是否自动播放
        loop: false, // 循环播放
        paused: false, // 是否暂停
        muted: false, // 是否静音
        speed: 1, // 当前倍速
        speedOptions: [0.5, 0.75, 1.0, 1.25, 1.5, 2.0], // 倍速可选列表
        volume: 36, // 默认音量 0~100
        progress: 0, // 播放进度 0~100
        lastPlayTime: 20, // 记忆播放(秒)
        playNext: true, // 允许切换下一集
        quality: 'auto', // 默认清晰度：{auto: 自动, high: 高清, superhigh: 超清, lossless: 原画}
        subQuality: 'high', // 子视频默认清晰度：{auto: 自动, high: 高清, superhigh: 超清, lossless: 原画}
        isLive: false, // 是否直播
        wideScreen: true, // 允许宽屏
        cssFullScreen: true, // 允许样式全屏
        fullScreen: true, // 允许显示器全屏
        miniScreen: true, // 允许mini小屏
        pipScreen: true, // 允许画中画
        danmu: false, // 开启弹幕
        danmuList: danmuFunc(), // 弹幕池
        danmuSettings: {
          position: 'all', // top、bottom、all
          size: '14', // 12、14、16、18、20、22
          font: '',
          speed: 10, // slow、normal、fast
          color: '#fff', // red、orange、yellow、green、blue、#10C8AF、purple、#fff
          opacity: 0.8, // 0~1（0%~100%）
        },
      },
    };
  },
  mounted() {
    const appWidth = document.querySelector('#app').offsetWidth;
    this.options.width = appWidth;
    this.options.height = (appWidth * 550) / 818;
    document.querySelector('.center').style.height =
      (appWidth * 550) / 818 + 'px';
  },
  methods: {
    getHasPlayedTime() {
      console.log('11111111111', this.$refs.aaaaaaa.getHasPlayedTime());
    },
    // 新增弹幕
    addDanmu() {
      this.sendLoading = true;
      const keys = Math.floor(
        Math.random() * (this.options.danmuList.length + 5)
      );
      const aa = {
        videoId: 55,
        videoBarrageId: `span-${this.options.danmuList.length + 1}`,
        content: this.newDanmu,
        createTime: keys,
        startTime: `${this.$refs.aaaaaaa.getHasPlayedTime()}`,
        playTime: '10',
        style: `font-size: 22px;color: #f00;font-weight: 600;`,
      };
      // console.log('aaaaaaa:::', aa)
      sessionStorage && sessionStorage.setItem('newDanmu', JSON.stringify(aa));
      this.options.danmuList = this.options.danmuList.concat([aa]);
      setTimeout(() => {
        this.sendLoading = false;
        this.newDanmu = '';
      }, 2000);
    },
  },
};
</script>
<style scoped>
#app {
  width: 800px;
  height: 100vh;
  margin: 0 auto;
  box-sizing: border-box;
}
.center {
  margin-top: 20px;
  width: 100%;
  height: 520px;
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
}
.send {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 15px;
}
</style>
