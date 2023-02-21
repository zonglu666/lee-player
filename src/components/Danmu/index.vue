<template>
    <div class="danmu">
        <div class="danmu-list"></div>
    </div>
</template>

<script>
export default {
    name: 'Danmu',
    props: ['openDanmu', 'danmuData', 'playStatus', 'hasPlayedTime', 'danmuOpacity', 'danmuArea'],
    data(){
        return {
            danmus: [],
            newDanmu: null,
        }
    },
    watch: {
        danmuArea(n ,o){
            if (n !== o && String(o)) {
                if(n){
                    const height = document.querySelector('.danmu').offsetHeight;
                    const list = document.querySelector('.danmu-list');
                    switch(n){
                        case 'top':
                            list.style.height = height / 3 + 'px';
                            list.style.marginTop = '0';
                            break;
                        case 'center':
                            list.style.height = height / 3 + 'px';
                            list.style.marginTop = height / 3 + 'px';
                            break;
                        case 'bottom':
                            list.style.height = height / 3 + 'px';
                            list.style.marginTop = 2 * height / 3 + 'px';
                            break;
                        default:
                            list.style.height = '100%';
                            list.style.marginTop = '0';
                            break;
                    }
                    
                }
            }
        },
        danmuOpacity(n, o){
           if (n !== o && String(o)) {
                if(n){
                    const list = document.querySelector('.danmu-list');
                    list.style.opacity = n;
                }
            } 
        },
        openDanmu(n ,o){
            if (n !== o && String(o)) {
                if(n){
                    this.danmus = JSON.parse(JSON.stringify(this.danmuData));
                    this.renderDanmu(this.danmus, this.hasPlayedTime);
                    return;
                }
                const list = document.querySelector('.danmu-list');
                list.innerHTML = '';
            }
        },
        danmuData(n ,o){
            if(n !== o){
                this.danmus = JSON.parse(JSON.stringify(this.danmuData));
                if(sessionStorage){
                    this.newDanmu = JSON.parse(sessionStorage.getItem('newDanmu'));
                }
                // console.log('弹幕数据已更新就触发这里，danmuData------------------------：', this.danmuData.length, this.danmuData);
                this.renderDanmu(this.danmus, this.hasPlayedTime);
            }
        },
        hasPlayedTime(n, o){
            if(n === 0){
                const list = document.querySelector('.danmu-list');
                list.innerHTML = '';
                this.danmus = JSON.parse(JSON.stringify(this.danmuData));
                this.renderDanmu(this.danmus, n);
            }
            if (n !== o && String(o)) {
                if(Math.abs(n - o) > 1.5){
                    const list = document.querySelector('.danmu-list');
                    list.innerHTML = '';
                }
                if(this.openDanmu){
                    if(n < o){
                        this.danmus = JSON.parse(JSON.stringify(this.danmuData));
                    }
                    this.renderDanmu(this.danmus, n);
                }
            }
            this.reRenderDanmu(n);
        },
        playStatus(n, o){
            if(n !== o && String(o)){
                if(this.openDanmu){
                    const dms = document.getElementsByClassName('dm');
                    const list = document.querySelector('.danmu-list');
                    for(let i = 0; i < dms.length; i++){
                        if(!this.playStatus){
                            // console.log('暂停111111', list);
                            const DmHasGoLen = this.hasPlayedTime - dms[i].getAttribute('start');
                            const duration = dms[i].getAttribute('duration');
                            if(DmHasGoLen >= 0 && DmHasGoLen < duration){
                                dms[i].style.transform = `translateX(${(-dms[i].offsetWidth - list.offsetWidth) * DmHasGoLen / duration  - 50 }px)`;
                            }
                            dms[i].style.transition = `transform 0s linear`;
                        } else {
                            // console.log('播放222222', list)
                            dms[i].style.transform = `translateX(${-dms[i].offsetWidth - list.offsetWidth - 50}px)`;
                            dms[i].style.transition = `transform ${dms[i].getAttribute('duration')}s linear`;
                        }
                    }
                }
            }
        }
  },
  mounted(){
      const list = document.querySelector('.danmu-list');
      list.innerHTML = '';
      this.danmus = JSON.parse(JSON.stringify(this.danmuData));
      this.renderDanmu(this.danmus, this.hasPlayedTime);
  },
  methods: {
      // 渲染弹幕
    renderDanmu(danmus, idx){
        // console.log('验证是否数据已更新就触发这里，数据长度变化：', danmus.length, danmus)
        const list = document.querySelector('.danmu-list');
        if(!danmus.length){
            return;
        }
        let k = 0;
        const i = parseInt(idx);
        danmus.map((m, n) => {
            if(parseInt(m.startTime) === i){
                k = n;
                const span = document.getElementsByClassName(`span-${m.videoBarrageId}`);
                if(m && m.content && span.length < 1){
                    const sp = document.createElement('div');
                    sp.setAttribute('class', `span-${m.videoBarrageId} dm`);
                    const viewBox = list.offsetHeight - 80;
                    let top = m.startTime * 20 > viewBox ? (m.startTime * 20) % viewBox : m.startTime * 20;
                    if(k){
                        top = top + k * 20;
                        top = top > viewBox ? top % viewBox : top;
                    }
                    let stl = `position:absolute;top:${top}px;left: ${list.offsetWidth}px;user-select: none;white-space:nowrap;padding: 0 5px;margin: 0 5px;box-sizing: border-box;`
                    stl = stl + m.style + (this.newDanmu && this.newDanmu.content === m.content ? 'border: 1px solid #fff;border-radius: 5px' : '');
                    sp.setAttribute('start', m.startTime);
                    sp.setAttribute('duration', m.playTime);
                    sp.setAttribute('style',stl);
                    sp.innerHTML = m.content;
                    list.appendChild(sp);
                    sp.style.transform = `translateX(${-sp.offsetWidth - list.offsetWidth - 50}px)`;
                    sp.style.transition = `transform ${m.playTime}s linear`;
                    if(!this.playStatus){
                        sp.style.transform = `translateX(${(-sp.offsetWidth - list.offsetWidth) * (this.hasPlayedTime - m.startTime) / Number(m.playTime)  - 50 }px)`;
                        sp.style.transition = `transform 0s linear`;
                    }
                    // k ? this.danmus.splice(k, 1) : '';
                    if(this.newDanmu && this.newDanmu.content === m.content){
                        sessionStorage.removeItem('newDanmu');
                        this.newDanmu = null;
                    }
                }
            }
        })
    },
    // 删除已渲染 已超出页面元素
    reRenderDanmu(n){
        const dms = document.getElementsByClassName('dm');
        for(let i = 0; i < dms.length; i++){
                const DmHasGoLen = parseInt(n) - dms[i].getAttribute('start');
                const duration = dms[i].getAttribute('duration') - 0;
                // console.log('DmHasGoLen > duration', DmHasGoLen, duration)
                if(DmHasGoLen > duration){
                    const list = document.querySelector(`.danmu-list`);
                    list.removeChild(dms[i]);
                }
        }
    }
  }

}
</script>

<style lang="scss" scoped>
/deep/.dm-paused{
  animation-play-state: paused;
  -webkit-animation-play-state: paused;
}
/* danmu */
  .danmu{
    position: absolute;
    top: 5px;
    left: 0;
    width: 100%;
    height: calc(100% - 55px);
    z-index: 7;
    .danmu-list{
      width: 100%;
      height: 100%;
      position: relative;
      display: flex;
      flex-grow: 1;
    }
  }
</style>