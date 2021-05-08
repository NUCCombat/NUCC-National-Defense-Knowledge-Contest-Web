
var vm = new Vue({
	el: '#app',
	
	data:{
		varList: [],	//list
		queList: [],	//预览试题列表
		USERANSWER:'',	//你的答案
		page: [],		//分页类
		KEYWORDS:'',	//检索条件,关键词
		serverurl: '',	//后台地址
		showCount: -1,	//每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
		currentPage: 1,	//当前页码
		loading:false	//加载状态
    },
    
	methods: {
		
        //初始执行
        init() {
        	this.serverurl = httpurl;
    		this.getList();
    		this.modalEffects();
        },
        
        //获取列表
        getList: function(){
        	this.loading = true;
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'smallquestionfo/list?showCount='+this.showCount+'&currentPage='+this.currentPage,
        		data: {KEYWORDS:this.KEYWORDS,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.varList = data.varList;
        			 vm.page = data.page;
        			 vm.loading = false;
        		 }else if ("exception" == data.result){
                 	showException("错题表(小题)",data.exception);//显示异常
                 }
        		}
        	}).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                setTimeout(function () {
                	window.location.href = "../../login.html";
                }, 2000);
            });
        },
        
      	//查看题目
        viewQue: function (T,SELECTEDTOPICS,USERANSWER) {
        	$("#viewquetion").click();
        	this.USERANSWER = USERANSWER;
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