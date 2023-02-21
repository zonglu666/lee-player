const texts = [
  '无迹方知流光逝，有梦不觉人生寒。大地丰盈，有弥漫人间的暖暖真情，有点燃星空的璀璨烟火，最抚凡人之心。',
  '我非人间惊鸿客，深街小巷一俗人，爱听风就雨，爱执灯伴月，红尘中来，红尘中去。',
  '喜欢在无知无觉的午后打盹儿，任由窗间的阳光倾泻下来，在心中走过千山万水，见过久别故人，而后醒来指尖点检，写下岁月小笺。',
  '小时候拿着风车于落叶满庭的院子里往来奔跑，却发现村子里的老人总是眼光深邃的看着某一片落叶，一坐就是大半天，心里甚是不解。',
  '后来长大了辗转于各个大城市，再次回到自己的家乡。习惯于一个人坐在长江边的大石头上看斜阳，才渐渐的明白那种心境。',
  '或许目之所及，皆是回忆;或许心之所想，皆是过往;又或许眼之所看，皆是遗憾。',
  '多年以后再次回看《西游记》，感触最深的不是大闹天空，也不是落地成佛，而是最初那只石猴刚出世，落于山巅之时，眼神里所深藏的懵懂孤独和温柔。',
  '或许在你我各自的心中都藏有这样一只小猴子吧，只是我们心中的小猴子，不一定要大闹天空，也不一定要落地成佛，只要他开心快乐，喝酒，吃肉，动嗔痴，生爱恨，又有何不可?',
  '漫漫长路，只怕你顾眄身后;夭夭桃花，只怕你逝于飞流。人这一辈子，总要渐渐的习惯，一个人看尽世间冷暖，尝尽人间悲欢，看淡所有的离别。',
  '星空迷上了山野，有雾有灯也有归人，只是这归人是否是你等待的那一人呢?世间离别那么多，真正能看淡又几人呢?',
  '只是遗憾费长房缩不尽相思地，女娲氏补不尽离恨天。不然陆游也不会抒发出“城南小陌又逢春，只见梅花不见人”般的感慨，白居易也不会轻言：“相恨不如潮有信，相思始觉海非深。”',
  '曾行迹安义，于千年古樟树下写下小小的心愿，寄给了漫天繁星。',
  '有些东西会随着岁月的流转，愈发的闪耀清晰。',
  '离别是身后小巷里走过的青砖，千年风雨点层苔，无人叹。',
  '曾驻足南桥，于啤酒街畔的小摊与好友推杯换盏，话尽过去憧憬未来。',
  '而今别后数月，恍如昨兮。离别是街畔驿站的酒旗，人来人往落风尘，是悲欢。',
  '村上在《海边的卡夫卡》说：“袖口相碰也是前世缘。”',
  '喜欢一个人，开始是三缄其口却又四海生风，而后才是许一人以偏爱，尽余生之慷慨。',
  '晚间吃饭的时候，外公突然想要找他和外婆的结婚证了。',
  '我不明所以，这时候找结婚证有什么用。',
  '外公颤抖着说：“我身体不行了，死后遗产留给她好打个证明用。”',
  '听完我一边安慰他，一边流着眼泪帮他找。',
  '外公外婆在一起快五十年了，我在他们身边整整呆了十七年，直到后来去上大学。',
  '毕业之后我又回到了他们身边，这些年里看着他们风吹墨发渐渐的到雪满白头。',
  '许一人以偏爱，尽余生之慷慨。',
  '外公做到了，外婆也做到了。我也会做到的，会的。',
  '与其说是教导，倒不如说是我心里的一粒种子吧。',
  '还记得《烟花易冷》里伽蓝寺里的故事吗?',
  '命薄如纸，世人才说美。',
  '我羡慕《浮生六记》里沈复和陈芸琴瑟相和，相濡以沫的爱情故事，也感叹红拂女随李靖长安一骑的侠情。',
  '只是世间更多的是平平淡淡的爱情，寻一处繁华似锦觅安宁，得一方淡云流水度此生。',
  '但愿日子清静，抬头低头都能遇见柔情。',
  '大地丰盈，人间并不寂寥。',
  '若碧山人来，有清酒深杯',
  '若记忆难谖，有烟花璀璨',
  '若深情以待，有莲步缓来',
  '愿君来年有新愿，旧愿皆已偿。晚安，好梦',
  '浔阳江头夜送客，枫叶荻花秋瑟瑟',
  '主人下马客在船， 举酒欲饮无管弦。', '醉不成欢惨将别， 别时茫茫江浸月', '忽闻水上琵琶声， 主人忘归客不发。',
  '寻声暗问弹者谁？ 琵琶声停欲语迟。', '移船相近邀相见， 添酒回灯重开宴。', '千呼万唤始出来， 犹抱琵琶半遮面。',
  '转轴拨弦三两声， 未成曲调先有情。', '弦弦掩抑声声思， 似诉平生不得志。', '低眉信手续续弹， 说尽心中无限事。',
  '轻拢慢捻抹复挑， 初为霓裳后六幺。', '大弦嘈嘈如急雨， 小弦切切如私语。', '嘈嘈切切错杂弹， 大珠小珠落玉盘。',
  '间关莺语花底滑， 幽咽泉流冰下难。', '冰泉冷涩弦凝绝， 凝绝不通声暂歇。', '别有幽愁暗恨生，此时无声胜有声。',
  '银瓶乍破水浆迸， 铁骑突出刀枪鸣。', '曲终收拨当心画， 四弦一声如裂帛。', '东船西舫悄无言， 唯见江心秋月白。',
  '沉吟放拨插弦中， 整顿衣裳起敛容。', '自言本是京城女， 家在虾蟆陵下住。', '十三学得琵琶成， 名属教坊第一部。',
  '曲罢曾教善才服， 妆成每被秋娘妒。', '五陵年少争缠头， 一曲红绡不知数。', '钿头银篦击节碎， 血色罗裙翻酒污。',
  '今年欢笑复明年， 秋月春风等闲度。', '弟走从军阿姨死， 暮去朝来颜色故。', '门前冷落鞍马稀， 老大嫁作商人妇。',
  '商人重利轻别离， 前月浮梁买茶去。', '去来江口守空船， 绕船月明江水寒。', '夜深忽梦少年事， 梦啼妆泪红阑干。',
  '我闻琵琶已叹息， 又闻此语重唧唧。', '同是天涯沦落人， 相逢何必曾相识！', '我从去年辞帝京， 谪居卧病浔阳城。',
  '浔阳地僻无音乐， 终岁不闻丝竹声。', '住近湓江地低湿， 黄芦苦竹绕宅生。', '其间旦暮闻何物？ 杜鹃啼血猿哀鸣。',
  '春江花朝秋月夜， 往往取酒还独倾。', '岂无山歌与村笛？ 呕哑嘲哳难为听。', '今夜闻君琵琶语， 如听仙乐耳暂明。',
  '莫辞更坐弹一曲， 为君翻作《琵琶行》。', '感我此言良久立， 却坐促弦弦转急。', '凄凄不似向前声， 满座重闻皆掩泣。',
  '座中泣下谁最多？ 江州司马青衫湿。'
];

export function danmuFunc(){
  
  let danmuArr = [
    {
        "createBy":"181",
        "createTime":"2022-01-21 15:32:42",
        "params":{

        },
        "videoBarrageId":25,
        "videoId":55,
        "content":"第一条测试弹幕",
        "startTime":"15.402595",
        "playTime":"normal",
        "style":"font-size: 14px; color: #fff;"
    },
    {
        "createBy":"181",
        "createTime":"2022-01-21 15:46:17",
        "params":{

        },
        "videoBarrageId":26,
        "videoId":55,
        "content":"测试弹幕",
        "startTime":"11.698222",
        "playTime":"10",
        "style":"font-size: 14px; color: #fff;"
    },
    {
        "createBy":"181",
        "createTime":"2022-01-21 16:16:40",
        "params":{

        },
        "videoBarrageId":27,
        "videoId":55,
        "content":"第二条",
        "startTime":"21.086417",
        "playTime":"10",
        "style":"font-size: 14px; color: #fff;"
    },
    {
        "createBy":"181",
        "createTime":"2022-01-21 16:30:34",
        "params":{

        },
        "videoBarrageId":28,
        "videoId":55,
        "content":"哈哈哈哈哈哈哈",
        "startTime":"7.337577",
        "playTime":"10",
        "style":"font-size: 14px; color: #fff;"
    },
    {
        "createBy":"181",
        "createTime":"2022-01-21 16:32:52",
        "params":{

        },
        "videoBarrageId":29,
        "videoId":55,
        "content":"1231233131",
        "startTime":"29.808591",
        "playTime":"10",
        "style":"font-size: 14px; color: #fff;"
    },
    {
        "createBy":"181",
        "createTime":"2022-01-21 17:19:57",
        "params":{

        },
        "videoBarrageId":30,
        "videoId":55,
        "content":"567567567567",
        "startTime":"18.620095",
        "playTime":"10",
        "style":"font-size: 14px; color: #fff;"
    },
    {
        "createBy":"181",
        "createTime":"2022-01-21 18:19:33",
        "params":{

        },
        "videoBarrageId":31,
        "videoId":55,
        "content":"测试测试2022/1/21/18:19",
        "startTime":"5.82973",
        "playTime":"5",
        "style":"font-size: 20px;\n      color: red;\n      font-family: PingFangSC-Medium, PingFang SC;\n      font-weight: 600;"
    },
    {
        "createBy":"181",
        "createTime":"2022-01-21 18:29:40",
        "params":{

        },
        "videoBarrageId":32,
        "videoId":55,
        "content":"111111111111111",
        "startTime":"8.228227",
        "playTime":"5",
        "style":"font-size: 20px;\n      color: red;\n      font-family: PingFangSC-Medium, PingFang SC;\n      font-weight: 600;"
    },
    {
        "createBy":"181",
        "createTime":"2022-01-24 09:55:07",
        "params":{

        },
        "videoBarrageId":33,
        "videoId":55,
        "content":"hahahahahahha",
        "startTime":"7.810444",
        "playTime":"5",
        "style":"font-size: 20px;\n      color: red;\n      font-family: PingFangSC-Medium, PingFang SC;\n      font-weight: 600;"
    },
    {
        "createBy":"181",
        "createTime":"2022-01-24 09:56:17",
        "params":{

        },
        "videoBarrageId":34,
        "videoId":55,
        "content":"1234567890",
        "startTime":"2.09541",
        "playTime":"10",
        "style":"font-size: 20px;\n      color: blue;\n      font-family: PingFangSC-Medium, PingFang SC;\n      font-weight: 600;"
    },
    {
        "createBy":"181",
        "createTime":"2022-01-24 09:57:29",
        "params":{

        },
        "videoBarrageId":35,
        "videoId":55,
        "content":"测试测试弹幕barrage~~",
        "startTime":"10.720978",
        "playTime":"10",
        "style":"font-size: 20px;\n      color: blue;\n      font-family: PingFangSC-Medium, PingFang SC;\n      font-weight: 600;"
    },
    {
        "createBy":"181",
        "createTime":"2022-01-24 14:46:59",
        "params":{

        },
        "videoBarrageId":37,
        "videoId":55,
        "content":"erererttrtretetert",
        "startTime":"13.553364",
        "playTime":"10",
        "style":"font-size: 20px;color: blue;font-family: PingFangSC-Medium, PingFang SC;font-weight: 600;"
    },
    {
        "createBy":"181",
        "createTime":"2022-01-24 15:07:00",
        "params":{

        },
        "videoBarrageId":38,
        "videoId":55,
        "content":"ceshi1111111111111",
        "startTime":"8.725674",
        "playTime":"10",
        "style":"font-size: 20px;color: blue;font-family: PingFangSC-Medium, PingFang SC;font-weight: 600;"
    },
    {
        "createBy":"181",
        "createTime":"2022-01-24 16:43:18",
        "params":{

        },
        "videoBarrageId":39,
        "videoId":55,
        "content":"阿嘎嘎嘎嘎嘎嘎噶那个高",
        "startTime":"5.584897",
        "playTime":"10",
        "style":"font-size: 20px;color: blue;font-family: PingFangSC-Medium, PingFang SC;font-weight: 600;"
    },
    {
        "createBy":"181",
        "createTime":"2022-01-24 16:43:35",
        "params":{

        },
        "videoBarrageId":40,
        "videoId":55,
        "content":"转行转行自治州重中之重",
        "startTime":"22.252148",
        "playTime":"10",
        "style":"font-size: 20px;color: blue;font-family: PingFangSC-Medium, PingFang SC;font-weight: 600;"
    }
];
  // const type = ['5', '10', '15'];
  // const tlen = texts.length;
  // for(let i = 5; i < 1000; i++){
  //   const keys = Math.floor(Math.random() * (i + 5));
  //     const danmu = {
  //       videoId: 55,
  //       videoBarrageId: `span-${i}`,
  //       createTime: keys,
  //       startTime: `${i}`,
  //       content: texts.sort()[i < tlen ? i : Math.floor(Math.random() * tlen)],
  //       playTime: type[i % 3],
  //       style: `font-size: ${Math.floor(Math.random() * 10) + 15}px;
  //       color: ${'#'+ Math.random().toString(16).substr(-6)};
  //       font-weight: ${Math.floor(Math.random() * 10) * 500};`
  //     }
  //     danmuArr.push(danmu);
  // }
  return danmuArr;
}