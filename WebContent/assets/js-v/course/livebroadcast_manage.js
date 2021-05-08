
var vm = new Vue({
	el: '#app',
	
	data:{
		varList: [],	//list
		roleList: [],	//授权对象
		SUBJECT: '',	//科目
		CLASSHOUR: '',	//课时
		page: [],		//分页类
		KEYWORDS:'',	//检索条件,关键词
		showCount: -1,	//每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
		currentPage: 1,	//当前页码
		add:false,		//增
		del:false,		//删
		edit:false,		//改
		loading:false	//加载状态
    },
    
	methods: {
		
        //初始执行
        init() {
        	//复选框控制全选,全不选 
    		$('#zcheckbox').click(function(){
	    		 if($(this).is(':checked')){
	    			 $("input[name='ids']").click();
	    		 }else{
	    			 $("input[name='ids']").attr("checked", false);
	    		 }
    		});
    		this.getList();
    		this.getDic();
    		setTimeout(function(){
    			vm.modalEffects();
            },200);
        },
        
        //获取列表
        getList: function(){
        	this.loading = true;
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'livebroadcast/list?showCount='+this.showCount+'&currentPage='+this.currentPage,
        		data: {KEYWORDS:this.KEYWORDS,SUBJECT:this.SUBJECT,CLASSHOUR:this.CLASSHOUR,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.varList = data.varList;
        			 vm.page = data.page;
        			 vm.hasButton();
        			 vm.loading = false;
        			 $("input[name='ids']").attr("checked", false);
        		 }else if ("exception" == data.result){
                 	showException("直播课程",data.exception);//显示异常
                 }
        		}
        	}).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                setTimeout(function () {
                	window.location.href = "../../login.html";
                }, 2000);
            });
        },
        
     	//观看直播
    	goView: function(id){
    		 var diag = new top.Dialog();
    		 diag.Drag=true;
    		 diag.Title ="直播";
    		 diag.URL = '../../course/livebroadcast/livebroadcast_view.html?FID='+id;
    		 diag.Width = 1000;
    		 diag.Height = 759;
    		 diag.Modal = true;				//有无遮罩窗口
    		 diag.CancelEvent = function(){ //关闭事件
    			diag.close();
    		 };
    		 diag.show();
    	},
        
    	//查看授权对象
    	viewDx: function(LIVEBROADCAST_ID){
    		$("#viewquetion").click();
    		//发送 post 请求
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'livebroadcast/goEdit',
		    	data: {LIVEBROADCAST_ID:LIVEBROADCAST_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
						vm.roleList = data.roleList;				//角色
                     }else if ("exception" == data.result){
                     	showException("查看授权对象",data.exception);	//显示异常
                     }
                  }
			}).done().fail(function(){
                  swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
               });
    	},
    	
        //初始授权对象窗口事件
    	modalEffects: function () {
    		var overlay = document.querySelector( '.md-overlay' );
    		[].slice.call( document.querySelectorAll( '.md-trigger' ) ).forEach( function( el, i ) {
    			var modal = document.querySelector( '#' + el.getAttribute( 'data-modal' ) ),
    				close = modal.querySelector( '.md-close' );
    			function removeModal( hasPerspective ) {
    				classie.remove( modal, 'md-show' );
    				$('body').removeClass(el.getAttribute( 'data-modal' ));
    				if( hasPerspective ) {
    					classie.remove( document.documentElement, 'md-perspective' );
    				}
    			}
    			function removeModalHandler() {
    				removeModal( classie.has( el, 'md-setperspective' ) );
    			}
    			el.addEventListener( 'click', function( ev ) {
    				classie.add( modal, 'md-show' );
    				$('body').addClass(el.getAttribute( 'data-modal' ));
    				overlay.removeEventListener( 'click', removeModalHandler );
    				overlay.addEventListener( 'click', removeModalHandler );

    				if( classie.has( el, 'md-setperspective' ) ) {
    					setTimeout( function() {
    						classie.add( document.documentElement, 'md-perspective' );
    					}, 25 );
    				}
    			});
    		} );

    	},
        
    	//新增
    	goAdd: function (){
    		 var diag = new top.Dialog();
    		 diag.Drag=true;
    		 diag.Title ="新增";
    		 diag.URL = '../../course/livebroadcast/livebroadcast_edit.html';
    		 diag.Width = 1000;
    		 diag.Height = 535;
    		 diag.Modal = true;				//有无遮罩窗口
    		 diag. ShowMaxButton = true;	//最大化按钮
    	     diag.ShowMinButton = true;		//最小化按钮 
    		 diag.CancelEvent = function(){ //关闭事件
    	    	 var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
    			 if(varSon != null && varSon.style.display == 'none'){
    				 vm.getList();
    			}
    			diag.close();
    		 };
    		 diag.show();
    	},
    	
    	//修改
    	goEdit: function(id){
    		 var diag = new top.Dialog();
    		 diag.Drag=true;
    		 diag.Title ="编辑";
    		 diag.URL = '../../course/livebroadcast/livebroadcast_edit.html?FID='+id;
    		 diag.Width = 1000;
    		 diag.Height = 535;
    		 diag.Modal = true;				//有无遮罩窗口
    		 diag. ShowMaxButton = true;	//最大化按钮
    	     diag.ShowMinButton = true;		//最小化按钮 
    		 diag.CancelEvent = function(){ //关闭事件
    			 var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
    			 if(varSon != null && varSon.style.display == 'none'){
    				 vm.getList();
    			}
    			diag.close();
    		 };
    		 diag.show();
    	},
    	
    	//删除
    	goDel: function (id){
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
            			url: httpurl+'livebroadcast/delete',
            	    	data: {LIVEBROADCAST_ID:id,tm:new Date().getTime()},
            			dataType:'json',
            			success: function(data){
            				 if("success" == data.result){
            					 swal("删除成功", "已经从列表中删除!", "success");
            				 }
            				 vm.getList();
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
    					if(msg == '确定要删除选中的数据吗?'){
    						this.loading = true;
    						$.ajax({
    							xhrFields: {
    	                            withCredentials: true
    	                        },
    							type: "POST",
    							url: httpurl+'livebroadcast/deleteAll?tm='+new Date().getTime(),
    					    	data: {DATA_IDS:str},
    							dataType:'json',
    							success: function(data){
    								if("success" == data.result){
    									swal("删除成功", "已经从列表中删除!", "success");
    		        				 }
    								vm.getList();
    							}
    						});
    					}
    				}
                }
            });
    	},
    	
    	//调用数据字典(科目和课时)
    	getDic: function(){
    		$.ajax({
    			xhrFields: {
                    withCredentials: true
                },
    			type: "POST",
    			url: httpurl+'dictionaries/getLevels',
    	    	data: {DICTIONARIES_ID:'19cdec7037094b3c8cfa1bd85b7bcece',tm:new Date().getTime()},//科目
    			dataType:'json',
    			success: function(data){
    				$("#SUBJECT").html('<option value="" >选择科目</option>');
    				 $.each(data.list, function(i, dvar){
    					 $("#SUBJECT").append("<option value="+dvar.BIANMA+">"+dvar.NAME+"</option>");
    				 });
    			}
    		});
    		$.ajax({
    			xhrFields: {
                    withCredentials: true
                },
    			type: "POST",
    			url: httpurl+'dictionaries/getLevels',
    	    	data: {DICTIONARIES_ID:'8a4cd096d20b47bfa8da3e54f4a0a8d0',tm:new Date().getTime()},//课时
    			dataType:'json',
    			success: function(data){
    				$("#CLASSHOUR").html('<option value="" >选择课时</option>');
    				 $.each(data.list, function(i, dvar){
    					 $("#CLASSHOUR").append("<option value="+dvar.BIANMA+">"+dvar.NAME+"</option>");
    				 });
    			}
    		});
    	},
        
      	//判断按钮权限，用于是否显示按钮
        hasButton: function(){
        	var keys = 'livebroadcast:add,livebroadcast:del,livebroadcast:edit';
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
        			vm.add = data.livebroadcastfhadminadd;		//新增权限
        			vm.del = data.livebroadcastfhadmindel;		//删除权限
        			vm.edit = data.livebroadcastfhadminedit;	//修改权限
        		 }else if ("exception" == data.result){
                 	showException("按钮权限",data.exception);		//显示异常
                 }
        		}
        	})
        },
        
        //-----分页必用----start
        nextPage: function (page){
        	this.currentPage = page;
        	this.getList();
        },
        changeCount: function (value){
        	this.showCount = value;
        	this.getList();
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