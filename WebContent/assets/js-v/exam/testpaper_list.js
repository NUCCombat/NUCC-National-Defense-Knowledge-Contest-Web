
var vm = new Vue({
	el: '#app',
	
	data:{
		varList: [],	//list
		roleList: [],	//考试对象
		page: [],		//分页类
		KEYWORDS:'',	//检索条件,关键词
		PAPERTYPE: '',	//试卷类型
		NTIME:0,		//当前日期
		STATE: 'edit',	//状态
		showCount: -1,	//每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
		currentPage: 1,	//当前页码
		del:false,		//删
		edit:false,		//改
		alist:false,	//查看成绩
		loading:false	//加载状态
    },
    
	methods: {
		
        //初始执行
        init() {
        	var FS = this.getUrlKey('STATE');	//状态
        	if(null != FS){
        		this.STATE = FS;
        	}
    		this.getList();
    		this.getDic();
    		setTimeout(function(){
    			vm.modalEffects();
            },200);
    		var date = new Date();
    		this.NTIME =  Number(this.dateFormat("YYYYmmdd", date));
        },
        
        //获取列表
        getList: function(){
        	this.loading = true;
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'testpaper/list?showCount='+this.showCount+'&currentPage='+this.currentPage,
        		data: {KEYWORDS:this.KEYWORDS,PAPERTYPE:this.PAPERTYPE,STATE:this.STATE,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.varList = data.varList;
        			 vm.page = data.page;
        			 vm.hasButton();
        			 vm.loading = false;
        			 $("input[name='ids']").attr("checked", false);
        		 }else if ("exception" == data.result){
                 	showException("试卷管理",data.exception);//显示异常
                 }
        		}
        	}).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                setTimeout(function () {
                	window.location.href = "../../login.html";
                }, 2000);
            });
        },
        
    	//预览试卷
    	view: function (id){
    		 var diag = new top.Dialog();
    		 diag.Drag=true;
    		 diag.Title ="预览试卷";
    		 diag.URL = '../../exam/testpaper/testpaper_view.html?FID='+id;
    		 diag.Width = 800;
    		 diag.Height = 600;
    		 diag.Modal = true;				//有无遮罩窗口
    		 diag. ShowMaxButton = true;	//最大化按钮
    	     diag.ShowMinButton = true;		//最小化按钮 
    		 diag.CancelEvent = function(){ //关闭事件
    			diag.close();
    		 };
    		 diag.show();
    	},
    	
    	//此试卷成绩
    	achievement: function (id){
    		 var diag = new top.Dialog();
    		 diag.Drag=true;
    		 diag.Title ="成绩单";
    		 diag.URL = '../../exam/achievement/achievement_list.html?msg=manage&TESTPAPER_ID='+id;
    		 diag.Width = 1000;
    		 diag.Height = 660;
    		 diag.Modal = true;				//有无遮罩窗口
    		 diag. ShowMaxButton = true;	//最大化按钮
    	     diag.ShowMinButton = true;		//最小化按钮 
    		 diag.CancelEvent = function(){ //关闭事件
    			diag.close();
    		 };
    		 diag.show();
    	},
    	
    	//修改
    	goEdit: function(id){
    		window.location.href = 'testpaper_edit.html?FID='+id;
    	},
    	
    	//删除
    	goDel: function (id,STATE){
    		var text = "";
    		if ('end' == STATE) text = "同时会删除此试卷相关联的所有用户成绩等数据";
    		swal({
    			title: '确定要删除吗?',
                text: text,
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
            			url: httpurl+'testpaper/delete',
            	    	data: {TESTPAPER_ID:id,STATE:STATE,tm:new Date().getTime()},
            			dataType:'json',
            			success: function(data){
            				if("success" == data.result){
        		                swal("删除成功", "已经从列表中删除!", "success");
        		                vm.getList();
	        				 }else{
	     		                 swal("删除失败!", "请先删除明细数据!", "warning");
	     		                 vm.loading = false;
	        				 }
            			}
            		});
                }
            });
    	},
        
    	//发放试卷
    	grant: function (id){
    		swal({
    			title: '',
                text: "确定要发放此试卷吗?",
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
            			url: httpurl+'testpaper/editState',
            	    	data: {TESTPAPER_ID:id,STATE:'release',tm:new Date().getTime()},
            			dataType:'json',
            			success: function(data){
            				if("success" == data.result){
        		                swal("操作成功", "此试卷已进入正在考试列表中.", "success");
        		                vm.getList();
	        				 }else{
	     		                 swal("操作失败!", "", "warning");
	     		                 vm.loading = false;
	        				 }
            			}
            		});
                }
            });
    	},
    	
    	//结束考试
    	goEnd: function (id){
    		swal({
    			title: '',
                text: "确定要终止考试吗?",
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
            			url: httpurl+'testpaper/editState',
            	    	data: {TESTPAPER_ID:id,STATE:'end',tm:new Date().getTime()},
            			dataType:'json',
            			success: function(data){
            				if("success" == data.result){
        		                swal("操作成功", "此试卷已进入历史考试列表中.", "success");
        		                vm.getList();
	        				 }else{
	     		                 swal("操作失败!", "", "warning");
	     		                 vm.loading = false;
	        				 }
            			}
            		});
                }
            });
    	},
    	
    	//复制试卷
    	goCopy: function (id){
    		swal({
    			title: '',
                text: "确定要复制此试卷吗?",
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
            			url: httpurl+'testpaper/copy',
            	    	data: {TESTPAPER_ID:id,tm:new Date().getTime()},
            			dataType:'json',
            			success: function(data){
            				if("success" == data.result){
        		                swal("操作成功", "复制的试卷已进入试卷列表中.", "success");
	        				 }else{
	     		                 swal("操作失败!", "", "warning");
	     		                 vm.loading = false;
	        				 }
            			}
            		});
                }
            });
    	},
    	
    	//调用数据字典(试卷类型)
    	getDic: function(){
    		$.ajax({
    			xhrFields: {
                    withCredentials: true
                },
    			type: "POST",
    			url: httpurl+'dictionaries/getLevels',
    	    	data: {DICTIONARIES_ID:'testpapertype',tm:new Date().getTime()},//试题类型
    			dataType:'json',
    			success: function(data){
    				$("#PAPERTYPE").html('<option value="" >试卷类型</option>');
    				 $.each(data.list, function(i, dvar){
    					 $("#PAPERTYPE").append("<option value="+dvar.BIANMA+">"+dvar.NAME+"</option>");
    				 });
    			}
    		});
    	},
    	
      	//判断按钮权限，用于是否显示按钮
        hasButton: function(){
        	var keys = 'testpaper:del,testpaper:edit,achievement:list';
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
        			vm.del = data.testpaperfhadmindel;		//删除权限
        			vm.edit = data.testpaperfhadminedit;	//修改权限
        			vm.alist = data.achievementfhadminlist;	//查看成绩按钮
        		 }else if ("exception" == data.result){
                 	showException("按钮权限",data.exception);		//显示异常
                 }
        		}
        	})
        },
        
        //初始考试对象窗口事件
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
    	
    	//查看考试对象
    	viewDx: function(TESTPAPER_ID){
    		$("#viewquetion").click();
    		//发送 post 请求
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'testpaper/goEdit',
		    	data: {TESTPAPER_ID:TESTPAPER_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
						vm.roleList = data.roleList;				//角色
                     }else if ("exception" == data.result){
                     	showException("查看考试对象",data.exception);	//显示异常
                     }
                  }
			}).done().fail(function(){
                  swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
               });
    	},
    	
    	//日期格式化
    	dateFormat: function(fmt, date) {
    	    let ret;
    	    const opt = {
    	        "Y+": date.getFullYear().toString(),        // 年
    	        "m+": (date.getMonth() + 1).toString(),     // 月
    	        "d+": date.getDate().toString(),            // 日
    	        "H+": date.getHours().toString(),           // 时
    	        "M+": date.getMinutes().toString(),         // 分
    	        "S+": date.getSeconds().toString()          // 秒
    	    };
    	    for (let k in opt) {
    	        ret = new RegExp("(" + k + ")").exec(fmt);
    	        if (ret) {
    	            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
    	        };
    	    };
    	    return fmt;
    	},
        
        //根据url参数名称获取参数值
        getUrlKey: function (name) {
            return decodeURIComponent(
                (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
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
