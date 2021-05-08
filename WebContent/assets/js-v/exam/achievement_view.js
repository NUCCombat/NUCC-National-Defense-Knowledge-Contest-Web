
var vm = new Vue({
	el: '#app',
	
	data:{
		TESTPAPER_ID: '',	//试卷ID
		EXID: '',			//作答ID
		PASSONOT:'',		//是否及格
		SCORE:'',			//得分
		pd: [],				//存放字段参数
		varList: [],		//试卷试题
		serverurl: '',
		fontSize: 14,		//页面字号
		fbar:false,			//是否显示柱状图
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
        		this.PASSONOT = this.getUrlKey('PASSONOT');
        		this.SCORE = this.getUrlKey('SCORE');
        		this.getData();
        		this.modalEffects();
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
				url: httpurl+'achievement/view',
		    	data: {TESTPAPER_ID:this.TESTPAPER_ID,EXAMINATIONRECORD_ID:this.EXID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                    	 vm.pd = data.pd;							//参数map
                    	 vm.varList = data.varList;					//试卷试题
                    	 vm.loading = false;
                     }else if ("exception" == data.result){
                     	showException("查看作答记录",data.exception);	//显示异常
                     }
                  }
			}).done().fail(function(){
                  swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                  $("#showform").show();
          		  $("#jiazai").hide();
             });
    	},
    	
    	//统计
    	statistics:function(QID,FNUM,TYPE,FRACTION){
    		$("#viewStatistics").click();
    		//发送 post 请求
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'achievement/statistics',
		    	data: {TESTPAPER_ID:this.TESTPAPER_ID,QUESTIONS_ID:QID,FNUM:FNUM,TYPE:TYPE,FRACTION:FRACTION,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                    	 $("#tjid").css("height","279px");
                    	 for(var n=25;n>0;n--){
                    		arrPData1.splice(n, 1);
                    		arrPData2.splice(n, 1);
                    		arrCData1.splice(n, 1);
                    		arrCData2.splice(n, 1);
                 		 }
                    	 arrPData1 = ["答对人数","答错人数"];
                    	 arrPData2[0] = {value: data.right, name: '答对人数'};
                    	 arrPData2[1] = {value: data.wrong, name: '答错人数'};
                    	 if(TYPE == 'D' || TYPE == 'E' || TYPE == 'F'){
                    		 vm.fbar = false;
                    		 arrPData1 = ["满分人数","零分人数","未满分人数"];
                    		 arrPData2[0] = {value: data.right, name: '满分人数'};
                        	 arrPData2[1] = {value: data.wrong, name: '零分人数'};
                    		 arrPData2[2] = {value: data.middle, name: '未满分人数'};
                    	 }
                    	 myPChart.setOption(optionP);
                    	 if(TYPE == 'A' || TYPE == 'B'){
                    		 $("#tjid").css("height","486px");
                    		 vm.fbar = true;
                    		 for(var i=0;i<FNUM;i++){
                    			arrCData1[i] = data.tlist[i];
                    			arrCData2[i] = {value: data.vlist[i], name: '人数'};
                    		 }
                    		 myCChart.setOption(optionC);
                    	 }
                    	 if(TYPE == 'C')vm.fbar = false;
                     }else if ("exception" == data.result){
                     	showException("统计",data.exception);	//显示异常
                     }
                  }
			}).done().fail(function(){
                  swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                  $("#showform").show();
          		  $("#jiazai").hide();
            });
    	},
    	
    	//收藏试题
    	collection:function(TITLE,QID,TYPE,CID){
    		//发送 post 请求
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'collection/add',
		    	data: {TITLE:TITLE,QUESTIONS_ID:QID,TYPE:TYPE,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                    	 $("#"+CID).tips({
               				side:3,
               				msg:'收藏成功',
               	            bg:'#AE81FF',
               	            time:2
               	        });
                     }else if ("exception" == data.result){
                     	showException("收藏试题",data.exception);	//显示异常
                     }
                  }
			}).done().fail(function(){
                  swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                  $("#showform").show();
          		  $("#jiazai").hide();
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
        
		//初始查看统计窗口事件
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

var myPChart = echarts.init(document.getElementById('main'));
var myCChart = echarts.init(document.getElementById('main2'));

var arrPData1 = [];
var arrPData2 = [];
optionP = {
	    title: {
	        text: '',
	        subtext: '答案正确和错误的比例',
	        left: 'center'
	    },
	    tooltip: {
	        trigger: 'item',
	        formatter: '{a} <br/>{b} : {c} ({d}%)'
	    },
	    legend: {
	        orient: 'vertical',
	        left: 'left',
	        data: arrPData1
	    },
	    series: [
	        {
	            name: '统计结果',
	            type: 'pie',
	            radius: '55%',
	            center: ['50%', '60%'],
	            data: arrPData2,
	            emphasis: {
	                itemStyle: {
	                    shadowBlur: 10,
	                    shadowOffsetX: 0,
	                    shadowColor: 'rgba(0, 0, 0, 0.5)'
	                }
	            }
	        }
	    ]
	};

var arrCData1 = [];
var arrCData2 = [];
optionC = {
		title: {
	        text: '',
	        subtext: '各选项选择的人数',
	        left: 'center'
	    },
	    color: ['#3398DB'],
	    tooltip: {
	        trigger: 'axis',
	        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
	            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	        }
	    },
	    grid: {
	        left: '3%',
	        right: '4%',
	        bottom: '3%',
	        containLabel: true
	    },
	    xAxis: [
	        {
	            type: 'category',
	            data: arrCData1,
	            axisTick: {
	                alignWithLabel: true
	            }
	        }
	    ],
	    yAxis: [
	        {
	            type: 'value'
	        }
	    ],
	    series: [
	        {
	            name: '人数',
	            type: 'bar',
	            barWidth: '60%',
	            data: arrCData2,
	            itemStyle:{
	                normal:{
	                	color:function(d){return "#"+Math.floor(Math.random()*(256*256*256-1)).toString(16);}
	                }
	            },
	        }
	    ]
	};

