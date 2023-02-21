<template>
  <!-- 层级说明：缓冲、加载、切换中途，会伴随层级调整 -->
  <!--            视频video: z-index: 默认1 -->
  <!--            弹幕danmu: z-index: 10 -->
  <!--        播放/暂停pause: z-index: 20 -->
  <!--          加载loading: z-index: 30 -->
  <!-- 底部、快进退、中部音量: z-index: 40 -->
  <div :class="`pip-pl pl-${options.el}`" :style="`background: ${options.theme}`">
    <i class="close-btn iconfont icon-quxiao" @click="destroyPipPlayer"></i>
    <video
      :id="`lee-player-${options.el}`"
      class="pip-lee-player"
      :controls="false"
      :style="`max-width: 100%; max-height:100%`"
      :poster="options.poster"
      :muted="options.muted"
    >
      {{options.lang === 'zh' ? '您的浏览器不支持当前格式，请升级或更换谷歌浏览器。' : 'Your browser does not support the current format. Please upgrade or replace Google browser.'}}
    </video>
    <!-- 外部遮罩 loading -->
    <div class="pip-loading" v-if="pipLoading">
      <img :src="pipUrlStatus ? LoadingImg : ErrorImg" alt="" />
      <div class="pip-tip">
        <i :class="pipUrlStatus ? 'el-icon-loading' : 'el-icon-error'"></i>
        {{ pipUrlStatusText }}
      </div>
    </div>
    <!-- 播放器中部播放 暂停 -->
    <transition name="bounce">
      <div
        class="pip-center-btn"
        :class="pipPlayStatus ? '' : 'pip-center-btn-check'"
        @click="pipDebounce(pipPlayOrPause(), 100, true)"
      >
        <i
          :class="
            pipPlayStatus ? 'pip-pbtn el-icon-video-pause' : 'el-icon-video-play'
          "
        ></i>
      </div>
    </transition>
    <div class="pip-pl-control">
      <!-- 进度条 -->
      <div class="pip-process" @click="pipChangePlayedTime($event)">
        <div class="pip-preload" :style="`width: ${(pipPreloadTime >= pipFullTime ? pipFullTime : pipPreloadTime) * 100 / pipFullTime}%`"></div>
        <div
          class="pip-playing"
          :style="`width: ${
            options.url ? ((pipHasPlayedTime >= pipFullTime ? pipFullTime : pipHasPlayedTime) * 100) / pipFullTime : 0
          }%`"
        ></div>
        <div
          class="pip-point"
          @click="($event) => $event.stopPropagation()"
          :style="`display: ${pipIsLive ? 'none' : 'block'}; left: calc(${
            options.url ? ((pipHasPlayedTime >= pipFullTime ? pipFullTime : pipHasPlayedTime) * 100) / pipFullTime : 0
          }% - 5px)`"
        ></div>
      </div>
      <!-- 操作按钮 -->
      <div class="pip-opt-buttons">
        <!-- 左 播放暂停按钮 及时长 -->
        <div class="pip-lf-play">
          <span class="pip-play-pause-btn" @click="pipDebounce(pipPlayOrPause(), 100, true)"
            ><i
              :class="
                pipPlayStatus ? `iconfont icon-zanting` : `iconfont icon-bofang1`
              "
            ></i
          ></span>
          <span>
            {{ pipFilterTime(pipHasPlayedTime) }}
            {{ !pipIsLive ? options.url ? ' / ' + pipFilterTime(pipFullTime) : " / 00:00" : '' }}
            <span v-if="pipIsLive" class="pip-live">直播</span>
            <i v-if="pipIsLive" class="pip-refresh iconfont icon-shuaxin" title="刷新" @click="pipRefreshPlayTime"></i>
          </span>
        </div>
        <div class="pip-rt-screen">
          <!-- 右 倍速 -->
          <div style="width: 28px" class="pip-part">
            {{ pipSpeedType == 1 ? "倍速" : pipSpeedType + "x" }}
            <div class="pip-part-cover pip-speed">
              <span
                v-for="i in options.speedOptions"
                :key="i"
                :class="pipSpeedType === i ? 'pip-play-span' : ''"
                @click="pipChangeSpeed($event, i)"
                >{{ i + "x" }}</span
              >
            </div>
          </div>
          <!-- 右 清晰度 -->
          <div class="pip-part">
            {{ pipRenderQuality(pipQualityType) }}
            <div class="pip-part-cover pip-quality">
              <span
                v-for="i in pipFilterQuality(options.url)"
                :key="i.v"
                :class="pipQualityType === i.v ? 'pip-play-span' : ''"
                @click="pipChangeQuality($event, i)"
                >{{ i.n }}{{ i.t }}</span
              >
            </div>
          </div>
          <!-- 右 音量 -->
          <div class="pip-part">
            <i @click="pipToggleVolumeStatus" :class="`iconfont ${pipOpenVolume ? 'icon-mn_shengyin_fill' : 'icon-mn_shengyinwu_fill'}`"></i>
            <div class="pip-part-cover pip-volume">
              <span class="pip-num">{{pipOpenVolume ? parseInt(pipVolume) : 0}}</span>
              <div class="pip-volume-line" @click="pipChangeVolume($event)">
                <div
                  class="pip-volume-straight"
                  :style="`height: ${pipOpenVolume ? pipVolume : 0}px`"
                ></div>
                <div
                @click="($event) => $event.stopPropagation()"
                  class="pip-volume-check"
                  :style="`bottom: ${(pipOpenVolume ? pipVolume : 0) - 5}px`"
                ></div>
              </div>
            </div>
          </div>
          <!-- 右 网页全屏 -->
          <div class="pip-part" @click="pipCssScreenFunc" v-if="options.cssFullScreen">
            <el-tooltip class="pip-pitem" effect="dark" :content="`${pipCssScreen ? '退出' : '进入'}网页全屏`" placement="top">
              <i :class="pipCssScreen
                ? `iconfont icon-24gf-fullScreenExit3`
                : `iconfont icon-24gf-fullScreenEnter3`
              "
              ></i>
            </el-tooltip>

          </div>
          <!-- 右 设备全屏 -->
          <div class="pip-part" @click="pipFullScreenFunc" v-if="options.fullScreen">
            <el-tooltip class="pip-pitem" effect="dark" :content="`${pipFullScreen ? '退出' : '进入'}全屏`" placement="top">
              <i
                class="pip-full"
                :class="
                  pipFullScreen
                    ? `iconfont icon-cancel-full-screen`
                    : `iconfont icon-quanping1`
                "
              ></i>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingImg from "@/assets/loading.png";
import ErrorImg from "@/assets/error.png";
export default {
  name: "lee-player-sub-mp4",
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  components: {},
  data() {
    return {
      LoadingImg: LoadingImg,
      ErrorImg: ErrorImg,
      pipLoading: true, // 数据加载阶段
      pipUrlStatus: true, // 播放链接是否有效
      pipUrlStatusText: '视频加载中', // 链接状态说明
      pipPlayer: null, // 播放器
      pipPlayStatus: true, // 播放状态，播放/暂停
      pipShowPlayBtn: false, // 视频中部播放/暂停按钮
      pipCssScreen: false, // 网页全屏
      pipFullScreen: false, // 显示器全屏
      pipIsLive: this.options.isLive, // 是否直播
      pipFullTime: 0, // 视频总时长
      pipHasPlayedTime: 0, // 已播放时长（秒）
      pipPreloadTime: 0, // 缓冲区
      pipHasPlayedPoint: 0, // 直播条件下 记录最远播放值
      pipSpeedType: this.options.speed, // 当前倍速
      pipQualityType: this.options.quality, // 当前清晰度
      pipVolume: this.options.volume, // 当前音量
      pipDragVolumeLen: 0, // 拖动长度
      pipOpenVolume: !this.options.muted, // 开启音量
      pipInterval: null, // 底部栏 显隐定时器
      pipFastPlayStep: null, // 快进或快退
      pipKeyVolInterval: null, // 键盘事件 音量处理定时器
    };
  },
  watch: {
    'options.url'(n, o) {
      if (n !== o && n) {
        if(n[0].url !== o[0].url){
          this.pipQualityType = this.options.quality;
          this.pipIsLive = this.options.isLive;
          this.pipSpeedType = this.options.speed;
          this.pipVolume = this.options.volume;
          this.pipOpenVolume = !this.options.muted;
          this.pipCreatePlayer();
        }
      }
    }
  },
  mounted() {
    this.pipCreatePlayer();
  },
  beforeDestroy() {
    this.pipResetPlayer();
  },
  methods: {
    // 清除播放器
    destroyPipPlayer(){
      this.pipResetPlayer();
      this.$emit('destroyPipPlayer', true)
    },
    // 清晰度选项
    pipFilterQuality(list){
      let arr = [];
      list.map(e => {
        switch(e.quality){
          case 'auto':
            arr.unshift({v: 'auto', n: '自动', t: ''});
            break;
          case 'high':
            arr.unshift({ v: 'high', n: '高清', t: '720P' });
            break;
          case 'superhigh':
            arr.unshift({ v: 'superhigh', n: '超清', t: '1080P' });
            break;
          case 'lossless':
            arr.unshift({ v: 'lossless', n: '原画', t: '4K' });
            break;
          default:
            break;
        }
      });
      return arr;
    },
    // 重置播放器
    pipResetPlayer(){
      this.pipPlayer = null;
      const dqPlayer = document.getElementById(`lee-player-${this.options.el}`);
      if(dqPlayer){
        dqPlayer.style.height = this.height + "px";
        dqPlayer.src = "";
        dqPlayer.innerHTML = "";
      }
      this.pipLoading = true;
      this.pipUrlStatus = false;
      this.pipPlayStatus = false;
      this.pipShowPlayBtn = false;
      this.pipHasPlayedTime = 0;
      this.pipPreloadTime = 0;
      this.pipHasPlayedPoint = 0;
      this.pipDragVolumeLen = 0;
      this.pipFastPlayStep = null;
      this.pipFullTime = 0;
    },
    // 播放或暂停
    pipPlayOrPause() {
      if (this.pipHasPlayedTime === this.pipFullTime) {
        this.pipHasPlayedTime = 0;
        this.pipPlayer ? this.pipPlayer.currentTime = 0 : null;
      }
      this.pipShowPlayBtn = true;
      this.pipPlayStatus = !this.pipPlayStatus;
      this.pipPlayStatus && this.pipPlayer
        ? this.pipPlayer.play()
        : this.pipPlayer.pause();
      // 控制 播放\暂停 按钮显隐
      let timm = setTimeout(() => {
        this.pipShowPlayBtn = !this.pipPlayStatus;
        clearTimeout(timm);
      }, 1500);
    },
    // 时长显示方式
    pipFilterTime(t) {
      const hou = t ? parseInt(t / 3600) : 0;
      const min = t ? parseInt((t - (hou * 3600)) / 60) : 0;
      const sec = t ? parseInt(t % 60) : 0;
      let str = t ? `${min < 10 ? "0" + min : min}:${sec < 10 ? "0" + sec : sec}` : "00:00";
      str = hou ? `${hou < 10 ? "0" + hou : hou}:` + str : str;
      return str;
    },
    // 点击指定播放位置
    pipChangePlayedTime(ev) {
      if(this.pipIsLive){
        return;
      }
      const process = document.querySelector(".pip-process");
      const e = ev || window.event;
      if (process) {
        const w = process.offsetWidth;
        const multiple = e.offsetX / w; // 选中点与总时长比例
        this.pipHasPlayedTime = multiple * (this.options.url ? this.pipFullTime : 0);
        this.pipPlayer ? this.pipPlayer.currentTime = this.pipHasPlayedTime : null; // 原生dom指定播放位置
      }
    },
    // 点击 更改音量
    pipChangeVolume(ev) {
      const volume = document.querySelector(".pip-volume-line");
      const e = ev || window.event;
      if (volume) {
        this.pipOpenVolume = true;
        const h = volume.offsetHeight;
        const multiple = (100 - e.layerY) / h; // 选中点与总音量比例
        this.pipVolume = multiple * 100;
        this.pipPlayer ? this.pipPlayer.volume = multiple : null; // 原生dom指定音量
      }
    },
    // 静音/非静音
    pipToggleVolumeStatus(){
      this.pipOpenVolume = !this.pipOpenVolume;
      this.pipVolume = this.pipVolume || 75;
      this.pipPlayer ? this.pipPlayer.volume = this.pipOpenVolume ? this.pipVolume / 100 : 0 : null; // 原生dom指定音量
    },
    // 初始化 MP4 播放器
    pipCreatePlayer() {
      this.pipResetPlayer();
      setTimeout(() => {
        this.pipInitPlayer();
      }, 222);
    },
    // 初始化 MP4 播放器
    pipInitPlayer() {
      this.pipPlayer = document.getElementById(`lee-player-${this.options.el}`);
      this.pipVolume = this.pipGetPlayInfo('volume') || this.pipVolume;
      this.pipSpeedType = this.pipGetPlayInfo('speed')|| this.pipSpeedType;
      const l = this.options.url.filter((k) => {
        return k.quality === this.pipQualityType;
      });
      const source = this.pipQualityType ? l[0].url : '';
      if (!source) {
        this.pipCreatePlayer();
        return;
      }
      this.pipUrlStatusText = "视频加载中";
      this.pipUrlStatus = true;
      this.pipPlayer.src = source;
      this.pipPlayer.volume = this.pipVolume / 100;
      this.pipPlayer.playbackRate = this.pipSpeedType;
      this.pipPlayer.addEventListener('loadedmetadata', () => { //加载数据
          this.pipLoading = false;
          //视频的总长度
          this.pipFullTime = parseInt(this.pipPlayer.duration);
          if(this.options.autoplay){
            this.pipPlayOrPause();
          }
          if(this.pipPlayer.paused){
            this.pipPlayStatus = false;
            this.pipPlayer.pause();
          }
          // 监听已播放
          this.pipPlayer.addEventListener('timeupdate', () => {
            const current = this.pipPlayer ? this.pipPlayer.currentTime : 0;
            this.pipPreloadTime = this.pipPlayer && this.pipPlayer.buffered.length ? this.pipPlayer.buffered.end(0) : this.pipPreloadTime;
            this.pipPreloadTime = this.pipPreloadTime > this.pipFullTime ? this.pipFullTime : this.pipFullTime - this.pipPreloadTime < 1 ? this.pipFullTime : this.pipPreloadTime;
            const delay = this.pipPreloadTime - current;
            this.pipHasPlayedTime = current;
            // 监听等待 缓冲区
            if(delay < 1 && this.pipHasPlayedTime < this.pipFullTime){
              this.pipPlayStatus = false;
              this.pipUrlStatus = true;
              this.pipUrlStatusText = '视频加载中';
              this.pipLoading = true;
              this.pipShowPlayBtn = true;
              this.pipHasPlayedTime = this.pipPreloadTime;
              this.pipPlayer.currentTime = this.pipPreloadTime;
              this.pipPlayer.play();
            } else {
              this.pipPlayStatus = true;
              this.pipLoading = false;
              this.pipShowPlayBtn = false;
            }
          })
          // 监听暂停
          this.pipPlayer.addEventListener('pause', () => {
            this.pipPlayStatus = false;
            this.pipLoading = false;
            this.pipShowPlayBtn = true;
          })
          // 监听错误区
          this.pipPlayer.addEventListener('error', () => {
            if(this.pipPlayer && this.pipPlayer.error){
              this.pipPlayStatus = false;
              this.pipLoading = true;
              this.pipUrlStatus = false;
              this.pipUrlStatusText = this.pipPlayer.error.message;
            }
          })
          // 监听播放结束
          this.pipPlayer.addEventListener('ended', () => {
            this.pipPlayStatus = false;
            this.pipLoading = false;
            this.pipShowPlayBtn = true;
            this.destroyPipPlayer();
          })
      });
      this.pipListenKeyEvent();
    },
    // 刷新当前播放资源
    pipRefreshPlayTime(){
      this.pipCreatePlayer();
    },
    // 网页全屏
    pipCssScreenFunc() {
      this.pipFullScreen = false;
      const dE = document.querySelector('.pip-pl');
      this.pipCloseFullscreen(dE);
      // 若已开启 则关闭↓；已关闭，则开启↓
      //W3C、FireFox、Chrome等、IE11
      if(dE.requestFullscreen || dE.mozRequestFullScreen || dE.webkitRequestFullScreen || dE.mscssScreenRequestFullscreen){
        this.pipCssScreen ? this.pipCloseFullscreen(dE, 'page') : this.pipRenderCssFull(dE);
      }
    },
    // 渲染网页全屏
    pipRenderCssFull(el){
      el.style.position = 'fixed';
      el.style.left = 0;
      el.style.top = 0;
      el.style.zIndex = 999;
      el.style.width = '100vw';
      el.style.height = '100vh';
      this.pipCssScreen = true;
    },
    // 退出全屏（样式全屏、显示器全屏）
    pipCloseFullscreen(el, type = null) {
      if(type === 'page'){
        el.style.position = 'relative';
        el.style.left = 'auto';
        el.style.top = 'auto';
        el.style.zIndex = 1;
        el.style.width = this.options.width + 'px';
        el.style.height = this.options.height ? this.options.height + 'px' : this.options.width * 550 / 818 + 'px';
        this.pipCssScreen = false;
        return;
      }
      if (document && document.exitFullscreen) {
         document.exitFullscreen();
       } else if (document && document.msExitFullscreen) {
         document.msExitFullscreen();
       } else if (document && document.mozCancelFullScreen) {
         document.mozCancelFullScreen();
       } else if(document && document.oRequestFullscreen){
            document.oCancelFullScreen();
        }else if (document && document.webkitExitFullscreen){
         document.webkitExitFullscreen();
       }else{
        const docHtml = document.documentElement;
        const docBody = document.body;
        docHtml.style.cssText = "";
        docBody.style.cssText = "";
        el.style.cssText = "";
        document.IsFullScreen = false;
      }
    },
    // 显示器全屏
    pipFullScreenFunc() {
      this.pipCssScreen = false;
      const dE = document.querySelector('.pip-pl');
      this.pipCloseFullscreen(dE, 'page')
      //W3C
      if(dE.requestFullscreen){
        this.pipFullScreen ? this.pipCloseFullscreen(dE) : dE.requestFullscreen();
        this.pipFullScreen = !this.pipFullScreen;
      }
      //FireFox
      else if (dE.mozRequestFullScreen) {
        this.pipFullScreen ? this.pipCloseFullscreen(dE) : dE.mozRequestFullScreen();
        this.pipFullScreen = !this.pipFullScreen;
      }
      //Chrome等
      else if (dE.webkitRequestFullScreen) {
        this.pipFullScreen ? this.pipCloseFullscreen(dE) : dE.webkitRequestFullScreen();
        this.pipFullScreen = !this.pipFullScreen;
      }
      //IE11
      else if (dE.msRequestFullscreen) {
        this.pipFullScreen ? this.pipCloseFullscreen(dE) : dE.msRequestFullscreen();
        this.pipFullScreen = !this.pipFullScreen;
      }
    },
    // 底部栏展示当前清晰度
    pipRenderQuality(q) {
      switch (q) {
        case "lossless":
          return "原画";
        case "superhigh":
          return "超清";
        case "high":
          return "高清";
        case "auto":
          return "自动";
        default:
          return "自动";
      }
    },
    // 切换倍速
    pipChangeSpeed(e, s) {
      e.stopPropagation();
      this.pipSpeedType = s;
      this.pipPlayer ? this.pipPlayer.playbackRate = this.pipSpeedType : null;
    },
    // 切换清晰度
    pipChangeQuality(e, q) {
      e.stopPropagation();
      this.pipQualityType = q.v;
      this.pipCreatePlayer();
    },
    // 底部操作栏 淡入淡出
    pipFadeOperationBar(ht){
      this.pipInterval ? clearInterval(this.pipInterval) : '';
      this.pipInterval = null;
      const plControl = document.querySelector('.pip-pl-control');
      plControl.className = plControl.className.includes('pip-show-control') ? plControl.className : plControl.className + ' pip-show-control';
      let hideTime = ht;
      this.pipInterval = setInterval(() => {
        hideTime--;
        this.pipFastPlayStep = hideTime < 3 ? null : this.pipFastPlayStep;
        if(hideTime <= 0){
          plControl.className = plControl.className.includes('pip-show-control') ? plControl.className.split(' pip-show-control')[0] : plControl.className;
          clearInterval(this.pipInterval);
          this.pipInterval = null;
          this.pipFastPlayStep = null;
        }
      }, 1000);
    },
    // 键盘音量 淡入淡出
    pipKeyCodeVol(){
      let tm = 3;
      this.pipKeyVolInterval && clearInterval(this.pipKeyVolInterval);
      this.pipKeyVolInterval = null;
      const vk = document.querySelector('.pip-volume-keycode');
      vk.className = vk.className.includes('pip-volume-keycode-show') ? vk.className : vk.className + ' pip-volume-keycode-show';
      this.pipKeyVolInterval = setInterval(() => {
        tm--;
        if(tm <= 0){
          vk.className = vk.className.includes('pip-volume-keycode-show') ? vk.className.split(' pip-volume-keycode-show')[0] : vk.className;
          clearInterval(this.pipKeyVolInterval);
        }
      }, 1000)
    },
    // 监听键盘事件
    pipListenKeyEvent(){
      const _this = this;
      _this.$nextTick(() => {
        document.onkeydown = function (e){
          // e.stopPropagation();
          // 网页全屏模式下 监听esc
          if (e.keyCode === 27 || e.key === 'Escape') {
            const dE = document.querySelector('.pip-pl');
            _this.pipCloseFullscreen(dE, 'page');
            _this.pipFullScreen = false;
          }
        }
        // 显示器全屏模式下 无法监听esc按钮事件
        window.onresize = () => {
          const isFull = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
          if(!isFull){
            _this.pipFullScreen = false;
          }
        }
        // 播放进度条拖动监听
        let pointleft = 0, pipDragVolumeLen = 0;
        let point = document.querySelector('.pip-point');
        point.onmousedown = function(event){
          const process = document.querySelector('.pip-process');
          point = document.querySelector('.pip-point');
          const processW = process.offsetWidth;
          const eve = event || window.event;
          const leftVal = eve.clientX - this.offsetLeft;
          pipDragVolumeLen = _this.pipHasPlayedTime;
          document.onmousemove = function(ev){
            this.pipLoading = false;
            const e = ev || window.event;
            pointleft = e.clientX - leftVal;
            if(pointleft < 0){
              pointleft = 0;
            } else if(pointleft > scroll.offsetWidth - point.offsetWidth){
              pointleft = scroll.offsetWidth - point.offsetWidth;
            }
            const nowTime = (pointleft / processW) * _this.pipFullTime;
            _this.pipFastPlayStep = _this.pipHasPlayedTime > nowTime ? 'left' : _this.pipHasPlayedTime < nowTime ? 'right' : null;
            _this.pipHasPlayedTime = nowTime;
            _this.pipPlayer ? _this.pipPlayer.currentTime = _this.pipHasPlayedTime : null;
            _this.pipDragVolumeLen = parseInt(Math.abs(pipDragVolumeLen - _this.pipHasPlayedTime));
            //防止拖动鼠标过快，弹起鼠标，point受影响移动
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
          }
        }
        // 音量进度条拖动监听
        const volumeLine = document.querySelector('.pip-volume-line');
        const volumeCheck = document.querySelector('.pip-volume-check');
        let volumeCheckTop = 0;
        const volumeLineH = volumeLine.offsetHeight;
        volumeCheck.onmousedown = function(event){
          const eve = event || window.event;
          const topVal = eve.clientY - this.offsetTop;
          document.onmousemove = function(ev){
            const e = ev || window.event;
            volumeCheckTop = e.clientY - topVal;
            if(volumeCheckTop < 0){
              volumeCheckTop = 0;
            } else if(volumeCheckTop > 100){
              volumeCheckTop = 100;
            }else if(volumeCheckTop > scroll.offsetHeight - volumeCheck.offsetHeight){
              volumeCheckTop = scroll.offsetHeight - volumeCheck.offsetHeight;
            }
            const vol = (100 - volumeCheckTop) / volumeLineH;
            _this.pipOpenVolume = !!vol;
            _this.pipVolume = vol * 100;
            _this.pipPlayer ? _this.pipPlayer.volume = vol : null;
            //防止拖动鼠标过快，弹起鼠标，volumeCheck受影响移动
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
          }
        }
        document.onmouseup = function(){
          document.onmousemove = null;
        }
        // 鼠标进入 监听下方操作栏淡入淡出
        const pl = document.querySelector('.pip-pl');
        pl.onmouseenter = () => {
          _this.pipDebounce(_this.pipFadeOperationBar(5), 1000, true);
          pl.onmousemove = () => {
            _this.pipDebounce(_this.pipFadeOperationBar(5), 1000, true);
          }
        }
        pl.onmouseleave = () =>{
          _this.pipDebounce(_this.pipFadeOperationBar(1), 1000, true);
        }
      })
    },
    // 获取播放自定义数据
    pipGetPlayInfo(s){
      const playinfo = localStorage.getItem('DQ_PLAY_VIDEO_CONFIG');
      if(!playinfo){
        return false;
      }
      const data = JSON.parse(playinfo);
      return data[s];
    },
    // 函数防抖处理 (事件, 防抖间隔, immediate[true 立即执行，false 延迟执行])
    pipDebounce(func, wait, immediate) {
      let timer;
      return function() {
        let context = this, args = arguments;
        if (timer) clearTimeout(timer);
        if (immediate) {
          let callNow = !timer;
          timer = setTimeout(() => {
            timer = null;
          }, wait);
          if (callNow) func.apply(context, args);
        } else {
          timer = setTimeout(() => {
            func.apply(context, args);
          }, wait)
        }
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.pip-pl {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  margin: 0 auto;
  width: 100%;
  height: 100%;
  transition: all .3s;
  .close-btn{
    position: absolute;
    font-size: 16px;
    top: 5px;
    right: 5px;
    color: #fff;
    z-index: 100;
    cursor: pointer;
    transition: all .2s;
    border-radius: 100%;
    opacity: 0;
    &:hover{
      color: #00d5d5;
      background: #fff;
    }
  }
  &:hover{
    .close-btn{
      opacity: 1;
    }
  }
  .pip-loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 30;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #000;
    img {
      width: 70px;
    }
    .pip-tip {
      margin-top: 15px;
      font-size: 12px;
      letter-spacing: 1px;
      color: #00d5d5;
      display: flex;
      justify-content: center;
      align-items: center;
      i {
        font-size: 14px;
        margin-right: 5px;
      }
    }
  }

  /* volume-keycode */
  .pip-volume-keycode{
    position: absolute;
    top:65px;
    left: 50%;
    width: 120px;
    height: 40px;
    margin-left: -60px;
    z-index: 40;
    background: rgba(0, 0, 0, .1);
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(255, 255, 255, .35);
    border-radius: 4px;
    transition: all .3s;
    -webkit-transition: all .3s;
    -moz-transition: all .3s;
    -o-transition: all .3s;
    opacity: 0;
    -webkit-opacity: 0;
    -moz-opacity: 0;
    -o-opacity: 0;
    i{
      font-size: 20px;
      margin-right: 12px;
    }
  }
  .pip-volume-keycode-show{
    opacity: 1!important;
    -webkit-opacity: 1!important;
    -moz-opacity: 1!important;
    -o-opacity: 1!important;
  }

  /* center-btn */
  .pip-center-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 70px;
    height: 70px;
    margin: -35px 0 0 -35px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.5s;
    -webkit-transition: all .5s;
    -moz-transition: all .5s;
    -o-transition: all .5s;
    z-index: 20;
    i {
      font-size: 60px;
      color: #fff;
      transition: all 0.5s;
      cursor: pointer;
      opacity: 1;
      -webkit-opacity: 1;
      -moz-opacity: 1;
      -o-opacity: 1;
    }
    .pip-pbtn {
      opacity: 0;
      -webkit-opacity: 0;
      -moz-opacity: 0;
      -o-opacity: 0;
      transform: scale(1.2);
    }
  }
  .pip-center-btn-check {
    text-shadow: 0 0 6px #10c8af;
  }
  /* playtime-keycode */
  .pip-playtime-keycode{
    width: auto;
    position: absolute;
    left: 8px;
    bottom: 55px;
    padding: 2px 10px;
    border-radius: 3px;
    z-index: 40;
    color: #fff;
    transition: all .5s;
    -webkit-transition: all .5s;
    -moz-transition: all .5s;
    -o-transition: all .5s;
    font-size: 11px;
    opacity: 1;
    -webkit-opacity: 1;
    -moz-opacity: 1;
    -o-opacity: 1;
    background: rgba(255, 255, 255, .2);
  }
  .pip-pt-keycode-none{
     opacity: 0!important;
     -webkit-opacity: 0!important;
    -moz-opacity: 0!important;
    -o-opacity: 0!important;
  }
  /* pl-control */
  .pip-pl-control {
    width: 100%;
    height: 40px;
    position: absolute;
    left: 0;
    bottom: -38px;
    background: rgba(0, 0, 0, 0.8);
    z-index: 40;
    transition: all .5s;
    -webkit-transition: all .5s;
    -moz-transition: all .5s;
    -o-transition: all .5s;
    .pip-process {
      width: calc(100% - 14px);
      height: 4px;
      margin: 0 auto;
      background: #333;
      position: relative;
      cursor: pointer;
      transition: all 0.3s;
      -webkit-transition: all .3s;
      -moz-transition: all .3s;
      -o-transition: all .3s;
      &:hover {
        .pip-point {
          transform: scale(1.1);
          opacity: 1;
          -webkit-opacity: 1;
          -moz-opacity: 1;
          -o-opacity: 1;
        }
      }
      .pip-preload{
        position: absolute;
        top: 0;
        left: 0;
        // width: 50%;
        height: 100%;
        background: #717171;
        z-index: 6;
      }
      .pip-playing {
        position: absolute;
        top: 0;
        left: 0;
        width: 0%;
        height: 100%;
        background: linear-gradient(
          to right bottom,
          #10c8af 0%,
          #10c8af 60%,
          #00d5d5 100%
        );
        z-index: 6;
      }
      .pip-point {
        position: absolute;
        top: -3px;
        left: -5px;
        width: 10px;
        height: 10px;
        border-radius: 100%;
        background: #fff;
        z-index: 7;
        opacity: 0;
        -webkit-opacity: 0;
        -moz-opacity: 0;
        -o-opacity: 0;
        &:hover {
          transform: scale(1.1);
          opacity: 1;
          -webkit-opacity: 1;
          -moz-opacity: 1;
          -o-opacity: 1;
        }
      }
    }
    .pip-opt-buttons {
      width: calc(100% - 24px);
      height: calc(100% - 4px);
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .pip-lf-play {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        span,
        i {
          color: #fff;
          height: 17px;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          line-height: 17px;
        }
        .pip-play-pause-btn {
          margin-right: 15px;
          cursor: pointer;
          i {
            font-size: 20px;
          }
        }
        .pip-live{
          margin-left: 10px;
          border: 1px solid #10c8af;
          color: #10c8af;
          font-size: 9px;
          padding: 0 6px;
          border-radius: 2px;
        }
        .pip-refresh{
          display: inline-block;
          margin-left: 10px;
          transition: all 0.7s;
          -webkit-transition: all .7s;
          -moz-transition: all .7s;
          -o-transition: all .7s;
          cursor: pointer;
          &:hover{
            color: #00d5d5;
            transform: rotate(360deg);
          }
        }
      }
      .pip-rt-screen {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        height: 100%;
        .pip-part,
        i {
          color: #fff;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
        }
        .pip-part {
          margin-left: 20px;
          font-size: 12px;
          height: 100%;
          display: flex;
          align-items: center;
          line-height: 100%;
          cursor: pointer;
          transition: all 0.1s;
          -webkit-transition: all .1s;
          -moz-transition: all .1s;
          -o-transition: all .1s;
          position: relative;
          &:hover {
            color: #10c8af;
            .pip-part-cover {
              opacity: 1;
              -webkit-opacity: 1;
              -moz-opacity: 1;
              -o-opacity: 1;
              bottom: 40px;
              background: #1d1b19;
              z-index: 2;
              transform: scale(1);
            }
            /deep/.pip-process,
            /deep/.pip-playing,
            /deep/.pip-preload {
              pointer-events: unset;
            }
          }
          i {
            font-size: 16px;
          }
          .pip-full {
            font-weight: 600;
            font-size: 16px;
          }
          .pip-part-cover {
            position: absolute;
            bottom: -37px;
            left: 50%;
            height: auto;
            background: rgba(0, 0, 0, 0);
            z-index: -2;
            transition: all 0.3s;
            -webkit-transition: all .3s;
            -moz-transition: all .3s;
            -o-transition: all .3s;
            opacity: 0;
            -webkit-opacity: 0;
            -moz-opacity: 0;
            -o-opacity: 0;
            border-top-left-radius: 3px;
            border-top-right-radius: 3px;
            transform: scale(0);
            span {
              display: block;
              width: 100%;
              height: 28px;
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #fff;
              line-height: 28px;
              text-align: center;
              transition: all 0.3s;
              -webkit-transition: all .3s;
              -moz-transition: all .3s;
              -o-transition: all .3s;
              &:hover {
                color: #10c8af;
                background: #3e3e40;
              }
            }
            .pip-num{
              height: 30px;
              line-height: 30px;
              padding: 0;
              margin: 0;
              font-size: 12px;
              cursor: initial;
              &:hover {
                color: #fff;
                background: rgba(0, 0, 0, 0);
              }
            }
            .pip-play-span {
              color: #10c8af;
            }
            .pip-volume-line {
              width: 4px;
              height: 100px;
              margin: 0 16px 10px;
              border-radius: 2px;
              background: #fff;
              position: relative;
              display: flex;
              flex-direction: column;
              justify-content: flex-end;
              align-items: center;
              .pip-volume-straight {
                width: 4px;
                height: 0px;
                border-radius: 2px;
                background: #10c8af;
              }
              .pip-volume-check {
                position: absolute;
                bottom: -5px;
                left: 50%;
                margin-left: -5px;
                width: 10px;
                height: 10px;
                border-radius: 100%;
                background: #fff;
                box-shadow: 0 -1px 1px #aaa;
                box-sizing: border-box;
                z-index: 4;
              }
            }
          }
          .pip-reward {
            margin-left: -35px;
            width: 70px;
          }
          .pip-speed {
            margin-left: -35px;
            width: 70px;
          }
          .pip-quality {
            margin-left: -50px;
            width: 100px;
          }
          .pip-volume {
            margin-left: -20px;
            width: 36px;
          }
        }
        .pip-check-part {
          color: #10c8af;
        }
      }
    }
  }
  .pip-show-control{
    opacity: 1;
    -webkit-opacity: 1;
    -moz-opacity: 1;
    -o-opacity: 1;
    bottom: 0;
  }
}
.pip-lee-player {
  width: 100% !important;
  height: 100%!important;
  // pointer-events: none;
}
</style>
