
var vm = new Vue({
	el: '#app',
	
	data:{
		TESTPAPER_ID: '',			//父ID
		TESTPAPERMX_ID: '',			//主键ID
		pd: [],						//存放字段参数
		TOTALSCORE: '',				//题数总分
		ZFRACTION: 0,				//总分
		FHSEL: '已选中0道题',		//题数
		TYPE: '',					//题型
		SELECTEDTOPICS: '',			//题
		ANSWER: '',					//答案
		queList: [],				//预览试题列表
		serverurl: '',				//后台地址
		QNUMBER: 0,					//自动选题的题数
		QTYPE: '',					//自动选题的类型
		LEVEL: '',					//自动选题的级别
		msg:'add'
    },
	
	methods: {
		
        //初始执行
        init() {
        	this.serverurl = httpurl;
        	var FID = this.getUrlKey('FID');	//当接收过来的FID不为null时,表示此页面是修改进来的
        	if(null != FID){
        		this.msg = 'edit';
        		this.TESTPAPERMX_ID = FID;
        		this.getData();
        	}else{
        		this.TESTPAPER_ID = this.getUrlKey('TESTPAPER_ID');
        	}
        	setTimeout(function(){
        		vm.getDict();
        		vm.modalEffects();
            },200);
        },
        
        //去保存
    	save: function (){
    		
			if(this.pd.TITLE == '' || this.pd.TITLE == undefined){
				$("#TITLE").tips({
					side:3,
		            msg:'请输入大题题目',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.TITLE = '';
				this.$refs.TITLE.focus();
			return false;
			}
			if(this.TYPE == '' || this.TYPE == undefined){
				$("#TYPE").tips({
					side:3,
		            msg:'请选择本题题型',
		            bg:'#AE81FF',
		            time:2
		        });
				this.TYPE = '';
				this.$refs.TYPE.focus();
			return false;
			}
			if(this.pd.FRACTION == '' || this.pd.FRACTION == undefined || this.pd.FRACTION < 0){
				$("#FRACTION").tips({
					side:3,
		            msg:'请输入每题分数',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.FRACTION = '';
				this.$refs.FRACTION.focus();
			return false;
			}
			if(this.SELECTEDTOPICS == '' || this.SELECTEDTOPICS == undefined){
				$("#myTab").tips({
					side:3,
		            msg:'请先选题',
		            bg:'#AE81FF',
		            time:2
		        });
				this.SELECTEDTOPICS = '';
			return false;
			}
			if(this.ANSWER == '' || this.ANSWER == undefined){
				this.ANSWER = '';
			}
			if(this.pd.FORDER == '' || this.pd.FORDER == undefined){
				$("#FORDER").tips({
					side:3,
		            msg:'请输入大题排序',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.FORDER = '';
				this.$refs.FORDER.focus();
			return false;
			}
			if(this.pd.REMARKS == '' || this.pd.REMARKS == undefined){
				$("#REMARKS").tips({
					side:3,
		            msg:'请输入大题说明',
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
					url: httpurl+'testpapermx/'+this.msg,
			    	data: {TESTPAPERMX_ID:this.TESTPAPERMX_ID,
			    	TESTPAPER_ID:this.TESTPAPER_ID,
				    TITLE:this.pd.TITLE,
				    TYPE:this.TYPE,
				    FRACTION:this.pd.FRACTION,
				    TOTALSCORE:this.TOTALSCORE,
				    ZFRACTION:this.ZFRACTION,
				    SELECTEDTOPICS:this.SELECTEDTOPICS,
				    ANSWER:this.ANSWER,
				    FORDER:this.pd.FORDER,
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
                        	showException("试卷管理(明细)",data.exception);//显示异常
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
				url: httpurl+'testpapermx/goEdit',
		    	data: {TESTPAPERMX_ID:this.TESTPAPERMX_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
                     	vm.TYPE = data.pd.TYPE;						//题型
                     	vm.TOTALSCORE = data.pd.TOTALSCORE;
                     	vm.ZFRACTION = data.pd.ZFRACTION;
                     	vm.SELECTEDTOPICS = data.pd.SELECTEDTOPICS;	
                     	vm.ANSWER = data.pd.ANSWER;	
                     	var narry = (vm.SELECTEDTOPICS).split(',');
                     	if(null != narry && narry.length != 0)vm.calculation(narry);
                     }else if ("exception" == data.result){
                     	showException("试卷管理(明细)",data.exception);	//显示异常
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
    	
    	//手动选题
		manualSelection: function (){
			if(this.TYPE == '' || this.TYPE == undefined){
				$("#TYPE").tips({
					side:3,
		            msg:'请先选择本题题型',
		            bg:'#AE81FF',
		            time:2
		        });
				this.TYPE = '';
				this.$refs.TYPE.focus();
			return false;
			}
			if(this.pd.FRACTION == '' || this.pd.FRACTION == undefined || this.pd.FRACTION < 0){
				$("#FRACTION").tips({
					side:3,
		            msg:'请先输入每题分数',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.FRACTION = '';
				this.$refs.FRACTION.focus();
			return false;
			}
			
			var dtitle = "";
			var durl = "";
			switch(this.TYPE){
			    case 'A':
			    	dtitle = "单选题";
			    	durl = 'singleelection/singleelection_list_windows.html';
			        break;
			    case 'B':
			    	dtitle = "多选题";
			    	durl = 'multipleselection/multipleselection_list_windows.html';
			        break;
			    case 'C':
			    	dtitle = "判断题";
			    	durl = 'judgementquestion/judgementquestion_list_windows.html';
			        break;
			    case 'D':
			    	dtitle = "填空题";
			    	durl = 'completion/completion_list_windows.html';
			        break;
			    case 'E':
			    	dtitle = "问答题";
			    	durl = 'largequestion/largequestion_list_windows.html';
			        break;
			    case 'F':
			    	dtitle = "复合题";
			    	durl = 'compoundquestion/compoundquestion_list_windows.html';
			        break;
			}
			 var diag = new top.Dialog();
	   		 diag.Drag=true;
	   		 diag.Title = dtitle;
	   		 diag.URL = '../../exam/'+durl;
	   		 diag.Width = 1000;
	   		 diag.Height = 800;
	   		 diag.Modal = false;			//有无遮罩窗口
	   		 diag. ShowMaxButton = true;	//最大化按钮
	   	     diag.ShowMinButton = true;		//最小化按钮
	   		 diag.CancelEvent = function(){ //关闭事件
	   			var fid = diag.innerFrame.contentWindow.document.getElementById('fid').value;	//子窗口选中试题的ID
	   			var fan = diag.innerFrame.contentWindow.document.getElementById('fan').value;	//子窗口选中试题的答案
	   			if("" != fid){
	   				vm.getQue(fid,fan)
	   			 }
	   			diag.close();
	   		 };
	   		 diag.show();
		},
		
		//自动选题
        automatic: function () {
        	if(this.TYPE == '' || this.TYPE == undefined){
				$("#TYPE").tips({
					side:3,
		            msg:'请先选择本题题型',
		            bg:'#AE81FF',
		            time:2
		        });
				this.TYPE = '';
				this.$refs.TYPE.focus();
			return false;
			}
			if(this.pd.FRACTION == '' || this.pd.FRACTION == undefined || this.pd.FRACTION < 0){
				$("#FRACTION").tips({
					side:3,
		            msg:'请先输入每题分数',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.FRACTION = '';
				this.$refs.FRACTION.focus();
			return false;
			}
			if(this.QNUMBER <= 0 || this.QNUMBER == ''){
				$("#QNUMBER").tips({
					side:3,
		            msg:'请输入题数',
		            bg:'#AE81FF',
		            time:2
		        });
				this.QNUMBER = '';
				this.$refs.QNUMBER.focus();
			return false;
			}
			//随机获取试题
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'testpapermx/automatic',
        		data: {QNUMBER:this.QNUMBER,TYPE:this.QTYPE,LEVEL:this.LEVEL,TABN:this.TYPE,tm:new Date().getTime()},//TYPE:this.QTYPE自动选题的题类别(不是题型)，TABN：this.TYPE 是题型(用来根据此参数区分表名来读取数据)
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			var fid = data.fid;	//试题的ID
     	   			var fan = data.fan;	//试题的答案
     	   			if("" != fid){
     	   				vm.getQue(fid,fan)
     	   			 }else{
     	   				$("#FHAU").tips({
	     	   				side:1,
	     	   	            msg:"没有符合要求的试题",
	     	   	            bg:'#AE81FF',
	     	   	            time:3
	     	   	        });
     	   			 }
        		 }else if ("exception" == data.result){
                 	showException("随机获取试题",data.exception);//显示异常
                 }
        		}
        	}).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                setTimeout(function () {
                	window.location.href = "../../login.html";
                }, 2000);
            });
        },
        
      	//根据字符串提取试题
        getQue: function (fid,fan) {
        	if(this.SELECTEDTOPICS == ''){
					this.SELECTEDTOPICS += fid;
			}else{
				this.SELECTEDTOPICS += ','+ fid;
			}
			var arryFid = (this.SELECTEDTOPICS).split(',');
			var rFid = this.unique(arryFid);
   			this.SELECTEDTOPICS = rFid.join(",");	//拼接成新的无重复字符串
			if('A' == this.TYPE || 'B' == this.TYPE || 'C' == this.TYPE){
				if(this.ANSWER == ''){
  					this.ANSWER += fan;
  				}else{
  					this.ANSWER += ','+ fan;
  				}
  				var arryFan = (this.ANSWER).split(',');
  				var rFan = [];
  				var rFan = this.unique(arryFan);
   			this.ANSWER = rFan.join(",");
			}
			this.calculation(rFid);
        },
        
      	//去除数组重复数据
        unique: function (arr){
			let hash=[];
			for (let i = 0; i < arr.length; i++) {
				if(hash.indexOf(arr[i]) === -1){
					hash.push(arr[i]);
				}
			}
			return hash;
		},
        
		//计算题数和总分
        calculation: function (arry) {
        	this.TOTALSCORE = "共"+arry.length+"题/"+(arry.length * this.pd.FRACTION)+"分"
        	this.FHSEL = "已选中"+arry.length+"道题"
        	this.ZFRACTION = arry.length * this.pd.FRACTION;
        	$("#FHSEL").tips({
				side:1,
	            msg:this.FHSEL,
	            bg:'#AE81FF',
	            time:3
	        });
        },
        
      	//查看题目
        viewQue: function () {
        	var qurl = "";
			switch(this.TYPE){
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
        		data: {DATA_IDS:this.SELECTEDTOPICS,tm:new Date().getTime()},
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
        
      	//移除题目
        removeQue: function (ID,TYPE) {
        	var arraySe = this.SELECTEDTOPICS.split(',');
        	var index = arraySe.indexOf(ID);
        	arraySe.splice(index,1);
        	this.SELECTEDTOPICS = arraySe.join(',');
        	if('A' == TYPE || 'B' == TYPE || 'C' == TYPE){
        		var arrayAn = this.ANSWER.split(',');
        		arrayAn.splice(index,1);
        		this.ANSWER = arrayAn.join(',');
        	}
        	if('' == this.SELECTEDTOPICS){
        		this.queList = [];
        	}else{
        		this.viewQue();
        	}
        	this.calculation(arraySe);
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
					 $("#QTYPE").append("<option value=''>不限类型</option>");
					 $.each(data.list, function(i, dvar){
						 $("#QTYPE").append("<option value="+dvar.BIANMA+">"+dvar.NAME+"</option>");
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
					 $("#LEVEL").append("<option value=''>不限级别</option>");
					 $.each(data.list, function(i, dvar){
						 $("#LEVEL").append("<option value="+dvar.BIANMA+">"+dvar.NAME+"</option>");
					 });
				}
			});
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
				