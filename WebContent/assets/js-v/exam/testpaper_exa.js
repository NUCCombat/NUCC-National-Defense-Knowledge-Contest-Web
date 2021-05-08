
window.onbeforeunload = function(event) {return ""};//页面离开或者刷新的时候提示
var locat = (window.location+'').split('views')[0]; 
var ftimer = null;
var vm = new Vue({
	el: '#app',
	
	data:{
		arLetter:["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],
		TESTPAPER_ID: '',	//试卷ID
		EXID: '',			//作答ID
		QID: '',			//试题ID
		EVALUATIONRESULTS: 'A',	//出成绩方式 A考完直接出,B人工阅卷后出
		FREPEAT: true,		//是否可以重复进行考试(每人)
		FTWICE: true,		//补考一次
		FACE: true,			//人脸识别
		times:1,			//当前验证次数
		finterval:60000,	//间隔毫秒
		SCORE: '0',			//得分
		ZS:0,				//考试次数
		PASSONOT: '',		//是否及格
		pd: [],				//存放字段参数
		varList: [],		//试卷试题
		serverurl: '',		//后台服务地址
		USERNAME:'',		//用户名
		fend:false,			//是否结束
		isok:false,			//判断是否最后提交试卷
		bsub:false,			//提交试卷按钮
		loading:true
    },
	
	methods: {
		
        //初始执行
        init() {
        	this.serverurl = httpurl;
        	var FID = this.getUrlKey('FID');
        	var EXID = this.getUrlKey('EXID');
        	if(null != FID){
        		this.TESTPAPER_ID = FID;
        		this.EXID = EXID;
        		this.getData();
        	}
        },
    	
    	//读取试题
    	getData: function(){
    		//发送 post 请求
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'testpaper/view',
		    	data: {TESTPAPER_ID:this.TESTPAPER_ID,EXAMINATIONRECORD_ID:this.EXID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                    	 vm.pd = data.pd;							//参数map
                    	 vm.varList = data.varList;					//试卷试题
                    	 vm.timer(data.pd.DURATION-data.DTIME);		//考试时间
                    	 vm.finterval = (data.pd.DURATION * 1000 * 60)/2;//间隔时间是考试总时间的一半，开始验证一次，中途验证一次，最后验证一次
                    	 vm.FREPEAT = data.pd.FREPEAT == 'true'?true:false;	//是否可以重复进行考试(每人)
                    	 vm.FTWICE = data.pd.FTWICE == 'true'?true:false;	//是否可以补考一次
 						 vm.FACE = data.pd.FACE == 'true'?true:false;		//人脸识别
 						if(!vm.FACE){
 							vm.bsub = true;
                   		 	$("#rlsb").hide();
                   		 }else{
                   			vm.getUsername();
                   		 }
 						 vm.EVALUATIONRESULTS = data.pd.EVALUATIONRESULTS;
                    	 vm.intHtml(data.varList);
                    	 vm.loading = false;
                     }else if ("exception" == data.result){
                     	showException("试卷预览",data.exception);	//显示异常
                     	$("#showform").show();
                 		$("#jiazai").hide();
                     }
                  }
			}).done().fail(function(){
                  swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                  setTimeout(function () {
                  	window.location.href = "../../login.html";
                  }, 2000);
               });
    	},
        
    	//单选多选题判断题的选项格式处理
    	formatOption: function (arField,br,fi1,fi2,type,fa,qid) {
    		var str = "";
    		if(type == 'C'){
    			str += '<div style="font-size:15px;" class="radio radio-primary d-inline"><input onclick="selection1(\'true\',\''+fa+'\',\''+qid+'\',\'f'+fi1+fi2+'\')" type="radio" name="radio-p-'+fi1+fi2+'" id="f'+fi1+fi2+'1"><label for="f'+fi1+fi2+'1" class="cr">正确</label></div>   ';
    			str += '<div style="font-size:15px;" class="radio radio-primary d-inline"><input onclick="selection1(\'false\',\''+fa+'\',\''+qid+'\',\'f'+fi1+fi2+'\')" type="radio" name="radio-p-'+fi1+fi2+'" id="f'+fi1+fi2+'2"><label for="f'+fi1+fi2+'2" class="cr">错误</label></div>';
    		}else{
    			for(var i=0;i<arField.length;i++){
        			if(type == 'A'){
        				str += '<div style="font-size:15px;" class="radio radio-primary d-inline"><input onclick="selection1(\''+this.arLetter[i]+'\',\''+fa+'\',\''+qid+'\',\'f'+fi1+fi2+'\')" type="radio" name="radio-p-'+fi1+fi2+'" id="f'+fi1+fi2+i+'"><label for="f'+fi1+fi2+i+'" class="cr"></label></div>'+arField[i]+'&nbsp;&nbsp;&nbsp;&nbsp;'+br;
        			}else{
        				str += '<div style="font-size:15px;" class="checkbox checkbox-primary checkbox-fill d-inline"><input onclick="selection2(\''+this.arLetter[i]+'\',\'f'+fi1+fi2+i+'\',\'f'+fi1+fi2+'\',\''+fa+'\',\''+qid+'\')" type="checkbox" name="radio-p-'+fi1+fi2+'" id="f'+fi1+fi2+i+'"><label for="f'+fi1+fi2+i+'" class="cr"></label></div>'+arField[i]+'&nbsp;&nbsp;&nbsp;&nbsp;'+br;
        			}
        		}
    		}
    		return str;
        },
    	
        //单个提交答案
    	fsub: function (a,b,q,u){
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+u+'/edit',
			    	data: {EXID:this.EXID,QID:q,A:a,B:this.uncompileStr(b),tm:new Date().getTime()},
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                        }else if ("exception" == data.result){
                        	showException("答题:",data.exception);//显示异常
                        }
                    }
				}).done().fail(function(){
                   swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                });
    	},
        
    	//大题
    	subBig: function (event,fi1,fi2){
    		if("" != event.currentTarget.value){
    			$('#gf'+fi1+''+fi2).css("background-color","#80E000");
    		    this.fsub(event.currentTarget.value,'F',event.currentTarget.name,'bigquestionte');
    		    $('#igf'+fi1+''+fi2).val(1);
    		 }else{
    			 $('#gf'+fi1+''+fi2).css("background-color","white");
    			 $('#igf'+fi1+''+fi2).val(0);
    		 }
        },
    	
    	compileStr: function (code){
            var c=String.fromCharCode(code.charCodeAt(0)+code.length);  
            for(var i=1;i<code.length;i++){        
                c+=String.fromCharCode(code.charCodeAt(i)+code.charCodeAt(i-1));  
            }     
            return escape(c);
        },
        
        uncompileStr: function (code){
            code = unescape(code);        
            var c=String.fromCharCode(code.charCodeAt(0)-code.length);        
            for(var i=1;i<code.length;i++){        
                c+=String.fromCharCode(code.charCodeAt(i)-c.charCodeAt(i-1));        
            }        
            return c;
        },
        
      	//倒计时
    	timer: function (intDiff){
    		var fen = intDiff-1;
    		var miao = 60;
    		window.setInterval(function(){
	    		$('#timer').html('<b>'+fen+'</b> 分  '+'<b>'+miao+'</b> 秒');
	    		miao--;
	    		if(miao == 0){
	    			miao = 60;
	    			fen --;
	    			if(fen<0){
	    				swal("考试时间超时!", "此页面将会关闭!", "warning");
               			setTimeout(function(){
               				vm.closeWindow();//关闭页面
                        },3000);
	    			}else if(fen == 4){
	    				swal("还有最后5分钟!", "请抓紧时间作答", "warning");
	    			}
	    		}
    		}, 1000);
    	},
    	
    	//状态
    	intHtml: function (ilist){
    		var st = '<ul class="pagination justify-content-center" style="margin-bottom: -1px;">';
    		var en = '</ul>';
    		var str = '',fix = 1;
    		for(var i=0;i<ilist.length;i++){
    			for(var j=0;j<ilist[i].tqList.length;j++){
    				str += '<li class="page-item"><input type="hidden" name="finput" value="0" id="igf'+i+''+j+'" /><a href="#t'+i+''+j+'" class="page-link" style="width:42px;text-align:center;" id="gf'+i+''+j+'">'+fix+'</a></li>';
    				if(fix>4 && fix%5==0){
    					str += '</ul><ul class="pagination justify-content-center" style="margin-bottom: -1px;">';
    				}
    				fix ++;
    			} 
    		}
    		$('#fix').html(st+str+en);
        },
        
      	//提交试卷
        subTextPage: function () {
        	for(var i=0;i < document.getElementsByName('finput').length;i++){
  			  if(0 == document.getElementsByName('finput')[i].value){
  				$("#fix").tips({
      				side:3,
      				msg:'还有未答的题目（白色背景）!',
      	            bg:'#AE81FF',
      	            time:16
      	        });
  				swal("还有未答的题目!", "请完成作答再提交", "warning");
      			$("#"+document.getElementsByName('finput')[i].id).focus();
      			return false;
  			  }
  			}
    	   swal({
   			title: "确定要提交试卷吗?",
               text: "",
               icon: "warning",
               buttons: true,
               dangerMode: true,
           }).then((willDelete) => {
               if (willDelete) {
            	   if(vm.FACE){
            		    vm.creatQr();	//生成二维码
  						$("#rlsb").show();
             			vm.isok = true;
         			}else{
         				vm.goSubTextPage();
         			}
                   }
               });
        },
        
        //执行提交试卷
        goSubTextPage: function(){
        	$.ajax({
           		xhrFields: {
                       withCredentials: true
                   },
           		type: "POST",
           		url: httpurl+'examinationrecord/edit',
           		data: {EXAMINATIONRECORD_ID:this.EXID,DURATION:this.pd.DURATION,TESTPAPER_ID:this.pd.TESTPAPER_ID,tm:new Date().getTime()},
           		dataType:"json",
           		success: function(data){
           		 if("success" == data.result){
           			if('A' == vm.EVALUATIONRESULTS){//考完直接出成绩时
           				vm.getAch();	//获取本次考试的成绩
           			}else{
           				swal("提交成功", "请到（我的成绩）菜单查看结果，此页面将会关闭!", "success");
               			setTimeout(function(){
               				vm.closeWindow();//关闭页面
                        },1000);
           			}
           		 }else if ("fail" == data.result){
           			swal("提交失败!", "考试时间超时,此页面将会关闭!", "warning");
           			setTimeout(function(){
           				vm.closeWindow();//关闭页面
                    },1000);
                 }else if ("exception" == data.result){
                    	showException("提交试卷",data.exception);//显示异常
                 }
           		}
           	}).done().fail(function(){
                   swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
               });
        },
        
      	//获取本次考试的成绩
        getAch: function(){
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'achievement/goEdit',
        		data: {EXAMINATIONRECORD_ID:this.EXID,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			vm.SCORE = data.pd.SCORE;		//得分
        			vm.PASSONOT = data.pd.PASSONOT;	//是否及格
        			if(vm.FREPEAT && vm.FTWICE){	//当可以重复考试，并且允许补考时，才计算已经考试次数
        				vm.getCount();
        			}
        			vm.fend = true;
        		 }
        		}
        	})
        },
        
      	//获取本次考试的次数
        getCount: function(){
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'examinationrecord/getCount',
        		data: {TESTPAPER_ID:this.TESTPAPER_ID,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			vm.ZS = data.pd.ZS;		//已经考试次数
        		 }
        		}
        	})
        },
        
        //试题回看页面
        lookingBack:function (){
        	window.location.href = '../achievement/achievement_view.html?FID='+this.pd.TESTPAPER_ID+'&EXID='+this.EXID+'&PASSONOT='+this.PASSONOT+'&SCORE='+this.SCORE;
        },
        
    	//再考一次
    	onceAgain: function (){
    		$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'examinationrecord/add',
        		data: {TESTPAPER_ID:this.pd.TESTPAPER_ID,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 window.location.href = 'testpaper_exa.html?FID='+vm.pd.TESTPAPER_ID+'&EXID='+data.EXAMINATIONRECORD_ID;
        		 }else if ("exception" == data.result){
                 	showException("考试记录",data.exception);//显示异常
                 }
        		}
        	})
    	},
        
        //关闭本页面
        closeWindow:function (){
        	if (navigator.userAgent.indexOf('MSIE') > 0) {
       		   if (navigator.userAgent.indexOf('MSIE 6.0') > 0) {
       		      window.opener = null;
       		      window.close();
       		   } else {
       		      window.open('', '_top');
       		      window.top.close();
       		   }
       		} else {
       		   window.opener = null;
       		   window.open('', '_self');
       		   window.close();
       		}
        },
        
      	//获取当前用户用户名
        getUsername: function(){
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'user/getUsername',
        		data: {tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			vm.USERNAME = data.USERNAME;	//用户名
        			vm.creatQr();	//生成二维码
        		 }
        		}
        	})
        },
        
        //生成二维码
        creatQr: function(){
        	var base64_img = jrQrcode.getQrBase64(locat+'views/faceDiscern.html?U='+vm.USERNAME+'&T='+vm.times+'&P='+this.TESTPAPER_ID);
    		$('#fimg').attr('src',base64_img );
    		vm.updateFacestate();//当生成二维码时，把人脸识别状态改为no
        },
        
      	//更新识别状态
        updateFacestate: function (){
        	$.ajax({
    			xhrFields: {
                    withCredentials: true
                },
    			type: "POST",
    			url: httpurl+'head/updateFacestate',
    	    	data: {tm:new Date().getTime()},
    			dataType:'json',
    			success: function(data){
    				if("success" == data.result){
    					setTimeout(function(){
    						ftimer = setInterval(function() {
        		                vm.getFacestate();
        		            },1000);
       		            },10000);//10秒后开始执行，留这个时间去手机扫码
            		 }
    			}
    		});
        },
        
    	//获取识别状态
        getFacestate: function (){
        	$.ajax({
    			xhrFields: {
                    withCredentials: true
                },
    			type: "POST",
    			url: httpurl+'head/getFacestate',
    	    	data: {tm:new Date().getTime()},
    			dataType:'json',
    			success: function(data){
    				if("success" == data.result){
    					if(vm.times == 1){
    						swal("首次提交成功", "等待中途再次验证", "success");
    						vm.bsub = true;
    					}else{
    						if(vm.isok){
    							swal("认证通过", "", "success");
    							vm.goSubTextPage();
    						}else{
    							swal("认证通过", "请继续考试", "success");
    						}
    					}
    					$("#rlsb").hide();
    					clearInterval(ftimer);//停止获取识别状态
    					setTimeout(function(){
        					vm.creatQr();	//生成二维码
       						$("#rlsb").show();
       		            },vm.finterval);	//根据考试时间，中间再验证一次
        				vm.times ++;
           		 	}
    			}
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

//单选和判断选中
var hcid="fh";
function selection1(value,fa,qid,id2){
	$('#g'+id2).css("background-color","#80E000");
	vm.fsub(value,fa,qid,'smallquestionte');
	$('#ig'+id2).val(1);
}

//复选选中
function selection2(value,id,id2,fa,qid){
	var str = $('#FI'+id2).val();
	if($('#'+id).attr('checked')){
		str = str + value + ',fh,';
	}else{
		str = str.replace(value+',fh,','');
	}
	$('#FI'+id2).val(str);
	var arrANSWER = str.split(',fh,');
	var stra = (arrANSWER.sort());
	vm.fsub(stra.join(''),fa,qid,'smallquestionte');
	if("" == stra.join('')){
		$('#g'+id2).css("background-color","white");
		$('#ig'+id2).val(0);
	}else{
		$('#g'+id2).css("background-color","#80E000");
		$('#ig'+id2).val(1);
	}
}

//改变页面字体大小
function doZoom(size){
	document.getElementById('app').style.fontSize=size+'px';
}

//官网 www.1b23.com
