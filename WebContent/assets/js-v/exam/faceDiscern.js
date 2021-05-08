
var obUrl = '';
var vm = new Vue({
	el: '#app',
	
	data:{
		USERNAME: '',		//用户名
		TESTPAPER_ID:'',	//试卷ID
		times:1,			//当前验证次数
		FACE: true,			//人脸识别
    },
	
	methods: {
		
        //初始执行
        init() {
        	var FU = this.getUrlKey('U');
        	var ft = this.getUrlKey('T');
        	var fp = this.getUrlKey('P');
        	if(null != FU){
        		this.USERNAME = FU;
        		this.times = ft;
        		this.TESTPAPER_ID = fp;
        	}
        },
    	
    	//验证
        faceRecognition: function (){
        	if ('' == $("#file").val()) {
        		swal("没拍照呢!", "", "warning");
        		$("#logox").empty();
				$('#logox').append('<img id="bgl" src="../plugins/photo/images/logo_n.png">');
        		$("#rlsb").show();
				return;
			}else{
				vm.facerecord();//添加验证记录
        		$.ajax({
        			xhrFields: {
                        withCredentials: true
                    },
        			type: "POST",
        			url: httpurl+'head/faceRecognition',
        	    	data: {PHOTODATA:obUrl,times:this.times,USERNAME:this.USERNAME,tm:new Date().getTime()},
        			dataType:'json',
        			success: function(data){
        				obUrl = '';
        				$("#file").val('')
        				$("#rlsb").hide();
        				if("success" == data.result){
        					$("#logox").empty();
        					$('#logox').append('<img id="bgl" src="../plugins/photo/images/logo_n.png">');
        					if(vm.times == 1){
        						swal("首次提交成功", "", "success");
        					}else{
        						swal("认证通过", "", "success");
        					}
        					$("#rlsb").hide();
        					setTimeout(function(){
        						window.opener=null;
            					window.open('','_self');
            					window.close();
           		            },5000);
        				}else{
        					swal("人脸识别验证失败!", "请重新认证或者退出系统", "warning");
        					$("#rlsb").show();
        				}
        			}
        		});
        	}
        },
        
    	//添加验证记录
        facerecord: function (){
        	$.ajax({
    			xhrFields: {
                    withCredentials: true
                },
    			type: "POST",
    			url: httpurl+'facerecord/add',
    	    	data: {PHOTO:obUrl,TESTPAPER_ID:this.TESTPAPER_ID,tm:new Date().getTime()},
    			dataType:'json',
    			success: function(data){}
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

//人脸认证
$("#clipArea").photoClip({
	width: 200,
	height: 200,
	file: "#file",
	view: "#view",
	ok: "#clipBtn",
	loadStart: function() {
		//console.log("照片读取中");
	},
	loadComplete: function() {
		//console.log("照片读取完成");
	},
	clipFinish: function(dataURL) {
		//console.log(dataURL);
		obUrl = dataURL;
	}
});
$(function(){
	$("#logox").click(function(){
		$(".htmleaf-container").show();
		$("#file").click();
		
	});
	$("#clipBtn").click(function(){
		$("#logox").empty();
		$('#logox').append('<img src="' + imgsource + '" align="absmiddle">');
		$(".htmleaf-container").hide();
		vm.faceRecognition();
	});
});
//取消
function quxiao(){
	$(".htmleaf-container").hide();
}