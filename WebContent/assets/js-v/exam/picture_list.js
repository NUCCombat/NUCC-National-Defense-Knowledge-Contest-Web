var vm = new Vue({
	el: '#app',
	
	data:{
		varList: [],				//list
		page: [],					//分页类
		KEYWORDS: '',				//检索条件 关键词
		PICTURE_ID: '0',			//主键ID
		PARENT_ID: '0',				//上级ID
		showCount: -1,				//每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
		currentPage: 1,				//当前页码
		add:false,
		del:false,
		edit:false,
		loading:false,				//加载状态
		isShow:false,				//是否从弹窗进入
		serverurl:	''				//服务地址
    },

	methods: {
		
        //初始执行
        init() {
        	var id = this.getUrlKey('id');  //链接参数, 从树点过来
        	if(null != id){
        		this.PICTURE_ID = id;
        	}
        	if('yes' == parent.vm.win){
        		this.isShow = true;
        		this.showCount = 12;
        	}
        	//复选框控制全选,全不选 
    		$('#zcheckbox').click(function(){
	    		 if($(this).is(':checked')){
	    			 $("input[name='ids']").click();
	    		 }else{
	    			 $("input[name='ids']").attr("checked", false);
	    		 }
    		});
        	this.serverurl = httpurl;
    		this.getList(this.PICTURE_ID);
        },

        //获取列表
        getList: function(F_ID){
        	this.PICTURE_ID = F_ID;
        	this.loading = true;
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'picture/list?showCount='+this.showCount+'&currentPage='+this.currentPage,
        		data: {PICTURE_ID:this.PICTURE_ID,KEYWORDS:this.KEYWORDS,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.varList = data.varList;
        			 vm.page = data.page;
				 	 vm.PARENT_ID = data.PARENT_ID;
				 	 vm.hasButton();
        			 vm.loading = false;
        		 }else if ("exception" == data.result){
                 	showException("图片管理",data.exception);//显示异常
                 }
        		}
        	}).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                setTimeout(function () {
                	window.location.href = "../../login.html";
                }, 2000);
            });
        },
        
        //批量上传
		goUpload: function (PICTURE_ID,b){
			 var diag = new top.Dialog();
			 diag.Drag=true;
			 diag.Title = '批量上传';
			 diag.URL = '../../exam/picture/picture_upload.html?PICTURE_ID='+PICTURE_ID;
			 diag.Width = 1000;
			 diag.Height = 490;
			 diag.Modal = b;				//有无遮罩窗口
			 diag.ShowMaxButton = true;		//最大化按钮
			 diag.ShowMinButton = true;		//最小化按钮
			 diag.CancelEvent = function(){ //关闭事件
				 vm.getList(vm.PICTURE_ID);
				 parent.vm.getData(); //刷新父页面
				 diag.close();
			 };
			 diag.show();
		},
        
        //新增
		goAdd: function (PICTURE_ID,Height,Title){
			 var diag = new top.Dialog();
			 diag.Drag=true;
			 diag.Title = Title;
			 diag.URL = '../../exam/picture/picture_edit.html?PARENT_ID='+PICTURE_ID;
			 diag.Width = 600;
			 diag.Height = Height;
			 diag.CancelEvent = function(){ //关闭事件
				 var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
    			 if(varSon != null && varSon.style.display == 'none'){
    				 vm.getList(vm.PICTURE_ID);
    				 parent.vm.getData(); //刷新父页面
    			 }
				 diag.close();
			 };
			 diag.show();
		},
        
		//删除
		goDel: function (Id,FILEPATH){
			if(null == FILEPATH){FILEPATH = '';}
			swal({
				title: '',
	            text: "确定要删除吗?",
	            icon: "warning",
	            buttons: true,
	            dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                	this.loading = true;
	            	$.ajax({
	            		xhrFields: {
	                        withCredentials: true
	                    },
	        			type: "POST",
	        			url: httpurl+'picture/delete',
	        	    	data: {PICTURE_ID:Id,FILEPATH:FILEPATH,tm:new Date().getTime()},
	        			dataType:'json',
	        			success: function(data){
	        				 if("success" == data.result){
	        					 swal("删除成功", "已经从列表中删除!", "success");
	        					 vm.getList(vm.PICTURE_ID);
	            				 parent.vm.getData(); //刷新父页面
	        				 }else if("error" == data.result){
	        					swal("删除失败!", "删除失败！请先删除目录下的文件!", "warning");
	        					vm.loading = false;
	        				 }
	        			}
	        		});
                }
            });
		},
		
		//批量操作
    	makeAll: function (msg){
    		swal({
                title: '',
                text: msg,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
    	        	var str = '';
    				for(var i=0;i < document.getElementsByName('ids').length;i++){
    					  if(document.getElementsByName('ids')[i].checked){
    					  	if(str=='') str += document.getElementsByName('ids')[i].value;
    					  	else str += ',' + document.getElementsByName('ids')[i].value;
    					  }
    				}
    				if(str==''){
    					$("#cts").tips({
    						side:2,
    			            msg:'点这里全选',
    			            bg:'#AE81FF',
    			            time:3
    			        });
    	                swal("", "您没有选择任何内容!", "warning");
    					return;
    				}else{
						this.loading = true;
						$.ajax({
							xhrFields: {
	                            withCredentials: true
	                        },
							type: "POST",
							url: httpurl+'picture/makeAll?tm='+new Date().getTime(),
					    	data: {DATA_IDS:str},
							dataType:'json',
							success: function(data){
								if("success" == data.result){
									swal("删除成功", "", "success");
		        				 }
								vm.getList(vm.PICTURE_ID);
							}
						});
    				}
                }
            });
    	},

      	//根据url参数名称获取参数值
        getUrlKey: function (name) {
            return decodeURIComponent(
                (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
        },
        
      	//修改
        toEdit: function(PICTURE_ID,ID){
    		var title = $("#title"+ID).val();
    		title = '' == title ? '未命名' : title;
    		var remarks = $("#remarks"+ID).val();
    		remarks = '' == remarks ? '(未填写)' : remarks;
    		$.ajax({
				xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'picture/edit?tm='+new Date().getTime(),
		    	data: {PICTURE_ID:PICTURE_ID,NAME:title,REMARKS:remarks},
				dataType:'json',
				success: function(data){
					$("#titlew"+ID).hide();
					$("#remarksw"+ID).hide();
					vm.getList(vm.PICTURE_ID);
				}
			});
		},
    	
    	//打开修改窗口
    	openEdit: function(WID,ID){
    		$("#"+WID).show();
    		$("#"+ID).focus();
		},
		
		//关闭修改窗口
    	closeEdit: function(ID){
    		$("#"+ID).hide();
		},
    	
    	//显示图片
    	showImg: function(path,TPID){
			 $("#"+TPID).html('<img width="300" src="'+path+'">');
			 $("#"+TPID).show();
		},
		
		//隐藏图片
		hideImg: function(TPID){
			 $("#"+TPID).hide();
		},
		
    	//选定图片
    	fix: function (value){
    		parent.vm.fix(value);
    	},
    	
        //下载
    	downloadFile: function (PICTURE_ID){
        	swal({
               	title: '',
                text: '确定要下载此图片吗?',
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                	window.location.href = httpurl + 'picture/download?PICTURE_ID='+PICTURE_ID;            	
                }
            });
        },
        
      	//判断按钮权限，用于是否显示按钮
        hasButton: function(){
        	var keys = 'picture:add,picture:del,picture:edit';
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'head/hasButton',
        		data: {keys:keys,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			vm.add = data.picturefhadminadd;
        			vm.del = data.picturefhadmindel;
        			vm.edit = data.picturefhadminedit;
        		 }else if ("exception" == data.result){
                 	showException("按钮权限",data.exception);//显示异常
                 }
        		}
        	})
        },

	    //-----分页必用----start
	    nextPage: function (page){
	    	this.currentPage = page;
	    	this.getList(this.PICTURE_ID);
	    },
	    changeCount: function (value){
	    	this.showCount = value;
	    	this.getList(this.PICTURE_ID);
	    },
	    toTZ: function (){
	    	var toPaggeVlue = document.getElementById("toGoPage").value;
	    	if(toPaggeVlue == ''){document.getElementById("toGoPage").value=1;return;}
	    	if(isNaN(Number(toPaggeVlue))){document.getElementById("toGoPage").value=1;return;}
	    	this.nextPage(toPaggeVlue);
	    }
	   	//-----分页必用----end
	
	},
	
	mounted(){
	    this.init();
	}
	
})