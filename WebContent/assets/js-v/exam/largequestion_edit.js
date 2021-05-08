
var vm = new Vue({
	el: '#app',
	
	data:{
		LARGEQUESTION_ID: '',	//主键ID
		pd: [],					//存放字段参数
		FILEPATH: '',			//图片地址
		TYPE: '',				//类型
		LEVEL: '',				//级别
		STATE: true,			//状态
		msg:'add'
    },
	
	methods: {
		
        //初始执行
        init() {
        	var FID = this.getUrlKey('FID');	//当接收过来的FID不为null时,表示此页面是修改进来的
        	if(null != FID){
        		this.msg = 'edit';
        		this.LARGEQUESTION_ID = FID;
        		this.getData();
        	}
        	setTimeout(function(){
        		vm.getDict();
            },200);
        },
        
        //去保存
    	save: function (){
    		
			if(this.pd.TITLE == '' || this.pd.TITLE == undefined){
				$("#TITLE").tips({
					side:3,
		            msg:'请输入题目',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.TITLE = '';
				this.$refs.TITLE.focus();
			return false;
			}
			if(this.pd.ANSWER == '' || this.pd.ANSWER == undefined){
				$("#ANSWER").tips({
					side:3,
		            msg:'请输入答案',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.ANSWER = '';
				this.$refs.ANSWER.focus();
			return false;
			}
			if(this.TYPE == ''){
				$("#TYPE").tips({
					side:3,
		            msg:'请输入类型',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.TYPE = '';
				this.$refs.TYPE.focus();
			return false;
			}
			if(this.LEVEL == ''){
				$("#LEVEL").tips({
					side:3,
		            msg:'请输入级别',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.LEVEL = '';
				this.$refs.LEVEL.focus();
			return false;
			}
			if(this.pd.REMARKS == '' || this.pd.REMARKS == undefined){
				this.pd.REMARKS = '(无)';
			}
    		
    		$("#showform").hide();
    		$("#jiazai").show();
    		
            //发送 post 请求提交保存
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'largequestion/'+this.msg,
			    	data: {LARGEQUESTION_ID:this.LARGEQUESTION_ID,
				    TITLE:this.pd.TITLE,
				    FILEPATH:this.FILEPATH,
				    ANSWER:this.pd.ANSWER,
					TYPE:this.TYPE,
					LEVEL:this.LEVEL,
				    STATE:this.STATE,
				    REMARKS:this.pd.REMARKS,
			    	tm:new Date().getTime()},
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                        	swal("", "保存成功", "success");
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("问答题",data.exception);//显示异常
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
    	
    	//根据主键ID获取数据
    	getData: function(){
    		//发送 post 请求
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'largequestion/goEdit',
		    	data: {LARGEQUESTION_ID:this.LARGEQUESTION_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
                     	vm.FILEPATH = data.pd.FILEPATH;
                     	vm.STATE = data.pd.STATE == 'true'?true:false;
						vm.TYPE = data.pd.TYPE;
						vm.LEVEL = data.pd.LEVEL;
                     }else if ("exception" == data.result){
                     	showException("问答题",data.exception);	//显示异常
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
    	
    	//获取数据字典数据
		getDict: function (){
				$.ajax({
					xhrFields: {
                    withCredentials: true
                	},
					type: "POST",
					url: httpurl+'dictionaries/getLevels?tm='+new Date().getTime(),
			    	data: {DICTIONARIES_ID:'testquestionstype'},
					dataType:'json',
					success: function(data){
						 $("#TYPE").append("<option value=''>请选择类型</option>");
						 $.each(data.list, function(i, dvar){
							 if(vm.TYPE == dvar.BIANMA){
							  	$("#TYPE").append("<option value="+dvar.BIANMA+" selected>"+dvar.NAME+"</option>");
							 }else{
								$("#TYPE").append("<option value="+dvar.BIANMA+">"+dvar.NAME+"</option>");
							 }
						 });
					}
				});
				$.ajax({
					xhrFields: {
                    withCredentials: true
                	},
					type: "POST",
					url: httpurl+'dictionaries/getLevels?tm='+new Date().getTime(),
			    	data: {DICTIONARIES_ID:'testquestionslevel'},
					dataType:'json',
					success: function(data){
						 $("#LEVEL").append("<option value=''>请选择级别</option>");
						 $.each(data.list, function(i, dvar){
							 if(vm.LEVEL == dvar.BIANMA){
							  	$("#LEVEL").append("<option value="+dvar.BIANMA+" selected>"+dvar.NAME+"</option>");
							 }else{
								$("#LEVEL").append("<option value="+dvar.BIANMA+">"+dvar.NAME+"</option>");
							 }
						 });
					}
				});
		},
    	
        //选择图片
		selectPictures: function (){
			 var diag = new top.Dialog();
			 diag.Drag=true;
			 diag.Title = '选择图片';
			 diag.URL = '../../exam/picture/picture_tree.html?win=yes';
			 diag.Width = 1199;
			 diag.Height = 633;
			 diag.Modal = false;			//有无遮罩窗口
			 diag.ShowMaxButton = true;		//最大化按钮
			 diag.ShowMinButton = true;		//最小化按钮
			 diag.CancelEvent = function(){ //关闭事件
				 var NFILEPATH = diag.innerFrame.contentWindow.document.getElementById('FILEPATH');
    			 if(NFILEPATH != null && "" != NFILEPATH.value){
    				 vm.FILEPATH = NFILEPATH.value;
    			 }
				 diag.close();
			 };
			 diag.show();
		},
		
    	//显示图片
    	showImg: function(path,TPID){
    		if('' == path || null == path)return false;
			 $("#"+TPID).html('<img width="300" src="'+path+'">');
			 $("#"+TPID).show();
		},
		
		//隐藏图片
		hideImg: function(TPID){
			 $("#"+TPID).hide();
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