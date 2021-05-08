
var vm = new Vue({
	el: '#app',
	
	data:{
		PARENT_ID: '',	//上级ID
		pd: []			//存放字段参数
    },
	
	methods: {
		
        //初始执行
        init() {
        	var P_ID = this.getUrlKey('PARENT_ID');//链接参数
        	this.PARENT_ID = P_ID;
        },
        
        //去保存
    	save: function (){
			if(this.pd.NAME == '' | this.pd.NAME == undefined){
				$("#NAME").tips({
					side:3,
		            msg:'请输入名称',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.NAME = '';
				this.$refs.NAME.focus();
				return false;
			}
			if(this.pd.REMARKS == '' || this.pd.REMARKS == undefined){
				$("#REMARKS").tips({
					side:3,
		            msg:'请输入备注说明',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.REMARKS = '';
				this.$refs.REMARKS.focus();
			return false;
			}
    		$("#showform").hide();
    		$("#jiazai").show();
    		vm.addFolder();
    	},
    	
    	//添加目录
    	addFolder: function (){
    		 //发送 post 请求提交保存
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'picture/add',
			    	data: {
			    	PARENT_ID:this.PARENT_ID,
			    	NAME:this.pd.NAME,
				    REMARKS:this.pd.REMARKS,
			    	tm:new Date().getTime()},
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                        	$("#fok").tips({
                				side:2,
                	            msg:'目录创建成功',
                	            bg:'#AE81FF',
                	            time:2
                	        });
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },600);
                        }else if ("exception" == data.result){
                        	alert("图片管理"+data.exception);//显示异常
                        	$("#showform").show();
                    		$("#jiazai").hide();
                        }
                    }
				}).done().fail(function(){
				   alert("登录失效! 请求服务器无响应，稍后再试");
                   $("#showform").show();
           		   $("#jiazai").hide();
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