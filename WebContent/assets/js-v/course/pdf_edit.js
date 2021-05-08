
var vm = new Vue({
	el: '#app',
	
	data:{
		PDF_ID: '',			//主键ID
		FILEPATH: '',		//图片地址
		pd: [],				//存放字段参数
		AUTHORIZED: '',		//授权对象
		roleList: [],		//角色列表
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
        		this.PDF_ID = FID;
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
			if('add' == this.msg && typeof($("#FFILE").val()) == 'string'){
				if($("#FFILE").val()=="" || document.getElementById("FFILE").files[0] =='请选择PDF'){
					$("#FFILE").tips({
						side:3,
			            msg:'请选择PDF',
			            bg:'#AE81FF',
			            time:3
			        });
					return false;
				}
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
    		
    		if('add' == this.msg){
    			setTimeout(function(){
            		vm.uploadServer();
                },100);
    		}else{
    			vm.goEdit();
    		}
    		
    	},
    	
    	//上传
    	uploadServer: function (){
			var todata = new FormData();
            var fhFile = document.getElementById("FFILE").files[0];
            todata.append("FFILE", fhFile);
            todata.append("TITE", this.pd.TITE);
            todata.append("SUBJECT", this.SUBJECT);
            todata.append("CLASSHOUR",this.CLASSHOUR);
            todata.append("AUTHORIZED",this.AUTHORIZED);
		    todata.append("REMARKS",this.pd.REMARKS);
	        //发送 post 请求提交保存
	        $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					url: httpurl+'pdf/upload',
					type: 'POST',  
	                data: todata,  
	                async: false,  
	                cache: false,  
	                contentType: false,  
	                processData: false,
					success: function(data){
	                    if("success" == data.result){
	                    	$("#fok").tips({
                				side:2,
                	            msg:'上传成功',
                	            bg:'#AE81FF',
                	            time:2
                	        });
	                    	setTimeout(function(){
	                    		top.Dialog.close();//关闭弹窗
	                        },1000);
	                    }else if("error" == data.result){
	                    	alert("上传失败,文件内容不能为空!");
	                    	$("#showform").show();
	                		$("#jiazai").hide();
	                    }else if ("exception" == data.result){
	                    	alert("视频管理"+data.exception);//显示异常
	                    	$("#showform").show();
	                		$("#jiazai").hide();
	                    }
	                }
				}).done().fail(function(){
				   alert("登录失效! 请求服务器无响应，稍后再试");
	               $("#showform").show();
	       		   $("#jiazai").hide();
	            });
    	},
    	
    	goEdit: function(){
    		//发送 post 请求提交保存
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'pdf/'+this.msg,
			    	data: {PDF_ID:this.PDF_ID,
				    TITE:this.pd.TITE,
					SUBJECT:this.SUBJECT,
					CLASSHOUR:this.CLASSHOUR,
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
                        	showException("PDF课程",data.exception);//显示异常
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
				url: httpurl+'pdf/goEdit',
		    	data: {PDF_ID:this.PDF_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                    	 vm.pd = data.pd;							//参数map
 						vm.SUBJECT = data.pd.SUBJECT;
 						vm.CLASSHOUR = data.pd.CLASSHOUR;
 						vm.roleList = data.roleList;				//角色
 						vm.AUTHORIZED = data.pd.AUTHORIZED;			//授权对象
                     }else if ("exception" == data.result){
                     	showException("PDF课程",data.exception);	//显示异常
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

//赋值到textfield
function setFile(obj){
	document.getElementById('textfield').value=obj.value;
	var fileType=obj.value.substr(obj.value.lastIndexOf(".")).toLowerCase();//获得文件后缀名
    if(fileType != '.pdf'){
    	$("#FFILE").tips({
			side:3,
            msg:'请上传pdf格式的文件',
            bg:'#AE81FF',
            time:3
        });
    	$("#FFILE").val('');
    	$("#textfield").val('请上传pdf格式的文件');
    }
}
				