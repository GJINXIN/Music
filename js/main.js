var app = new Vue({
    el:"#player",
    data:{
        //查询关键字
        query:"",
        //歌曲数组
        musicList:[],
        //歌曲地址
        musicUrl:"",
        //歌曲播放图标切换
        pause:"iconfont icon-play",
        playing:"music__list__item",
        //歌曲名
        musicName:"...",
        //作者
        artist:"...",
        //图片路径
        picUrl:"",
        //指针状态
        play:"",
        //歌曲在数组中的位置
        musicIndex:0,
        totalTime:"00:00",
        //歌曲静音图标切换
        volume:"iconfont icon-volume"
    },
    methods:{
        //歌曲搜索
        searchMusic:function(){
            var that=this;
            axios.get("https://autumnfish.cn/search?keywords="+this.query)
            .then(function(response){
                that.musicList=response.data.result.songs;
                console.log(response)
            },function(err){})
        },
        //歌曲播放
        playMusic:function(musicId,musicname,artist,index){
            this.play="play";
            this.musicIndex=index;

            //获取点击歌曲url并播放
            var that=this;
            axios.get("https://autumnfish.cn/song/url?id="+musicId)
            .then(function(response){
                that.musicUrl=response.data.data[0].url;
                that.pause="iconfont icon-pause";
                that.playing="music__list__item play";
                that.musicName=musicname;
                that.artist=artist;
                console.log(response)
            },function(err){})

            //获取时长
            totalMinute = parseInt(this.$refs.audio.duration / 60) < 10 ? "0" + parseInt(this.$refs.audio.duration / 60) : parseInt(this.$refs.audio.duration / 60);
            totalSecond = parseInt(this.$refs.audio.duration % 60) < 10 ? "0" + parseInt(this.$refs.audio.duration % 60) : parseInt(this.$refs.audio.duration % 60);
            this.totalTime = totalMinute +":"+ totalSecond;
            console.log(this.totalTime)
            

            //歌曲详情获取
            axios.get("https://autumnfish.cn/song/detail?ids="+musicId)
            .then(function(response){
                console.log(response.data.songs[0].al.picUrl)
                that.picUrl=response.data.songs[0].al.picUrl;
            },function(err){})
        },
        //歌曲播放与暂停切换
        musiccl:function(){
            if(this.pause=="iconfont icon-pause"){
                this.$refs.audio.pause();
                this.pause="iconfont icon-play";
                this.play=""
            }else{
                this.$refs.audio.play();
                this.pause="iconfont icon-pause";
                this.play="play"
            }
        },
        //歌曲切换
        musicChange:function(changeid){
            index=this.musicIndex;
            if( index>=0 && index<=this.musicList.length){
                //上一首
                if(changeid=="pre" && index>0){
                    musicId=this.musicList[index-1].id;
                    musicname=this.musicList[index-1].name;
                    artist=this.musicList[index-1].artists[0].name;
                    this.playMusic(musicId,musicname,artist,index-1);
                }
                //下一首
                if(changeid=="next" && index<this.musicList.length){
                    musicId=this.musicList[index+1].id;
                    musicname=this.musicList[index+1].name;
                    artist=this.musicList[index+1].artists[0].name;
                    this.playMusic(musicId,musicname,artist,index+1);
                }
            }
        },
        //静音
        bansound:function(){
            if(this.volume=="iconfont icon-volume"){
                this.$refs.audio.muted=true;
                this.volume="iconfont icon-muted";
            }else{
                this.$refs.audio.muted=false;
                this.volume="iconfont icon-volume";
            }
        }
    }
})