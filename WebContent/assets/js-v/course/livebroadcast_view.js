var HTTPFLV = "";
var M3U8 = "";
var RTMP = "";
var websocket;

var vm = new Vue({
	el: '#app',
	
	data:{
		LIVEBROADCAST_ID: '',		//主键ID
		CONTENT:'',					//弹幕
		pd: [],						//存放字段参数
		DMKG:true
    },
	
	methods: {
		
        //初始执行
        init() {
        	var FID = this.getUrlKey('FID');	//当接收过来的FID不为null时,表示此页面是修改进来的
        	if(null != FID){
        		this.LIVEBROADCAST_ID = FID;
        		this.getData();
        		this.getMsg();
        	}
        	
        	//回车发弹幕
            document.onkeydown = function(e) {
            var key = window.event.keyCode;
            if (key === 13) {
                vm.run_example();
                }
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
				url: httpurl+'livebroadcast/goEdit',
		    	data: {LIVEBROADCAST_ID:this.LIVEBROADCAST_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" === data.result){
                     	vm.pd = data.pd;							//参数map
                     	HTTPFLV = data.pd.HTTPFLV;
                     	M3U8 = data.pd.M3U8;
                     	RTMP = data.pd.RTMP;
                     }else if ("exception" === data.result){
                     	showException("直播课程",data.exception);	//显示异常
                     }
                  }
			}).done().fail(function(){
                  swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
               });
    	},
    	
    	//获取视频弹幕服务信息
    	getMsg: function(){
    		//发送 post 请求
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'livebroadcast/getMsg',
		    	data: {tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" === data.result){
                     	vm.bulletChat(data.USERNAME,data.bcadress);
                     }else if ("exception" === data.result){
                     	showException("获取视频弹幕服务信息",data.exception);	//显示异常
                     }
                  }
			}).done().fail(function(){
                  swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
               });
    	},
    	
    	//发送弹幕
    	run_example: function(){
    	    if('' === this.CONTENT || !this.DMKG)return false;
    	    websocket.send(top.vm.userPhoto+",fh,"+this.LIVEBROADCAST_ID+",fh,"+top.vm.user_name+'：'+this.CONTENT);
    	    this.CONTENT = '';
    	    return false;
    	},
    	
    	//接收到的弹幕
    	receive_example: function(userPhoto,CONTENT){
    	    var color = [["AFD8F8"],["F6BD0F"],["8BBA00"],["FF8E46"],["008E8E"],["D64646"],["8E468E"],["588526"],["B3AA00"],["008ED6"],["9D080D"],["A186BE"]];
    	    var example_item={'img':userPhoto,'info':CONTENT,'color':'#'+color[this.rnd(0, 11)]};
    	    $('body').barrager(example_item);
    	    return false;
    	},
    	
        //链接弹幕服务器
    	bulletChat: function (USERNAME,bcadress){
    		if (window.WebSocket) {
    			bcadress = bcadress.replace(/:\d+$/, "");
    			websocket = new WebSocket(encodeURI('wss://'+bcadress));
    			websocket.onopen = function() {
    				websocket.send('[video313596790]'+vm.LIVEBROADCAST_ID+USERNAME);//连接成功,加入
    			};
    			//消息接收
    			websocket.onmessage = function(message) {
    				if(vm.DMKG){
    					var getMessage = message.data.split(',fh,');
    					vm.receive_example(getMessage[0],getMessage[2]);
    				}
    			};
    		}
    	},
    	
    	//清屏
        clear_barrage: function(){
            $.fn.barrager.removeAll();
        },
    	
    	//区间随机数
    	rnd: function(n, m){
            var random = Math.floor(Math.random()*(m-n+1)+n);
            return random;
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

//播放直播
function openVideo(url){
	var player = cyberplayer("playercontainer").setup({
	    width: 986,
	    height: 660,
	    file: url, 	//直播地址
	    autostart: true,
	    stretching: "uniform",
	    volume: 100,
	    controls: true,
	    rtmp: {
	        reconnecttime: 5, // rtmp直播的重连次数
	        bufferlength: 1 // 缓冲多少秒之后开始播放 默认1秒
	    },
	    ak: "gC4c68fZAyFKhKgjjFWIhyeNDC0V9x2n" // 公有云平台注册即可获得accessKey
	});
}

var s = 0;
window.onload=function(){
	s = setInterval(time,1000);
}
	
function time(){
	if("" !== M3U8){
		clearInterval(s);
		openVideo(M3U8);
	}
}

//切换
function changeUrl(v){
	if(v === 1){
		openVideo(M3U8);
	}else if(v === 2){
		openVideo(HTTPFLV);
	}else if(v === 3){
		openVideo(RTMP);
	}
}
