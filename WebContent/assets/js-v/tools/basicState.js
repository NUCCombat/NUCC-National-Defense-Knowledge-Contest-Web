
var vm = new Vue({
	el: '#app',
	
	data:{
		pd: [],					//存放参数
		loading:true			//加载状态
    },
	
	methods: {
		
        //初始执行
        init() {
        	this.getData();
        },
    	
    	//获取常量数据
    	getData: function(){
    		//发送 post 请求
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'serverRunstate/getData',
		    	data: {tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;										//参数map
                     	option.series[3].max = data.pd.totalDiskSize;			//硬盘总大小
                    	option.series[3].data[0].value = data.pd.useDiskSize;	//硬盘已使用大小
                     }else if ("exception" == data.result){
                    	 swal("获取失败!", "请把sigar-xxx-winnt库文件放到JDK的bin目录,然后重启", "warning");
                    	 clearInterval(interval);//停止
                     }
                  }
			}).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                setTimeout(function () {
                	window.location.href = "../../login.html";
                }, 2000);
            });
    	},
    	
    	//获取实时数据(cpu内存等)
    	getRealTimeData: function(){
    		//发送 post 请求
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'serverRunstate/realTimeData',
		    	data: {tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
					 vm.loading = false	;
                     if("success" == data.result){
                    	 option.series[0].data[0].value = data.pd.cpuuse;			//CPU使用率
                    	 option.series[1].max = data.pd.totalJvmMemory;				//JVM总内存空间
                    	 option.series[1].data[0].value = data.pd.useJvmMemory;		//JVM已使用的内存
                    	 option.series[2].max = data.pd.totalServerMemory;			//服务器总内存空间
                    	 option.series[2].data[0].value = data.pd.useServerMemory;	//服务器已使用的内存
                    	 myChart.setOption(option, true);
                     }
                  }
			})
    	}
    	
	},
	
	mounted(){
        this.init();
    }
})

//仪表盘
var myChart = echarts.init(document.getElementById('main'));
var interval = setInterval(function () {
	vm.getRealTimeData();
},1000);

option = {
	    backgroundColor: '#1b1b1b',
	    tooltip: {
	        formatter: '{a} <br/>{c} {b}'
	    },
	    toolbox: {
	        show: true,
	        feature: {
	            mark: {show: true},
	            restore: {show: true},
	            saveAsImage: {show: true}
	        }
	    },
	    series: [
	        {
	            name: 'CPU',
	            type: 'gauge',
	            min: 0,
	            max: 100,
	            radius: '88%',
	            startAngle: 269,
	            endAngle: -86,
	            axisLine: {            // 坐标轴线
	                lineStyle: {       // 属性lineStyle控制线条样式
	                    color: [[0.09, 'lime'], [0.82, '#1e90ff'], [1, '#ff4500']],
	                    width: 3,
	                    shadowColor: '#fff', //默认透明
	                    shadowBlur: 10
	                }
	            },
	            axisLabel: {            	// 坐标轴小标记
	                fontWeight: 'bolder',
	                color: '#fff',
	                shadowColor: '#fff', 	//默认透明
	                shadowBlur: 10
	            },
	            axisTick: {            // 坐标轴小标记
	                length: 15,        // 属性length控制线长
	                lineStyle: {       // 属性lineStyle控制线条样式
	                    color: 'auto',
	                    shadowColor: '#fff', //默认透明
	                    shadowBlur: 10
	                }
	            },
	            splitLine: {           	// 分隔线
	                length: 25,         // 属性length控制线长
	                lineStyle: {       	// 属性lineStyle（详见lineStyle）控制线条样式
	                    width: 3,
	                    color: '#fff',
	                    shadowColor: '#fff', //默认透明
	                    shadowBlur: 10
	                }
	            },
	            pointer: {           		// 分隔线
	                shadowColor: '#fff', 	//默认透明
	                shadowBlur: 5
	            },
	            title: {
	                textStyle: {       		// 其余属性默认使用全局文本样式，详见TEXTSTYLE
	                    fontWeight: 'bolder',
	                    fontSize: 22,
	                    fontStyle: 'italic',
	                    color: '#fff',
	                    shadowColor: '#fff', //默认透明
	                    shadowBlur: 10
	                }
	            },
	            detail: {
	                backgroundColor: 'rgba(30,144,255,0.8)',
	                borderWidth: 1,
	                borderColor: '#fff',
	                shadowColor: '#fff', 			//默认透明
	                shadowBlur: 5,
	                formatter: '{value} %',
	                offsetCenter: [0, '50%'],       // x, y，单位px
	                textStyle: {       				// 其余属性默认使用全局文本样式，详见TEXTSTYLE
	                    fontWeight: 'bolder',
	                    color: '#fff'
	                }
	            },
	            data: [{value: 40, name: 'CPU使用率'}]
	        },
	        {
	            name: '已用',
	            type: 'gauge',
	            center: ['19%', '55%'],    		// 默认全局居中
	            radius: '76%',
	            min: 0,
	            max: 0,
	            startAngle: 269,
	            endAngle: 45,
	            axisLine: {            			// 坐标轴线
	                lineStyle: {       			// 属性lineStyle控制线条样式
	                    color: [[0.29, 'lime'], [0.86, '#1e90ff'], [1, '#ff4500']],
	                    width: 2,
	                    shadowColor: '#fff', 	//默认透明
	                    shadowBlur: 10
	                }
	            },
	            axisLabel: {            	// 坐标轴小标记
	                fontWeight: 'bolder',
	                color: '#fff',
	                shadowColor: '#fff', 	//默认透明
	                shadowBlur: 10
	            },
	            axisTick: {            // 坐标轴小标记
	                length: 12,        // 属性length控制线长
	                lineStyle: {       // 属性lineStyle控制线条样式
	                    color: 'auto',
	                    shadowColor: '#fff', //默认透明
	                    shadowBlur: 10
	                }
	            },
	            splitLine: {           	// 分隔线
	                length: 20,         // 属性length控制线长
	                lineStyle: {       	// 属性lineStyle（详见lineStyle）控制线条样式
	                    width: 3,
	                    color: '#fff',
	                    shadowColor: '#fff', //默认透明
	                    shadowBlur: 10
	                }
	            },
	            pointer: {
	                width: 5,
	                shadowColor: '#fff', //默认透明
	                shadowBlur: 5
	            },
	            title: {
	                offsetCenter: [0, '-30%'],       	// x, y，单位px
	                textStyle: {       					// 其余属性默认使用全局文本样式，详见TEXTSTYLE
	                    fontWeight: 'bolder',
	                    fontStyle: 'italic',
	                    color: '#fff',
	                    shadowColor: '#fff',			//默认透明
	                    shadowBlur: 10
	                }
	            },
	            detail: {
	                //backgroundColor: 'rgba(30,144,255,0.8)',
	                // borderWidth: 1,
	                borderColor: '#fff',
	                shadowColor: '#fff', //默认透明
	                shadowBlur: 5,
	                width: 80,
	                height: 30,
	                formatter: '{value} MB',
	                offsetCenter: [5, '20%'],       // x, y，单位px
	                textStyle: {       				// 其余属性默认使用全局文本样式，详见TEXTSTYLE
	                    fontWeight: 'bolder',
	                    color: '#fff'
	                }
	            },
	            data: [{value: 1.5, name: 'JVM内存'}]
	        },
	        {
	            name: '已用',
	            type: 'gauge',
	            center: ['83%', '55%'],    // 默认全局居中
	            radius: '89%',
	            min: 0,
	            max: 0,
	            startAngle: 135,
	            endAngle: 45,
	            splitNumber: 5,
	            axisLine: {            // 坐标轴线
	                lineStyle: {       // 属性lineStyle控制线条样式
	                    color: [[0.2, 'lime'], [0.8, '#1e90ff'], [1, '#ff4500']],
	                    width: 2,
	                    shadowColor: '#fff', //默认透明
	                    shadowBlur: 10
	                }
	            },
	            axisTick: {            // 坐标轴小标记
	                length: 12,        // 属性length控制线长
	                lineStyle: {       // 属性lineStyle控制线条样式
	                    color: 'auto',
	                    shadowColor: '#fff', //默认透明
	                    shadowBlur: 10
	                }
	            },
	            axisLabel: {
	                fontWeight: 'bolder',
	                color: '#fff',
	                shadowColor: '#fff', //默认透明
	                shadowBlur: 10
	            },
	            splitLine: {           // 分隔线
	                length:15,         // 属性length控制线长
	                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
	                    width:3,
	                    color: '#fff',
	                    shadowColor: '#fff', //默认透明
	                    shadowBlur: 10
	                }
	            },
	            pointer: {
	                width:2,
	                shadowColor: '#fff', 				//默认透明
	                shadowBlur: 5
	            },
	            title: {
	                offsetCenter: [26, '-50%'],       	// x, y，单位px
	                textStyle: {       					// 其余属性默认使用全局文本样式，详见TEXTSTYLE
	                    fontWeight: 'bolder',
	                    fontStyle: 'italic',
	                    color: '#fff',
	                    shadowColor: '#fff', //默认透明
	                    shadowBlur: 10
	                }
	            },
	            detail: {
	                borderColor: '#fff',
	                shadowColor: '#fff',	 //默认透明
	                shadowBlur: 5,
	                width: 80,
	                height: 30,
	                offsetCenter: [19, '-50%'],       	// x, y，单位px
	                textStyle: {       					// 其余属性默认使用全局文本样式，详见TEXTSTYLE
	                    fontWeight: 'bolder',
	                    color: '#fff'
	                }
	            },
	            data: [{value: 0, name: '已用内存                    GB (服务器)'}]
	        },
	        {
	            name: '硬盘',
	            type: 'gauge',
	            center: ['81%', '66%'],    // 默认全局居中
	            radius: '66%',
	            min: 0,
	            max: 100,
	            startAngle: 400,
	            endAngle: 320,
	            splitNumber: 5,
	            axisLine: {            		// 坐标轴线
	                lineStyle: {       		// 属性lineStyle控制线条样式
	                    color: [[0.2, 'lime'], [0.8, '#1e90ff'], [1, '#ff4500']],
	                    width: 10,
	                    shadowColor: '#fff', //默认透明
	                    shadowBlur: 10
	                }
	            },
	            axisTick: {            		// 坐标轴小标记
	                show: false
	            },
	            axisLabel: {
	                fontWeight: 'bolder',
	                color: '#fff',
	                shadowColor: '#fff', //默认透明
	                shadowBlur: 10
	            },
	            splitLine: {           // 分隔线
	                length: 15,        // 属性length控制线长
	                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
	                    width: 3,
	                    color: '#fff',
	                    shadowColor: '#fff', //默认透明
	                    shadowBlur: 10
	                }
	            },
	            pointer: {
	                width: 2,
	                shadowColor: '#fff', 	//默认透明
	                shadowBlur: 5
	            },
	            title: {
	                offsetCenter: [-5, '41%'],       	// x, y，单位px
	                textStyle: {       					// 其余属性默认使用全局文本样式，详见TEXTSTYLE
	                    fontStyle: 'italic',
	                    color: '#fff',
	                    shadowColor: '#fff', 			//默认透明
	                    shadowBlur: 10
	                }
	            },
	            detail: {
	                borderColor: '#fff',
	                shadowColor: '#fff', 				//默认透明
	                shadowBlur: 5,
	                width: 80,
	                height: 30,
	                formatter: '{value} GB',
	                offsetCenter: [10, '25%'],       	// x, y，单位px
	                textStyle: {       					// 其余属性默认使用全局文本样式，详见TEXTSTYLE
	                    
	                    color: '#fff'
	                }
	            },
	            data:[{value: 0, name: '已用硬盘 '}]
	        }
	    ]
	};


//fh a dmin QQ 31 3596790