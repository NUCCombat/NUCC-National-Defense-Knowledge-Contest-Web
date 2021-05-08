
var VIDEOPATH = "";	//视频地址
var FILEPATH = "";	//封面图
var TITE = "FHAdmin";

var vm = new Vue({
	el: '#app',
	
	data:{
		VIDEO_ID: '',		//主键ID
		pd: []				//存放字段参数
    },
	
	methods: {
		
        //初始执行
        init() {
        	var FID = this.getUrlKey('FID');	//当接收过来的FID不为null时,表示此页面是修改进来的
        	if(null != FID){
        		this.VIDEO_ID = FID;
        		this.getData();
        	}
        },
    	
    	//根据主键ID获取数据
    	getData: function(){
    		//发送 post 请求
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'video/goEdit',
		    	data: {VIDEO_ID:this.VIDEO_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
                     	VIDEOPATH = httpurl+data.pd.VIDEOPATH;
                     	FILEPATH = data.pd.FILEPATH;
                     	TITE = data.pd.TITE;
                     }else if ("exception" == data.result){
                     	showException("视频播放",data.exception);	//显示异常
                     }
                  }
			}).done().fail(function(){
                  swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
               });
    	},
    	
    	//根据url参数名称获取参数值
        getUrlKey: function (name) {
            return decodeURIComponent(
                (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
        }
        
	},
	
	mounted(){
        this.init();
    }
})

//播放
function openVideo(url){
 var player = cyberplayer("playercontainer").setup({
        width: 986, 		// 宽度，也可以支持百分比(不过父元素宽度要有)
        height: 660, 		// 高度，也可以支持百分比
        title: TITE, 		// 标题
        file: url, 			// 播放地址
        image: FILEPATH, 	// 预览图
        autostart: false, 	// 是否自动播放
        stretching: "uniform", // 拉伸设置
        repeat: false, 		// 是否重复播放
        volume: 100, 		// 音量
        controls: true, 	// controlbar是否显示
        starttime: 0, 		// 视频开始播放时间点(单位s)，如果不设置，则可以从上次播放时间点续播
        ak: "gC4c68fZAyFKhKgjjFWIhyeNDC0V9x2n" // 公有云平台注册即可获得accessKey
    });
}

var s = 0;
window.onload=function(){
	s = setInterval(time,1000);
}
	
function time(){
	if("" != VIDEOPATH){
		clearInterval(s);
		openVideo(VIDEOPATH);
	}
}