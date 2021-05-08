
var vm = new Vue({
	el: '#app',
	
	data:{
		varList: [],	//list
		rankingList: [],//排名列表
		USERNAME:'',	//查看人用户名
		TESTPAPER_ID:'',//试卷ID
		page: [],		//分页类
		KEYWORDS:'',	//检索条件,关键词
		PASSONOT:'',	//及格否
		PASSINGSCORE:0,	//及格线
		PASSNUM:0,		//及格人数
		STATE:'',		//状态
		showCount: -1,	//每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
		currentPage: 1,	//当前页码
		msg:'',			//判断从哪个菜单进入
		forder: 'de',	//排序,de:默认按照时间排序
		fromlocal:true,	//从正在考试或者历史试卷中打开成绩窗口进入时改为false
		del:false,		//删
		toExcel:false,	//导出到excel权限
		loading:false	//加载状态
    },
    
	methods: {
		
        //初始执行
        init() {
        	var m = this.getUrlKey('msg');
        	if(null != m){
        		this.msg = m;
        		if('admin' == m)this.STATE = "notout";
        		if('manage' == m)this.STATE = "out";
        	}
        	var TESTID = this.getUrlKey('TESTPAPER_ID');	//试卷ID，从正在考试或者历史试卷中打开成绩窗口
        	if(null != TESTID){
        		this.fromlocal = false;
        		this.TESTPAPER_ID = TESTID;
        	}
    		this.getList();
    		this.modalEffects();
    		if(this.fromlocal)this.getTest();
        },
        
        //获取列表
        getList: function(){
        	this.loading = true;
        	if(this.fromlocal)this.TESTPAPER_ID = $("#TESTPAPER_ID").val();
        	if(null == this.TESTPAPER_ID)this.TESTPAPER_ID = '';
    		if('null' == this.TESTPAPER_ID)this.TESTPAPER_ID = '';
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'achievement/list?showCount='+this.showCount+'&currentPage='+this.currentPage,
        		data: {KEYWORDS:this.KEYWORDS,PASSONOT:this.PASSONOT,STATE:this.STATE,msg:this.msg,forder:this.forder,TESTPAPER_ID:this.TESTPAPER_ID,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.varList = data.varList;
        			 vm.page = data.page;
        			 vm.hasButton();
        			 vm.loading = false;
        			 $("input[name='ids']").attr("checked", false);
        		 }else if ("exception" == data.result){
                 	showException("成绩管理",data.exception);//显示异常
                 }
        		}
        	}).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                setTimeout(function () {
                	window.location.href = "../../login.html";
                }, 2000);
            });
        },
        
        //查看排名
        ranking: function(TESTPAPER_ID,USERNAME,PASSINGSCORE){
        	$("#viewRanking").click();
        	this.USERNAME = USERNAME;
        	this.PASSINGSCORE = PASSINGSCORE;
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'achievement/ranking',
        		data: {TESTPAPER_ID:TESTPAPER_ID,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.rankingList = data.rankingList;
        		 }else if ("exception" == data.result){
                 	showException("查看排名",data.exception);//显示异常
                 }
        		}
        	}).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                setTimeout(function () {
                	window.location.href = "../../login.html";
                }, 2000);
            });
        },
        
    	//查看试卷
    	view: function (id,EXID,PASSONOT,SCORE){
    		 var diag = new top.Dialog();
    		 diag.Drag=true;
    		 diag.Title ="查看试卷";
    		 diag.URL = '../../exam/achievement/achievement_view.html?FID='+id+'&EXID='+EXID+'&PASSONOT='+PASSONOT+'&SCORE='+SCORE;
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
    	
    	//评阅试卷
    	correct: function (id,EXID,PASSONOT,SCORE,PASSINGSCORE,ACID){
    		 var diag = new top.Dialog();
    		 diag.Drag=true;
    		 diag.Title ="评阅试卷";
    		 diag.URL = '../../exam/achievement/achievement_correct.html?FID='+id+'&EXID='+EXID+'&PASSONOT='+PASSONOT+'&SCORE='+SCORE+'&PASSINGSCORE='+PASSINGSCORE+'&ACID='+ACID;
    		 diag.Width = 800;
    		 diag.Height = 600;
    		 diag.Modal = true;				//有无遮罩窗口
    		 diag. ShowMaxButton = true;	//最大化按钮
    	     diag.ShowMinButton = true;		//最小化按钮 
    		 diag.CancelEvent = function(){ //关闭事件
    			vm.getList();
    			diag.close();
    		 };
    		 diag.show();
    	},
    	
		//查看用户
		viewUser: function (USERNAME){
			if('admin' == USERNAME){
				swal("禁止查看!", "不能查看admin用户!", "warning");
				return;
			}
			 var diag = new top.Dialog();
			 diag.Drag=true;
			 diag.Title ="资料";
			 diag.URL = '../../sys/user/user_view.html?USERNAME='+USERNAME;
			 diag.Width = 600;
			 diag.Height = 319;
			 diag.Modal = true;			//有无遮罩窗口
			 diag.CancelEvent = function(){ //关闭事件
				diag.close();
			 };
			 diag.show();
		},
    	
    	//删除
    	goDel: function (id,eid){
    		swal({
    			title: '确定要删除吗?',
                text: "也会同时删除相应考试记录!",
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
            			url: httpurl+'achievement/delete',
            	    	data: {ACHIEVEMENT_ID:id,EXAMINATIONRECORD_ID:eid,tm:new Date().getTime()},
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
        
    	//调用试卷列表(正在考试和历史试卷)
    	getTest: function(){
    		$.ajax({
    			xhrFields: {
                    withCredentials: true
                },
    			type: "POST",
    			url: httpurl+'testpaper/achList',
    	    	data: {tm:new Date().getTime()},
    			dataType:'json',
    			success: function(data){
    				$("#TESTPAPER_ID").html('<option value="" >要查询的试卷</option>');
    				 $.each(data.varList, function(i, dvar){
    					 $("#TESTPAPER_ID").append("<option value="+dvar.TESTPAPER_ID+">"+dvar.TITLE.substring(0,14)+"...</option>");
    				 });
    			}
    		});
    	},
    	
      	//判断按钮权限，用于是否显示按钮
        hasButton: function(){
        	var keys = 'achievement:del,toExcel';
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
        			vm.del = data.achievementfhadmindel;		//删除权限
        			vm.toExcel = data.toExcel;						//导出到excel权限
        		 }else if ("exception" == data.result){
                 	showException("按钮权限",data.exception);		//显示异常
                 }
        		}
        	})
        },
        
        //导出excel
		goExcel: function (){
			swal({
               	title: '',
                text: '确定要导出到excel吗?',
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                	window.location.href = httpurl+'achievement/excel?STATE='+this.STATE;            	
                }
            });
		},
		
		//初始查看排名窗口事件
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
    			close.addEventListener( 'click', function( ev ) {
    				ev.stopPropagation();
    				removeModalHandler();
    			});
    		} );

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