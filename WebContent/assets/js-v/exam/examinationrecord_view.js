
var vm = new Vue({
	el: '#app',
	
	data:{
		TESTPAPER_ID: '',	//主键ID
		EXID: '',			//作答ID
		pd: [],				//存放字段参数
		varList: [],		//试卷试题
		serverurl: '',
		STATE: '',			//作答状态
		fontSize: 14,		//页面字号
		loading:true
    },
	
	methods: {
		
        //初始执行
        init() {
        	this.serverurl = httpurl;
        	var FID = this.getUrlKey('FID');
        	var EXID = this.getUrlKey('EXID');
        	if(null != FID){
        		this.TESTPAPER_ID = FID;
        		this.EXID = EXID;
        		this.STATE = this.getUrlKey('STATE');
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
				url: httpurl+'examinationrecord/view',
		    	data: {TESTPAPER_ID:this.TESTPAPER_ID,EXAMINATIONRECORD_ID:this.EXID,STATE:this.STATE,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                    	 vm.pd = data.pd;							//参数map
                    	 vm.varList = data.varList;					//试卷试题
                    	 vm.loading = false;
                     }else if ("exception" == data.result){
                     	showException("查看作答记录",data.exception);	//显示异常
                     }
                  }
			}).done().fail(function(){
                  swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                  $("#showform").show();
          		  $("#jiazai").hide();
               });
    	},
    	
    	//单选多选题的选项换行
    	lineFeed: function (arField) {
    		var str = "";
    		for(var i=0;i<arField.length;i++){
    			str += arField[i] + '<br>';
    		}
    		return str;
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