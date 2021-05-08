
var vm = new Vue({
	el: '#app',
	
	data:{
		COMPOUNDQUESTION_ID: '',	//主键ID
		pd: [],						//存放字段参数
		TITLE: '',					//题目
		TYPE: '',					//类型
		LEVEL: '',					//级别
		STATE: true,				//状态
		serverurl: '',				//后台地址
		msg:'add',
		CONNULL: false				//富文本是否空		
    },
	
	methods: {
		
        //初始执行
        init() {
        	this.serverurl = httpurl;
        	var FID = this.getUrlKey('FID');	//当接收过来的FID不为null时,表示此页面是修改进来的
        	if(null != FID){
        		this.msg = 'edit';
        		this.COMPOUNDQUESTION_ID = FID;
        		this.getData();
        	}else{
        		this.updateContent('');
        	}
        	setTimeout(function(){
        		vm.getDict();
            },200);
        },
        
        //去保存
    	save: function (){
    		
    		this.getContent('cmques');
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
    		
			if(this.CONNULL){
				$("#showform").hide();
	    		$("#jiazai").show();
	    		
	            //发送 post 请求提交保存
	            $.ajax({
		            	xhrFields: {
		                    withCredentials: true
		                },
						type: "POST",
						url: httpurl+'compoundquestion/'+this.msg,
				    	data: {COMPOUNDQUESTION_ID:this.COMPOUNDQUESTION_ID,
					    TITLE:this.TITLE,
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
	                        	showException("复合题",data.exception);//显示异常
	                        	$("#showform").show();
	                    		$("#jiazai").hide();
	                        }
	                    }
					}).done().fail(function(){
	                   swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
	                   $("#showform").show();
	           		   $("#jiazai").hide();
	                });
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
				url: httpurl+'compoundquestion/goEdit',
		    	data: {COMPOUNDQUESTION_ID:this.COMPOUNDQUESTION_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
                     	vm.updateContent(vm.pd.TITLE);
                     	vm.STATE = data.pd.STATE == 'true'?true:false;
						vm.TYPE = data.pd.TYPE;
						vm.LEVEL = data.pd.LEVEL;
                     }else if ("exception" == data.result){
                     	showException("复合题",data.exception);	//显示异常
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
		
        //获取富文本内容
        getContent: function (TYPE){
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'ueditor/getContent',
            	data: {TYPE:TYPE,tm:new Date().getTime()},	//这个TYPE这里的值是 cmques
        		dataType:'json',
        		async: false,
        		success: function(data){
        			if(data.result == 'success'){
        				vm.TITLE = data.pd.CONTENT;	//带标签的
        				if('' == vm.TITLE){
        					$("#ueFrame").tips({
                       			side:3,
                                   msg:'请输入题目',
                                   bg:'#AE81FF',
                                   time:3
                             });
        				}else{
        					vm.CONNULL = true;
        				}
        			}else{
                   		$("#ueFrame").tips({
                   			side:3,
                               msg:'请输入题目',
                               bg:'#AE81FF',
                               time:3
                         });
        			}
        		}
        	});
        },
        
       	//修改时更新富文本
        updateContent: function (constr){
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'ueditor/edit',
        		data: {CONTENT:constr,CONTENT2:'',TYPE:'cmques',tm:new Date().getTime()},
        		dataType:"json",
        		cache: false,
        		success: function(data){
        		 if("success" == data.result){
        		 }
        		}
        	})
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