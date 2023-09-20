// 获取风险地区的数据
(function () { // 立即执行函数
        $.ajax({
                url: "/get_risk_info",
                success: function (data) { // data即为成功传送后的json数据
                        console.log(data);
                        var update_time = data.update_time;
                        var details = data.details;
                        var risk = data.risk;
                        var risk_num = data.risk_num;
                        $('.ts').html('截止至：' + update_time);
                        $('.risk_num').html('高风险：' + data.risk_num['high_num']+'\t\t低风险：' + data.risk_num['low_num']);
                        var s = "";
                        for (var i in details) {
                                if (risk[i] == "高风险") {
                                        s += "<li><span class='high_risk'>高风险\t\t</span>" + details[i] + "</li>"
                                } else {
                                        s += "<li><span class='middle_risk'>低风险\t\t</span>" + details[i] + "</li>"
                                }
                        }
                        // 将s的内容写入到ul中
                        $('#risk_wrapper_li1 ul').html(s);
                        start_roll(); // 执行滚动
                }
        })
})();

// 各省现存确诊Top5
(function () {
    $.ajax({
        url: "/get_top5",  // 向接口地址发出请求
        success: function (charts) {
            // 实例化对象，注意 .bar1 .chart 意思是找到bar1类别下面的chart类别所代表的标签
            var myChart = echarts.init(document.querySelector('.bar2 .chart'))
            // 指定配置项和数据
            var option;
            var top10CityList = charts.cityList
            var top10CityData = charts.cityData
            var color = ['#ff9500', '#02d8f9', '#027fff']
            var color1 = ['#ffb349', '#70e9fc', '#4aa4ff']

            let lineY = []
            let lineT = []
            for (var i=0; i < charts.cityList.length; i++) {
                var x = i
                if (x > 1) {
                    x = 2
                }
                var data = {
                    name: charts.cityList[i],
                    color: color[x],
                    value: top10CityData[i],
                    barGap: '-100%',
                    itemStyle: {
                        normal: {
                            show: true,
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                offset: 0,
                                color: color[x]
                            }, {
                                offset: 1,
                                color: color1[x]
                            }], false),
                            barBorderRadius: 10
                        },
                        emphasis: {
                            shadowBlur: 15,
                            shadowColor: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                }
                var data1 = {
                    value: top10CityData[0],
                    itemStyle: {
                        color: '#001235',
                        barBorderRadius: 10
                    }
                }
                lineY.push(data)
                lineT.push(data1)
            }

            option = {
                // backgroundColor: '#244f97',
                title: {
                    show: false
                },
                tooltip: {
                    trigger: 'item',
                    formatter: (p) => {
                        if (p.seriesName === 'total') {
                            return ''
                        }
                        return `${p.name}<br/>${p.value}`
                    }
                },
                grid: {
                    borderWidth: 0,
                    top: '10%',
                    left: '5%',
                    right: '15%',
                    bottom: '3%'
                },
                color: color,
                yAxis: [{
                    type: 'category',
                    inverse: true,
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        show: false,
                        inside: false
                    },
                    data: top10CityList
                }, {
                    type: 'category',
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: true,
                        inside: false,
                        verticalAlign: 'bottom',
                        lineHeight: '14',
                        textStyle: {
                            color: '#b3ccf8',
                            fontSize: '14',
                            fontFamily: 'PingFangSC-Regular'
                        },
                        formatter: function(val) {
                            return `${val}`
                        }
                    },
                    splitArea: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    data: top10CityData.reverse()
                }],
                xAxis: {
                    type: 'value',
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    }
                },
                series: [{
                    name: 'total',
                    type: 'bar',
                    zlevel: 1,
                    barGap: '-100%',
                    barWidth: '10px',
                    data: lineT,
                    legendHoverLink: false
                }, {
                    name: 'bar',
                    type: 'bar',
                    zlevel: 2,
                    barWidth: '10px',
                    data: lineY,
                    label: {
                        normal: {
                            color: '#b3ccf8',
                            show: true,
                            position: [0, '-24px'],
                            textStyle: {
                                fontSize: 16
                            },
                            formatter: function(a) {
                                let num = ''
                                let str = ''
                                if (a.dataIndex + 1 < 10) {
                                    num = '0' + (a.dataIndex + 1);
                                } else {
                                    num = (a.dataIndex + 1);
                                }
                                if (a.dataIndex === 0) {
                                    str = `{color1|${num}} {color4|${a.name}}`
                                } else if (a.dataIndex === 1) {
                                    str = `{color2|${num}} {color4|${a.name}}`
                                } else {
                                    str = `{color3|${num}} {color4|${a.name}}`
                                }
                                return str;
                            },
                            rich: {
                                color1: {
                                    color: '#ff9500',
                                    fontWeight: 700
                                },
                                color2: {
                                    color: '#02d8f9',
                                    fontWeight: 700
                                },
                                color3: {
                                    color: '#027fff',
                                    fontWeight: 700
                                },
                                color4: {
                                    color: '#e5eaff'
                                }
                            }
                        }
                    }
                }],
            }
            // 加载配置项
            myChart.setOption(option);
            // 让图表跟随屏幕自动地去适应
            window.addEventListener("resize", function() {
            myChart.resize();
            });
        }
    })
})();

// 死亡及治愈趋势
(function () {
    $.ajax({
        url: "/get_heal_dead",  // 向接口地址发出请求
        success: function (data) {
            // 实例化对象，注意 .bar1 .chart 意思是找到bar1类别下面的chart类别所代表的标签
            var myChart = echarts.init(document.querySelector('.line1 .chart'))

            // 设定默认新增趋势的按钮
            $('.line1 h2 a:eq(0)').css({'color':'#B94FFF'})

            // 指定配置项和数据
            var option;
            option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0,
                                color: 'rgba(0, 255, 233,0)'
                            }, {
                                offset: 0.5,
                                color: 'rgba(255, 255, 255,1)',
                            }, {
                                offset: 1,
                                color: 'rgba(0, 255, 233,0)'
                            }],
                            global: false
                        }
                    },
                },
            },
            grid: {
                top: '15%',
                left: '5%',
                right: '5%',
                bottom: '15%',
                // containLabel: true
            },
            xAxis: [{
                type: 'category',
                axisLine: {
                    show: true
                },
                splitArea: {
                    // show: true,
                    color: '#f00',
                    lineStyle: {
                        color: '#f00'
                    },
                },
                axisLabel: {
                    color: '#fff'
                },
                splitLine: {
                    show: false
                },
                boundaryGap: false,
                data: data.dateList,
            }],

            yAxis: [{
                type: 'value',
                min: 0,
                // max: 140,
                splitNumber: 4,
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(255,255,255,0.1)'
                    }
                },
                axisLine: {
                    show: false,
                },
                axisLabel: {
                    show: false,
                    margin: 20,
                    textStyle: {
                        color: '#d1e6eb',

                    },
                },
                axisTick: {
                    show: false,
                },
            }],
            series: [{
                    name: '新增治愈',
                    type: 'line',
                    // smooth: true, //是否平滑
                    showAllSymbol: true,
                    // symbol: 'image://./static/images/guang-circle.png',
                    symbol: 'circle',
                    symbolSize: 15,
                    lineStyle: {
                        normal: {
                            color: "#6c50f3",
                            shadowColor: 'rgba(0, 0, 0, .3)',
                            shadowBlur: 0,
                            shadowOffsetY: 5,
                            shadowOffsetX: 5,
                        },
                    },
                    label: {
                        show: true,
                        position: 'top',
                        textStyle: {
                            color: '#6c50f3',
                        }
                    },
                    itemStyle: {
                        color: "#6c50f3",
                        borderColor: "#fff",
                        borderWidth: 3,
                        shadowColor: 'rgba(0, 0, 0, .3)',
                        shadowBlur: 0,
                        shadowOffsetY: 2,
                        shadowOffsetX: 2,
                    },
                    tooltip: {
                        show: false
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgba(108,80,243,0.3)'
                                },
                                {
                                    offset: 1,
                                    color: 'rgba(108,80,243,0)'
                                }
                            ], false),
                            shadowColor: 'rgba(108,80,243, 0.9)',
                            shadowBlur: 20
                        }
                    },
                    data: data.addData.healAdd,
                },
                {
                    name: '新增死亡',
                    type: 'line',
                    // smooth: true, //是否平滑
                    showAllSymbol: true,
                    // symbol: 'image://./static/images/guang-circle.png',
                    symbol: 'circle',
                    symbolSize: 15,
                    lineStyle: {
                        normal: {
                            color: "#00ca95",
                            shadowColor: 'rgba(0, 0, 0, .3)',
                            shadowBlur: 0,
                            shadowOffsetY: 5,
                            shadowOffsetX: 5,
                        },
                    },
                    label: {
                        show: true,
                        position: 'top',
                        textStyle: {
                            color: '#00ca95',
                        }
                    },

                    itemStyle: {
                        color: "#00ca95",
                        borderColor: "#fff",
                        borderWidth: 3,
                        shadowColor: 'rgba(0, 0, 0, .3)',
                        shadowBlur: 0,
                        shadowOffsetY: 2,
                        shadowOffsetX: 2,
                    },
                    tooltip: {
                        show: false
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgba(0,202,149,0.3)'
                                },
                                {
                                    offset: 1,
                                    color: 'rgba(0,202,149,0)'
                                }
                            ], false),
                            shadowColor: 'rgba(0,202,149, 0.9)',
                            shadowBlur: 20
                        }
                    },
                    data: data.addData.deadAdd,
                },
            ]
        };
            // 加载配置项
            myChart.setOption(option);

            // 为两个a标签设置一个点击事件 完成排它属性的设置
            $('.line1 h2 a').on('click', function () {
                $(this).css({'color': '#B94FFF'});
                $(this).siblings('a').css({'color': '#888888'});
                var text = $(this).text();
                if (text === '新增趋势') {
                    option.series[0].name = '新增治愈';
                    option.series[1].name = '新增死亡';
                    option.series[0].data = data.addData.healAdd;
                    option.series[1].data = data.addData.deadAdd;
                }
                else {
                    option.series[0].name = '累计治愈';
                    option.series[1].name = '累计死亡';
                    option.series[0].data = data.sumData.heal;
                    option.series[1].data = data.sumData.dead;
                }
                myChart.setOption(option);
            })

            // 让图表跟随屏幕自动地去适应
            window.addEventListener("resize", function() {
            myChart.resize();
            });
        }
    })
})();

//
(function () {
    $.ajax({
        url: "/get_province_data",  // 向接口地址发出请求
        success: function (charts) {
            // 实例化对象，注意 .bar1 .chart 意思是找到bar1类别下面的chart类别所代表的标签
            var myChart = echarts.init(document.querySelector('.pie2 .chart'))
            // 指定配置项和数据
            var option;

            var img = 'data:image/png;base64,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';
            var trafficWay = charts.data_confirm;

            var data = [];
            var color = ['#00ffff', '#00cfff', '#006ced', '#ffe000', '#ffa800', '#ff5b00', '#ff3000']
            for (var i = 0; i < trafficWay.length; i++) {
                data.push({
                    value: trafficWay[i].value,
                    name: trafficWay[i].name,
                    itemStyle: {
                        normal: {
                            borderWidth: 5,
                            shadowBlur: 20,
                            borderColor: color[i],
                            shadowColor: color[i]
                        }
                    }
                }, {
                    value: 2,
                    name: '',
                    itemStyle: {
                        normal: {
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            },
                            color: 'rgba(0, 0, 0, 0)',
                            borderColor: 'rgba(0, 0, 0, 0)',
                            borderWidth: 0
                        }
                    }
                });
            }
            var seriesOption = [{
                name: '',
                type: 'pie',
                clockWise: false,
                radius: ['70%', '73%'],
                hoverAnimation: false,
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'outside',
                            color: '#ddd',
                            formatter: function(params) {
                                var percent = 0;
                                var total = 0;
                                for (var i = 0; i < trafficWay.length; i++) {
                                    total += trafficWay[i].value;
                                }
                                percent = ((params.value / total) * 100).toFixed(0);
                                if (params.name !== '') {
                                    return   params.name + '\n' + '\n' + '占百分比：' + percent + '%';
                                } else {
                                    return '';
                                }
                            },
                        },
                        labelLine: {
                            length: 30,
                            length2: 100,
                            show: true,
                            color: '#00ffff'
                        }
                    }
                },
                data: data
            }];
            option = {
                // backgroundColor: '#0A2E5D',
                color: color,
                title: {
                    text: '各省确诊数量分布',
                    top: '48%',
                    textAlign: "center",
                    left: "49%",
                    textStyle: {
                        color: '#fff',
                        fontSize: 14,
                        fontWeight: '400'
                    }
                },
                graphic: {
                    elements: [{
                        type: "image",
                        z: 3,
                        style: {
                            image: img,
                            width: 120,
                            height: 120
                        },
                        left: 'center',
                        top: 'center',
                        position: [100, 100]
                    }]
                },
                tooltip: {
                    show: false
                },
                legend: {
                    icon: "circle",
                    orient: 'horizontal',
                    // x: 'left',
                    data: ['优秀学生', '获得荣誉', '论文著作'],
                    left: '5%',
                    bottom: '1%',
                    align: 'right',
                    textStyle: {
                        color: "#fff"
                    },
                    itemGap: 20
                },
                toolbox: {
                    show: false
                },
                series: seriesOption
            }


            // 加载配置项
            myChart.setOption(option);
            // 让图表跟随屏幕自动地去适应
            window.addEventListener("resize", function() {
            myChart.resize();
            });
        }
    })
})();

// 地图
(function() {
    $.ajax({
        url: '/get_map_data',
        success: function (json_data) {
            console.log(json_data)
            var myChart = echarts.init(document.querySelector(".map .chart"));

            var years = json_data["year_month"];
            // console.log(years.length)
            var province = json_data["province"];
            var playlist_data = json_data["confirm_add"]

            var option = {
                baseOption: {
                    timeline: {
                        axisType: 'category',
                        autoPlay: true,
                        playInterval: 3000,
                        symbolSize: 12,
                        left: '5%',
                        right: '5%',
                        bottom: '0%',
                        width: '90%',
                        data: years,
                        tooltip: {
                            formatter: years
                        },
                        lineStyle: {
                            color: '#fff'
                        },
                        label: {
                            color: '#fff'
                        },
                        emphasis: {
                            itemStyle: {
                                color: '#ffb247'
                            }
                        },
                        checkpointStyle: {
                            color: '#ffb247',
                            borderWidth: 0,
                        },
                        controlStyle: {
                            color: '#fff',
                            borderColor: '#fff',
                        },
                    },
                    tooltip: {
                        show: true,
                        formatter: function(params) {
                            return params.name + ': ' + params.value
                        },
                    },
                    visualMap: {
                        type: 'piecewise',
                        pieces: [
                            {
                                min: 1000,
                                color: '#ffe200'
                            },{
                                min: 500,
                                max: 999,
                                color: '#bee587'
                            },{
                                min: 100,
                                max: 499,
                                color: '#a7dbb7'
                            },{
                                min: 10,
                                max: 99,
                                color: '#92d3e3'
                            },{
                                min: 1,
                                max: 9,
                                color: '#87cefa'
                            },{
                                value: 0,
                                color: '#acdcfa'
                            }
                        ],
                        orient: 'vertical',
                        itemWidth: 25,
                        itemHeight: 15,
                        showLabel: true,
                        seriesIndex: [0],
                        textStyle: {
                            color: '#7b93a7'
                        },
                        bottom: '10%',
                        left: '5%',
                    },
                    grid: {
                        right: '5%',
                        top: '20%',
                        bottom: '10%',
                        width: '20%'
                    },
                    xAxis: {
                        min: 0,
                        max: 2000,
                        show: false
                    },
                    yAxis: [{
                        inverse: true,
                        offset: '2',
                        type: 'category',
                        data: '',
                        nameTextStyle: {
                            color: '#fff'
                        },
                        axisTick: {
                            show: false,
                        },
                        axisLabel: {
                            textStyle: {
                                fontSize: 14,
                                color: '#fff',
                            },
                            interval: 0
                        },
                        axisLine: {
                            show: false,
                            lineStyle: {
                                color: '#333'
                            },
                            splitLine: {
                                show: false
                            }
                        },
                    }],
                    geo: {
                        map: 'china',
                        right: '35%',
                        left: '10%',
                        label: {
                            emphasis: {
                                show: false
                            }
                        },
                        itemStyle: {
                            normal: {
                                areaColor: "#acdcfa",
                                borderColor: '#2b91b7',
                                borderWidth: 1
                            },
                            emphasis: {
                                areaColor: '#17f0cc'
                            }
                        }
                    },
                    series: [{
                        name: 'mapSer',
                        type: 'map',
                        map: 'china',
                        roam: false,
                        geoIndex: 0,
                        label: {
                            show: false,
                        },
                    },{
                        name: '',
                        type: 'bar',
                        zlevel: 2,
                        barWidth: '25%',
                        itemStyle: {
                            barBorderRadius: 10,
                        },
                        label: {
                            normal: {
                                show: true,
                                fontSize: 14,
                                color: 'rgba(255, 255, 255, 0.6)',
                                position: 'right',
                                formatter: '{c}'
                            }
                        },
                    }],
                },
                animationDurationUpdate: 3000,
                animationEasingUpdate: 'quinticInOut',
                options: []
            };

            for (var i=0; i<years.length; i++) {
                var res = [];
                for (j=0; j<playlist_data[i].length; j++) {
                    res.push({
                        name: province[j],
                        value: playlist_data[i][j]
                    });
                }
                res.sort(function(a, b) {
                    return b.value - a.value;
                }).slice(0, 6);

                res.sort(function(a, b) {
                    return a.value - b.value;
                });

                var res1 = [];
                var res2 = [];
                for (t=0; t<10; t++) {
                    res1[t] = res[res.length - 1 - t].name;
                    res2[t] = res[res.length - 1 - t].value;
                }
                option.options.push({
                    title: {
                        text: years[i] + "\t的新增确诊地图",
                        textStyle: {
                            color: '#fff',
                            fontSize: 20
                        },
                        left: '0%',
                        top: '10%'
                    },
                    yAxis: {
                        data: res1,
                    },
                    series: [{
                        type: 'map',
                        data: res
                    },{
                        type: 'bar',
                        data: res2,
                        label: {
                            formatter: function (param) {
                                if (param.value > 1000) {
                                    return (param.value / 1000).toFixed(1).toString() + "K"
                                }else {
                                    return param.value
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: function(params) {
                                    var colorList = [{
                                        colorStops: [{
                                            offset: 0,
                                            color: '#ffff00'
                                        },{
                                            offset: 1,
                                            color: '#ffe200'
                                        }]
                                    },{
                                        colorStops: [{
                                            offset: 0,
                                            color: '#acdcfa',
                                        },{
                                            offset: 1,
                                            color: '#87cefa'
                                        }]
                                    }];
                                    if (params.dataIndex < 3) {
                                        return colorList[0]
                                    } else {
                                        return colorList[1]
                                    }
                                }
                            }
                        }
                    }]
                })
            };

            myChart.setOption(option);

            window.addEventListener("resize", function() {
                myChart.resize();
            });
        }
    })
})();


//两月变化趋势
(function () {
    $.ajax({
        url: "/get_tendency_data",  // 向接口地址发出请求
        success: function (charts) {
            // 实例化对象，注意 .bar1 .chart 意思是找到line2类别下面的chart类别所代表的标签
            var myChart = echarts.init(document.querySelector('.line2 .chart'))
            // 指定配置项和数据
            var option;
            
            console.log(charts,'23123');
            let {data_confirm_add, data_importedCase_add, dateList} = charts
            let newData_confirm_add = []
            let newdata_importedCase_add = []
            let newdateList = []
            data_confirm_add = data_confirm_add.map((item,index)=>{
                if(index % 3 === 0){
                    newData_confirm_add.push(item)
                }
            })
            data_importedCase_add = data_importedCase_add.map((item,index)=>{
                if(index % 3 === 0){
                    newdata_importedCase_add.push(item)
                }
            })
            dateList = dateList.map((item,index)=>{
                if(index % 3 === 0){
                    newdateList.push(item)
                }
            })
            console.log(newData_confirm_add,newdata_importedCase_add,newdateList);
            var data = [];
            option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        lineStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0,
                                    color: 'rgba(0, 255, 233,0)'
                                }, {
                                    offset: 0.5,
                                    color: 'rgba(255, 255, 255,1)',
                                }, {
                                    offset: 1,
                                    color: 'rgba(0, 255, 233,0)'
                                }],
                                global: false
                            }
                        },
                    },
                },
                grid: {
                    top: '15%',
                    left: '5%',
                    right: '5%',
                    bottom: '15%',
                    // containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    axisLine: {
                        show: true
                    },
                    splitArea: {
                        // show: true,
                        color: '#f00',
                        lineStyle: {
                            color: '#f00'
                        },
                    },
                    axisLabel: {
                        color: '#fff',
                        rotate: 45
                    },
                    splitLine: {
                        show: false
                    },
                    boundaryGap: false,
                    data: newdateList,
                }],
    
                yAxis: [{
                    type: 'value',
                    min: 0,
                    // max: 140,
                    splitNumber: 4,
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: 'rgba(255,255,255,0.1)'
                        }
                    },
                    axisLine: {
                        show: false,
                    },
                    axisLabel: {
                        show: false,
                        margin: 20,
                        textStyle: {
                            color: '#d1e6eb',
    
                        },
                    },
                    axisTick: {
                        show: false,
                    },
                }],
                legend: {
                    data: ['本土新增', '境外新增', ],
                    textStyle: {   
                        color: "#fff" // 这里是图例文字的颜色设置  
                    }, 
                },
                series: [{
                        name: '本土新增',
                        type: 'line',
                        // smooth: true, //是否平滑
                        showAllSymbol: true,
                        // symbol: 'image://./static/images/guang-circle.png',
                        symbol: 'circle',
                        symbolSize: 5,
                        lineStyle: {
                            normal: {
                                color: "#6c50f3",
                                shadowColor: 'rgba(0, 0, 0, .3)',
                                shadowBlur: 0,
                                shadowOffsetY: 5,
                                shadowOffsetX: 5,
                            },
                        },
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#6c50f3',
                            }
                        },
                        itemStyle: {
                            color: "#6c50f3",
                            borderColor: "#fff",
                            borderWidth: 3,
                            shadowColor: 'rgba(0, 0, 0, .3)',
                            shadowBlur: 0,
                            shadowOffsetY: 2,
                            shadowOffsetX: 2,
                        },
                        tooltip: {
                            show: false
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: 'rgba(108,80,243,0.3)'
                                    },
                                    {
                                        offset: 1,
                                        color: 'rgba(108,80,243,0)'
                                    }
                                ], false),
                                shadowColor: 'rgba(108,80,243, 0.9)',
                                shadowBlur: 20
                            }
                        },
                        data: newData_confirm_add,
                    },
                    {
                        name: '境外新增',
                        type: 'line',
                        // smooth: true, //是否平滑
                        showAllSymbol: true,
                        // symbol: 'image://./static/images/guang-circle.png',
                        symbol: 'circle',
                        symbolSize: 5,
                        lineStyle: {
                            normal: {
                                color: "#00ca95",
                                shadowColor: 'rgba(0, 0, 0, .3)',
                                shadowBlur: 0,
                                shadowOffsetY: 5,
                                shadowOffsetX: 5,
                            },
                        },
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#00ca95',
                            }
                        },
    
                        itemStyle: {
                            color: "#00ca95",
                            borderColor: "#fff",
                            borderWidth: 3,
                            shadowColor: 'rgba(0, 0, 0, .3)',
                            shadowBlur: 0,
                            shadowOffsetY: 2,
                            shadowOffsetX: 2,
                        },
                        tooltip: {
                            show: false
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: 'rgba(0,202,149,0.3)'
                                    },
                                    {
                                        offset: 1,
                                        color: 'rgba(0,202,149,0)'
                                    }
                                ], false),
                                shadowColor: 'rgba(0,202,149, 0.9)',
                                shadowBlur: 10
                            }
                        },
                        data: newdata_importedCase_add,
                    },
                ]
            };
            // 加载配置项
            myChart.setOption(option);
            // 让图表跟随屏幕自动地去适应
            window.addEventListener("resize", function() {
            myChart.resize();
            });
        }
    })
})();