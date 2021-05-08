

var vm = new Vue({
	el: '#app',
	
	data:{
		ACHIEVEMENT_ID: '',	//成绩ID
		TESTPAPER_ID: '',	//试卷ID
		EXID: '',			//作答ID
		PASSONOT:'',		//是否及格
		PASSINGSCORE:'',	//及格分数
		SCORE:'',			//得分
		pd: [],				//存放字段参数
		varList: [],		//试卷试题
		serverurl: '',
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
        		this.PASSINGSCORE = this.getUrlKey('PASSINGSCORE');
        		this.PASSONOT = this.getUrlKey('PASSONOT');
        		this.SCORE = this.getUrlKey('SCORE');
        		this.ACHIEVEMENT_ID = this.getUrlKey('ACID');
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
				url: httpurl+'achievement/view',
		    	data: {TESTPAPER_ID:this.TESTPAPER_ID,EXAMINATIONRECORD_ID:this.EXID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                    	 vm.pd = data.pd;							//参数map
                    	 vm.varList = data.varList;					//试卷试题
                    	 vm.loading = false;
                     }else if ("exception" == data.result){
                     	showException("查看作答记录",data.exception);	//显示异常
                     	$("#showform").show();
                 		$("#jiazai").hide();
                     }
                  }
			}).done().fail(function(){
                  swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                  $("#showform").show();
          		  $("#jiazai").hide();
               });
    	},
    	
      	//提交成绩
        subAch: function () {
        	for(var i=0;i < document.getElementsByName('NSCORE').length;i++){
			  if('' == document.getElementsByName('NSCORE')[i].value){
				$("#"+document.getElementsByName('NSCORE')[i].id).tips({
    				side:3,
    	            msg:'这个题还未评分!',
    	            bg:'#AE81FF',
    	            time:3
    	        });
    			$("#"+document.getElementsByName('NSCORE')[i].id).focus();
    			return false;
			  }
			}
       	   swal({
      			title: "",
                  text: "确定要提交成绩吗?",
                  icon: "warning",
                  buttons: true,
                  dangerMode: true,
              }).then((willDelete) => {
                  if (willDelete) {
               		$.ajax({
                   		xhrFields: {
                               withCredentials: true
                           },
                   		type: "POST",
                   		url: httpurl+'achievement/edit',
                   		data: {ACHIEVEMENT_ID:this.ACHIEVEMENT_ID,EXAMINATIONRECORD_ID:this.EXID,PASSINGSCORE:this.PASSINGSCORE,tm:new Date().getTime()},
                   		dataType:"json",
                   		success: function(data){
                   		 if("success" == data.result){
                   			swal("评阅完成!", "已转移到成绩管理列表中", "success");
                   			setTimeout(function(){
                   				top.Dialog.close();//关闭弹窗
                            },1000);
                   		 }else if ("exception" == data.result){
                            	showException("提交成绩",data.exception);//显示异常
                         }
                   		}
                   	}).done().fail(function(){
                           swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                       });
                   }
               });
        },
    	
    	//提交大题评分
    	subBig: function (event,FRACTION,BIGID){
    		if('' == event.currentTarget.value)return false; 
    		if(FRACTION < event.currentTarget.value){
    			$("#"+event.currentTarget.id).tips({
    				side:3,
    	            msg:'已超过满分'+FRACTION+'分',
    	            bg:'#AE81FF',
    	            time:3
    	        });
    			$("#"+event.currentTarget.id).focus();
    			event.currentTarget.value = '';
    			return false;
    		 }else if(event.currentTarget.value < 0){
    			 $("#"+event.currentTarget.id).tips({
     				side:3,
     	            msg:'分值不能小于0',
     	            bg:'#AE81FF',
     	            time:3
     	        });
     			$("#"+event.currentTarget.id).focus();
     			event.currentTarget.value = '';
     			return false; 
    		 }else{
    			 var RESULT = "true";
    			 if(event.currentTarget.value == 0){
    				 RESULT = "false";
    			 }
    			 $.ajax({
 	            	xhrFields: {
 	                    withCredentials: true
 	                },
 					type: "POST",
 					url: httpurl+'bigquestionfo/edit',
 			    	data: {BIGQUESTIONFO_ID:BIGID,SCORE:event.currentTarget.value,RESULT:RESULT,tm:new Date().getTime()},
 					dataType:"json",
 					success: function(data){
                         if("success" == data.result){
                         }else if ("exception" == data.result){
                         	showException("评分:",data.exception);//显示异常
                         }
                     }
 				}).done().fail(function(){
                    swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                 });
    		 }
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