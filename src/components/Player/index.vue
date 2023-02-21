<template>
  <div style="width: 100%;height: 100%;display: flex;justify-content: center;align-items: center;">
    <component v-if="videoType" :ref="videoType" :is="videoType" :options="data" @changeOptions="changeOptions" @initSubPlayer="initSubPlayer" @fullScreen="fullScreen"></component>
    <div v-if="subType" class="sub-position" @mousedown="subMouseEvent">
      <pipMp4 v-if="subType === 'mp4'" :options="subData" :subPipStatus="subPipStatus" @destroyPipPlayer="destroyPipPlayer"></pipMp4>
      <pipHls v-if="subType === 'hls'" :options="subData" :subPipStatus="subPipStatus" @destroyPipPlayer="destroyPipPlayer"></pipHls>
    </div>
  </div>
</template>

<script>
import mp4Bar from './mp4Bar.vue';
import hlsBar from './hlsBar.vue';
import pipMp4 from './pipMp4.vue';
import pipHls from './pipHls.vue';
export default {
  name: "lee-player",
  components: {
    mp4Bar,
    hlsBar,
    pipMp4,
    pipHls
  },
  props: {
    options: {
      type: Object,
      default: () => {}
    },
  },
  data() {
    return {
      videoType: '',
      subType: '',
      data: {},
      subData: {},
      subPipStatus: false,
      subPipType: 'cssFullScreen'
    }
  },
  watch: {
    'options.url'(n, o) {
      if (n !== o && n) {
        this.data = this.options;
        const l = n.filter(e => {
          return e.quality === this.options.quality
        })
        this.setVideoType(l[0].url);
        this.destroyPipPlayer();
      }
    },
    'options.danmuList'(n, o) {
      if (n !== o && n) {
        this.data = this.options;
      }
    }  
  },
  mounted() {
    this.data = this.options;
    if(Object.keys(this.data).length){
      const qualityType = this.options.quality;
      this.data.url.map(e => {
        if(e.quality === qualityType){
          this.setVideoType(e.url);
        }
      })
    }
  },
  methods: {
    // 引用者触发 上报当前播放进度
    getHasPlayedTime(){
      return this.$refs[this.videoType].getHasPlayedTime();
    },
    // 记录当前播放数据
    recordPlayData(t, v){
      const playinfo = localStorage.getItem('DQ_PLAY_VIDEO_CONFIG');
      let data = !playinfo ? {} : JSON.parse(playinfo);
      data[t] = v;
      const pi = JSON.stringify(data);
      localStorage.setItem('DQ_PLAY_VIDEO_CONFIG', pi);
    },
    setVideoType(url){
      if(url.includes('.mp4')){
        this.videoType = 'mp4Bar';
        return;
      }
      if(url.includes('.m3u8')){
        this.videoType = 'hlsBar';
        return;
      }
      if(url.includes('.flv')){
        this.videoType = 'flvBar';
        return;
      }
    },
    changeOptions(opt){
      if(opt.type === 'quality'){
        this.data.quality = opt.value;
        this.data.url.map(e => {
          if(e.quality === opt.value){
            this.setVideoType(e.url);
          }
        })
      }
      if(opt.type === 'speed'){
        this.data.speed = opt.value;
        this.recordPlayData('speed', opt.value);
      }
      if(opt.type === 'volume'){
        this.data.volume = opt.value;
        this.recordPlayData('volume', parseInt(opt.value));
      }
    },
    // 切换子视频播放组件
    initSubPlayer(sub){
      this.subType = sub.url && sub.url.includes('.mp4') ? 'mp4' : 'hls';
      this.subData = {
        el: `video-${sub.id}`,
        width: 503, // 宽度，不传则默认跟随父级
        height: 503 * 9 / 16,  // 高度，自动计算宽高比例
        lang: 'zh', // 语言：en | zh
        theme: '#000', // 主题色
        url: [
          {quality: 'high', url: sub.url},
        ],  // 视频链接
        subUrl: [],
        poster: this.options.poster, // 封面图
        type: this.subType, // 视频类型：mp4、hls、flv、rtmp
        autoplay: true, // 是否自动播放
        loop: false, // 循环播放
        paused: false, // 是否暂停
        muted: false, // 是否静音
        speed: 1, // 当前倍速
        speedOptions: [0.5, 0.75, 1.0, 1.25, 1.5, 2.0], // 倍速可选列表
        volume: 10, // 默认音量 0~100
        progress: 0, // 播放进度 0~100
        lastPlayTime: 20, // 记忆播放(秒)
        playNext: true, // 允许切换下一集
        quality: 'high', // 默认清晰度：{auto: 自动, high: 高清, superhigh: 超清, lossless: 原画}
        subQuality: 'high', // 子视频默认清晰度：{auto: 自动, high: 高清, superhigh: 超清, lossless: 原画}
        isLive: false, // 是否直播
        wideScreen: false, // 允许宽屏
        cssFullScreen: true, // 允许样式全屏
        fullScreen: true, // 允许显示器全屏
        miniScreen: false, // 允许mini小屏
        pipScreen: false, // 允许画中画
        danmu: false, // 开启弹幕
        danmuOptions: {
          list: [], // 弹幕池
          transparency: 1, // 文字透明度 0~1
          position: 'full', // 弹幕位置：top、middle、bottom、full
        }
      }
      if(this.subPipStatus){
        setTimeout(()=> {
          this.fullScreen({type: this.subPipType, status: this.subPipStatus})
        }, 222)
      }
    },
    // 主视频开启/关闭全屏
    fullScreen(e){
      this.subPipType = e.type;
      this.subPipStatus = e.status;
      const subPosition = document.querySelector('.sub-position');
      if(e.type === 'cssFullScreen' && subPosition){
        subPosition.style.zIndex = e.status ? 1000 : 888;
      } else {
        // 显示器全屏的操作
      }
    },
    // 鼠标拖动事件
    subMouseEvent(event){
      // 播放进度条拖动监听
      let subleft = 0, subtop = 0;
      const process = document.documentElement;
      const sub = document.querySelector('.sub-position');
      const processW = process.offsetWidth;
      const processH = process.offsetHeight;
      const eve = event || window.event;
      const leftVal = eve.clientX - sub.offsetLeft;
      const topVal = eve.clientY - sub.offsetTop;
      document.onmousemove = function(ev){
        const e = ev || window.event;
        subleft = e.clientX - leftVal;
        if(subleft < 0){
          subleft = 0;
        } else if(subleft > scroll.offsetWidth - sub.offsetWidth){
          subleft = scroll.offsetWidth - sub.offsetWidth;
        }
        subtop = e.clientY - topVal;
        if(subtop < 0){
          subtop = 0;
        }else if(subtop > scroll.offsetHeight - sub.offsetHeight){
          subtop = scroll.offsetHeight - sub.offsetHeight;
        }
        sub.style.left = (subleft + sub.offsetWidth > processW ? processW - sub.offsetWidth : subleft) + 'px';
        sub.style.top = (subtop + sub.offsetHeight > processH ? processH - sub.offsetHeight : subtop) + 'px';
        //防止拖动鼠标过快，弹起鼠标，point受影响移动
        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
      }
      document.onmouseup = function(){
        document.onmousemove = null;
      }
    },
    // 删除子播放器节点
    destroyPipPlayer(){
      this.subType = '';
      this.subData = {};
    }
  }
};
</script>

<style lang="scss" scoped>
.sub-position{
  position: fixed;
  top: 50px;
  right: 50px;
  width: 503px;
  height: 282.9375px;
  z-index: 888;
  cursor: move;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  .close-btn{
    margin-top: -20px;
    right: 20px;
    color: #fff;
    z-index: 101;
  }
}
</style>
