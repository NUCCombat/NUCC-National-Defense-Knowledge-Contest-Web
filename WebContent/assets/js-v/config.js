 
 //服务器host
 var httpurl = 'http://127.0.0.1:8081/';	 //本地测试用此地址
 //var httpurl = 'http://192.168.0.5:8081/'; //部署生产环境, 地址为后台程序所在服务器的实际地址，ip 或者域名
 
 //显示异常
 function showException(modular,exception){
	 swal("["+modular+"]程序异常!", "抱歉！您访问的页面出现异常，请稍后重试或联系管理员 "+exception, "warning");
 }