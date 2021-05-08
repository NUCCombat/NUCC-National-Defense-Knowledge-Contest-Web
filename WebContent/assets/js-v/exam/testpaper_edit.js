
var vm = new Vue({
	el: '#app',
	
	data:{
		TESTPAPER_ID: '',		//主键ID
		pd: [],					//存放字段参数
		PAPERTYPE: '',			//试卷类型
		EVALUATIONRESULTS: 'A',	//出成绩方式
		FREPEAT: true,			//是否可以重复进行考试(每人)
		FTWICE: true,			//补考一次
		FACE: true,				//人脸识别
		ISALONE: false,			//一个个试题考试还是全部列出试题进行考试
		PUBLISHANSWER: true,	//是否公布答案
		FHORDER: true,			//题目顺序，默认都相同
		EXAMINEE: '',			//考试对象
		roleList: [],			//角色列表
		queList: [],			//预览试题列表
		TYPE: '',				//题型
		STATE: 'edit',			//状态
		serverurl: '',			//后台地址
		msg:'add',
		add:false,				//增
		cha:false,				//列表
		edit:false				//修改
    },
	
	methods: {
		
        //初始执行
        init() {
        	this.serverurl = httpurl;
        	var FID = this.getUrlKey('FID');	//当接收过来的FID不为null时,表示此页面是修改进来的
        	if(null != FID){
        		this.msg = 'edit';
        		this.TESTPAPER_ID = FID;
        		this.getData();
        	}else{
        		this.getRoleList();
        	}
        	setTimeout(function(){
        		vm.getDict();
            },200);
        	this.modalEffects();
        	this.hasButton();
        },
        
        //去保存
    	save: function (){
    		
    		this.EXAMINEE = $("#EXAMINEE").val()+'';
    		if('null' == this.EXAMINEE)this.EXAMINEE = '';
    		
			if(this.pd.TITLE == '' || this.pd.TITLE == undefined){
				$("#TITLE").tips({
					side:3,
		            msg:'请输入试卷名称',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.TITLE = '';
				this.$refs.TITLE.focus();
			return false;
			}
			if(this.PAPERTYPE == ''){
				$("#PAPERTYPE").tips({
					side:3,
		            msg:'请输入试卷类型',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.PAPERTYPE = '';
				this.$refs.PAPERTYPE.focus();
			return false;
			}
			if(this.pd.TOTALSCORE == '' || this.pd.TOTALSCORE == undefined || this.pd.TOTALSCORE < 1){
				this.pd.TOTALSCORE = 0;
			}
			if(this.pd.PASSINGSCORE == '' || this.pd.PASSINGSCORE == undefined || this.pd.PASSINGSCORE < 1){
				$("#PASSINGSCORE").tips({
					side:3,
		            msg:'请输入及格分数',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.PASSINGSCORE = '';
				this.$refs.PASSINGSCORE.focus();
			return false;
			}
			if(this.pd.DURATION == '' || this.pd.DURATION == undefined || this.pd.DURATION < 1){
				$("#DURATION").tips({
					side:3,
		            msg:'请输入考试时长',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.DURATION = '';
				this.$refs.DURATION.focus();
			return false;
			}
			var OTIME = $("#OTIME").val();
			if('' == OTIME){
				$("#OTIME").tips({
					side:3,
		            msg:'请输入截止日期',
		            bg:'#AE81FF',
		            time:2
		        });
				this.$refs.OTIME.focus();
				return false;
			}
			if(this.pd.REMARKS == '' || this.pd.REMARKS == undefined){
				$("#REMARKS").tips({
					side:3,
		            msg:'请输入试卷说明',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.REMARKS = '';
				this.$refs.REMARKS.focus();
			return false;
			}
    		
            //发送 post 请求提交保存
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'testpaper/'+this.msg,
			    	data: {TESTPAPER_ID:this.TESTPAPER_ID,
				    TITLE:this.pd.TITLE,
					PAPERTYPE:this.PAPERTYPE,
				    TOTALSCORE:this.pd.TOTALSCORE,
				    PASSINGSCORE:this.pd.PASSINGSCORE,
				    DURATION:this.pd.DURATION,
				    EVALUATIONRESULTS:this.EVALUATIONRESULTS,
				    FREPEAT:this.FREPEAT,
				    PUBLISHANSWER:this.PUBLISHANSWER,
				    FHORDER:this.FHORDER,
				    EXAMINEE:this.EXAMINEE,
				    STATE:this.STATE,
				    FTWICE:this.FTWICE,
				    FACE:this.FACE,
				    ISALONE:this.ISALONE,
				    OTIME:OTIME,
				    REMARKS:this.pd.REMARKS,
			    	tm:new Date().getTime()},
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                        	if(vm.msg == 'add'){
                        		vm.msg = 'edit'
                        		vm.TESTPAPER_ID = data.TESTPAPER_ID;
                        		$('#treeFrame').attr('src', $('#treeFrame').attr('src'));
                        	}else{
                        		swal("", "保存成功", "success");
                        		setTimeout(function(){
                            		window.location.href = 'testpaper_list.html';
                                },1000);
                        	}
                        }else if ("exception" == data.result){
                        	showException("试卷管理",data.exception);//显示异常
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
				url: httpurl+'testpaper/goEdit',
		    	data: {TESTPAPER_ID:this.TESTPAPER_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
                     	vm.FREPEAT = data.pd.FREPEAT == 'true'?true:false;
                     	vm.PUBLISHANSWER = data.pd.PUBLISHANSWER == 'true'?true:false;
                     	vm.FHORDER = data.pd.FHORDER == 'true'?true:false;
						vm.PAPERTYPE = data.pd.PAPERTYPE;
						vm.EVALUATIONRESULTS = data.pd.EVALUATIONRESULTS;
						vm.FTWICE = data.pd.FTWICE == 'true'?true:false;	//是否可以补考一次
						vm.FACE = data.pd.FACE == 'true'?true:false;//人脸识别
						vm.ISALONE = data.pd.ISALONE == 'true'?true:false;//单题考试
						$("#OTIME").val(data.pd.OTIME);				//截止日期
						vm.roleList = data.roleList;				//角色
						vm.EXAMINEE = data.pd.EXAMINEE;				//考试对象
                     }else if ("exception" == data.result){
                     	showException("试卷管理",data.exception);	//显示异常
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
    	
    	//获取数据字典数据
		getDict: function (){
				$.ajax({
					xhrFields: {
                    withCredentials: true
                	},
					type: "POST",
					url: httpurl+'dictionaries/getLevels?tm='+new Date().getTime(),
			    	data: {DICTIONARIES_ID:'testpapertype'},
					dataType:'json',
					success: function(data){
						 $("#PAPERTYPE").append("<option value=''>试卷类型</option>");
						 $.each(data.list, function(i, dvar){
							 if(vm.PAPERTYPE == dvar.BIANMA){
							  	$("#PAPERTYPE").append("<option value="+dvar.BIANMA+" selected>"+dvar.NAME+"</option>");
							 }else{
								$("#PAPERTYPE").append("<option value="+dvar.BIANMA+">"+dvar.NAME+"</option>");
							 }
						 });
					}
				});
		},
		
      	//查看题目
        viewQue: function (T,SELECTEDTOPICS) {
        	$("#viewquetion").click();
        	this.TYPE = T;
        	var qurl = "";
			switch(T){
			    case 'A':
			    	qurl = 'singleelection/getListByIDS';
			        break;
			    case 'B':
			    	qurl = 'multipleselection/getListByIDS';
			        break;
			    case 'C':
			    	qurl = 'judgementquestion/getListByIDS';
			        break;
			    case 'D':
			    	qurl = 'completion/getListByIDS';
			        break;
			    case 'E':
			    	qurl = 'largequestion/getListByIDS';
			        break;
			    case 'F':
			    	qurl = 'compoundquestion/getListByIDS';
			        break;
			}
	        //预览试题列表
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+qurl,
        		data: {DATA_IDS:SELECTEDTOPICS,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.queList = data.varList;
        		 }else if ("exception" == data.result){
                 	showException("试题预览",data.exception);//显示异常
                 }
        		}
        	}).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                setTimeout(function () {
                	window.location.href = "../../login.html";
                }, 2000);
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
		
        //初始查看题目窗口事件
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
    	
    	//判断按钮权限，用于是否显示按钮
        hasButton: function(){
        	var keys = 'testpaper:add,testpaper:cha,testpaper:edit';
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
        			vm.add = data.testpaperfhadminadd;		//增
        			vm.cha = data.testpaperfhadmincha;		//列表
        			vm.edit = data.testpaperfhadminedit;	//修改
        		 }else if ("exception" == data.result){
                 	showException("按钮权限",data.exception);		//显示异常
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