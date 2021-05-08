
var vm = new Vue({
	el: '#app',
	
	data:{
		LIVEBROADCAST_ID: '',		//主键ID
		FILEPATH: '',				//图片地址
		pd: [],						//存放字段参数
		AUTHORIZED: '',				//授权对象
		roleList: [],				//角色列表
		SUBJECT: '',
		CLASSHOUR: '',
		msg:'add'
    },
	
	methods: {
		
        //初始执行
        init() {
        	var FID = this.getUrlKey('FID');	//当接收过来的FID不为null时,表示此页面是修改进来的
        	if(null != FID){
        		this.msg = 'edit';
        		this.LIVEBROADCAST_ID = FID;
        		this.getData();
        	}else{
        		this.getRoleList();
        	}
        	setTimeout(function(){
        		vm.getDict();
            },200);
        },
        
        //去保存
    	save: function (){
    		
    		this.AUTHORIZED = $("#AUTHORIZED").val()+'';
    		if('null' == this.AUTHORIZED)this.AUTHORIZED = '';
    		
			if(this.pd.TITE == '' || this.pd.TITE == undefined){
				$("#TITE").tips({
					side:3,
		            msg:'请输入标题',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.TITE = '';
				this.$refs.TITE.focus();
			return false;
			}
			if(this.pd.LECTURER == '' || this.pd.LECTURER == undefined){
				$("#LECTURER").tips({
					side:3,
		            msg:'请输入讲师',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.LECTURER = '';
				this.$refs.LECTURER.focus();
			return false;
			}
			if(this.pd.INTRODUCTION == '' || this.pd.INTRODUCTION == undefined){
				$("#INTRODUCTION").tips({
					side:3,
		            msg:'请输入讲师简介',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.INTRODUCTION = '';
				this.$refs.INTRODUCTION.focus();
			return false;
			}
			if(this.FILEPATH == '' || this.FILEPATH == undefined){
				$("#FILEPATH").tips({
					side:3,
		            msg:'请输入封面图',
		            bg:'#AE81FF',
		            time:2
		        });
				this.FILEPATH = '';
				this.$refs.FILEPATH.focus();
			return false;
			}
			if(this.SUBJECT == ''){
				$("#SUBJECT").tips({
					side:3,
		            msg:'请输入科目',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.SUBJECT = '';
				this.$refs.SUBJECT.focus();
			return false;
			}
			if(this.CLASSHOUR == ''){
				$("#CLASSHOUR").tips({
					side:3,
		            msg:'请输入课时',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.CLASSHOUR = '';
				this.$refs.CLASSHOUR.focus();
			return false;
			}
			if(this.pd.CTIME == '' || this.pd.CTIME == undefined){
				$("#CTIME").tips({
					side:3,
		            msg:'请输入直播时间',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.CTIME = '';
				this.$refs.CTIME.focus();
			return false;
			}
			if(this.pd.HTTPFLV == '' || this.pd.HTTPFLV == undefined){
				$("#HTTPFLV").tips({
					side:3,
		            msg:'请输入HTTP-FLV',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.HTTPFLV = '';
				this.$refs.HTTPFLV.focus();
			return false;
			}
			if(this.pd.M3U8 == '' || this.pd.M3U8 == undefined){
				$("#M3U8").tips({
					side:3,
		            msg:'请输入HLS(m3u8)',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.M3U8 = '';
				this.$refs.M3U8.focus();
			return false;
			}
			if(this.pd.RTMP == '' || this.pd.RTMP == undefined){
				$("#RTMP").tips({
					side:3,
		            msg:'请输入RTMP',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.RTMP = '';
				this.$refs.RTMP.focus();
			return false;
			}
			if(this.pd.REMARKS == '' || this.pd.REMARKS == undefined){
				$("#REMARKS").tips({
					side:3,
		            msg:'请输入备注说明',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.REMARKS = '';
				this.$refs.REMARKS.focus();
			return false;
			}
    		
    		$("#showform").hide();
    		$("#jiazai").show();
    		
            //发送 post 请求提交保存
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'livebroadcast/'+this.msg,
			    	data: {LIVEBROADCAST_ID:this.LIVEBROADCAST_ID,
				    TITE:this.pd.TITE,
				    LECTURER:this.pd.LECTURER,
				    INTRODUCTION:this.pd.INTRODUCTION,
				    FILEPATH:this.FILEPATH,
					SUBJECT:this.SUBJECT,
					CLASSHOUR:this.CLASSHOUR,
				    CTIME:this.pd.CTIME,
				    HTTPFLV:this.pd.HTTPFLV,
				    M3U8:this.pd.M3U8,
				    RTMP:this.pd.RTMP,
				    AUTHORIZED:this.AUTHORIZED,
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
                        	showException("直播课程",data.exception);//显示异常
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
				url: httpurl+'livebroadcast/goEdit',
		    	data: {LIVEBROADCAST_ID:this.LIVEBROADCAST_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
                     	vm.FILEPATH = data.pd.FILEPATH;				//封面图
						vm.SUBJECT = data.pd.SUBJECT;
						vm.CLASSHOUR = data.pd.CLASSHOUR;
						vm.roleList = data.roleList;				//角色
						vm.AUTHORIZED = data.pd.AUTHORIZED;			//授权对象
                     }else if ("exception" == data.result){
                     	showException("直播课程",data.exception);	//显示异常
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
    	
    	//获取数据字典数据
		getDict: function (){
				$.ajax({
					xhrFields: {
                    withCredentials: true
                	},
					type: "POST",
					url: httpurl+'dictionaries/getLevels?tm='+new Date().getTime(),
			    	data: {DICTIONARIES_ID:'19cdec7037094b3c8cfa1bd85b7bcece'},
					dataType:'json',
					success: function(data){
						 $("#SUBJECT").append("<option value=''>请选择科目</option>");
						 $.each(data.list, function(i, dvar){
							 if(vm.SUBJECT == dvar.BIANMA){
							  	$("#SUBJECT").append("<option value="+dvar.BIANMA+" selected>"+dvar.NAME+"</option>");
							 }else{
								$("#SUBJECT").append("<option value="+dvar.BIANMA+">"+dvar.NAME+"</option>");
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
			    	data: {DICTIONARIES_ID:'8a4cd096d20b47bfa8da3e54f4a0a8d0'},
					dataType:'json',
					success: function(data){
						 $("#CLASSHOUR").append("<option value=''>请选择课时</option>");
						 $.each(data.list, function(i, dvar){
							 if(vm.CLASSHOUR == dvar.BIANMA){
							  	$("#CLASSHOUR").append("<option value="+dvar.BIANMA+" selected>"+dvar.NAME+"</option>");
							 }else{
								$("#CLASSHOUR").append("<option value="+dvar.BIANMA+">"+dvar.NAME+"</option>");
							 }
						 });
					}
				});
		},
		
    	//新增时获取角色列表
    	getRoleList: function(){
    		//发送 post 请求
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'role/getRoleList',
		    	data: {tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.roleList = data.roleList;				//角色列表
                     }else if ("exception" == data.result){
                     	showException("获取角色",data.exception);	//显示异常
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