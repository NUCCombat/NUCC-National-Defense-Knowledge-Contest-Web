
var vm = new Vue({
	el: '#app',
	
	data:{
		pd: [],					//存放参数
		vrxspeed: 0.00,
		vtxspeed: 0.00,
		loading:true			//加载状态
    },
	
	methods: {
		
        //初始执行
        init() {
        },
    	
    	//获取实时获取网速
    	getNetworkspeed: function(){
    		//发送 post 请求
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'serverRunstate/networkspeed',
		    	data: {tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
					 vm.loading = false;
                     if("success" == data.result){
                    	 vm.vrxspeed = data.pd.rxspeed;
                    	 vm.vtxspeed = data.pd.txspeed;
                    	if(vm.vrxspeed > 1024){
                    		vm.vrxspeed = (vm.vrxspeed/1024.00).toFixed(2) + ' MB/s';
                    	}else{
                    		vm.vrxspeed = vm.vrxspeed + ' KB/s';
                    	}
                    	if(vm.vtxspeed > 1024){
                    		vm.vtxspeed = (vm.vtxspeed/1024.00).toFixed(2) + ' MB/s';
                    	}else{
                    		vm.vtxspeed = vm.vtxspeed + ' KB/s';
                    	}
                    	 var rxspeed = data.pd.rxspeed;
                    	 var txspeed = data.pd.txspeed;
                    	 var rx1;
                    	 var rx2 = rxspeed;
                    	 for(var n=99; n>0; n--){
                    		rx1 = data1[n];
                    	 	data1[n] = rx2;
                    		rx2 = rx1;
                    	 }
                    	 var tx1;
                    	 var tx2 = txspeed*-1;
                    	 for(var m=99; m>0; m--){
                    		tx1 = data2[m];
                     	 	data2[m] = tx2;
                     	 	tx2 = tx1;
                     	 }
                    	 netChart.setOption(netoption, true);
                     }else if ("exception" == data.result){
                    	 swal("获取失败!", "请把sigar-xxx-winnt库文件放到JDK的bin目录,然后重启", "warning");
                    	 clearInterval(interval);//停止
                     }
                  }
			})
    	}
    	
	},
	
	mounted(){
        this.init();
    }
})

var xAxisData = [];
var data1 = [];
var data2 = [];
for (var i = 0; i < 100; i++) {
    xAxisData.push('kb/s');
    data1.push(0);
    data2.push(0);
}

netoption = {
	
    title: {
        text: '网络收发数据包(KB)'
    },
    legend: {
        data: ['接收数据包', '发送数据包']
    },
    toolbox: {
        // y: 'bottom',
        feature: {
            magicType: {
                type: ['stack', 'tiled']
            },
            dataView: {},
            saveAsImage: {
                pixelRatio: 2
            }
        }
    },
    tooltip: {},
    xAxis: {
        data: xAxisData,
        splitLine: {
            show: false
        }
    },
    yAxis: {
    },
    series: [{
        name: '接收数据包',
        type: 'bar',
        data: data1,
        animationDelay: function (idx) {
            return idx;
        }
    }, {
        name: '发送数据包',
        type: 'bar',
        data: data2,
        animationDelay: function (idx) {
            return idx;
        }
    }],
    animationEasing: 'elasticOut',
    animationDelayUpdate: function (idx) {
        return idx;
    }
};

var netChart = echarts.init(document.getElementById('netspeed'));
netChart.setOption(netoption, true);

var interval = setInterval(function () {
	vm.getNetworkspeed();
},100);


//fh a dmin QQ 31 3596790