
var vm = new Vue({
	el: '#app',
	
	data:{
		varList: [],	//list
		page: [],		//分页类
		KEYWORDS:'',	//检索条件,关键词
		PAPERTYPE: '',	//试卷类型
		NTIME:0,		//当前日期
		STATE: 'release',	//状态
		showCount: -1,	//每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
		currentPage: 1,	//当前页码
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
        		url: httpurl+'testpaper/my?showCount='+this.showCount+'&currentPage='+this.currentPage,
        		data: {KEYWORDS:this.KEYWORDS,PAPERTYPE:this.PAPERTYPE,STATE:this.STATE,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.varList = data.varList;
        			 vm.page = data.page;
        			 vm.loading = false;
        			 $("input[name='ids']").attr("checked", false);
        		 }else if ("exception" == data.result){
                 	showException("试卷列表(参加考试)",data.exception);//显示异常
                 }
        		}
        	}).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                setTimeout(function () {
                	window.location.href = "../../login.html";
                }, 2000);
            });
        },
        
    	//参加考试
    	goExa: function (id,FREPEAT,FTWICE,findex,ISALONE ){
    		var text = "";
    		if('false' == FREPEAT){
    			text = "本次考试您只有一次机会，请认真作答!";
    		}
    		swal({
    			title: "确定要参加考试吗?",
                text: text,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
            		$.ajax({
                		xhrFields: {
                            withCredentials: true
                        },
                		type: "POST",
                		url: httpurl+'examinationrecord/add',
                		data: {TESTPAPER_ID:id,tm:new Date().getTime()},
                		dataType:"json",
                		success: function(data){
                		 if("success" == data.result){
                			 if('true' == FREPEAT && 'true' == FTWICE){
                	    		$("#"+findex).html("请先刷新页面");
                	    	 }
                			 if(ISALONE == 'true'){
                				 window.open('../../exam/testpaper/testpaper_exa_alone.html?FID='+id+'&EXID='+data.EXAMINATIONRECORD_ID);
                			 }else{
                				window.open('../../exam/testpaper/testpaper_exa.html?FID='+id+'&EXID='+data.EXAMINATIONRECORD_ID); 
                			 }
                			 vm.getList();
                		 }else if ("exception" == data.result){
                         	showException("考试记录",data.exception);//显示异常
                         }
                		}
                	}).done().fail(function(){
                        swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                        setTimeout(function () {
                        	window.location.href = "../../login.html";
                        }, 2000);
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
