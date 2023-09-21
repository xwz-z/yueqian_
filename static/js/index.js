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

//各省现存确诊数量
(function () {
    $.ajax({
        url: "/get_province_data",  // 向接口地址发出请求
        success: function (charts) {
            // 实例化对象，注意 .bar1 .chart 意思是找到bar1类别下面的chart类别所代表的标签
            var myChart = echarts.init(document.querySelector('.pie2 .chart'))
            
            let colorA = ["#F26C4F", "#F94FFF", "#F5335C", "#FFD200"];
            // 指定配置项和数据
            let option = {
              title: {
                top: "50%",
                left: "33%",
                textStyle: {
                  fontSize: 15,
                  color: "#ffffff",
                },
              },
              legend: {
                orient: "horizontal",
                icon: "circle",
                // right: "5%",
                // y: "center",
                itemWidth: 14,
                itemHeight: 10,
                itemGap: 12,
                align: "left",
                textStyle: {
                  rich: {
                    name: {
                      // width: '45%',
                      fontSize: 10,
                      color: "#fff",
                    },
                    value: {
                      fontSize: 10,
                    //   padding: [0, 5, 0, 15],
                      color: "#00E1EF",
                    },
                  },
                },
                formatter: function (name) {
                  let res = charts.data_confirm.filter((v) => v.name === name);
                  res = res[0] || {};
                  const p = res.value;
                  return "{name|" + name + "：}" + "{value|" + p + "}";
                  // return "{name|" + name + "}";
                },
              },
              tooltip: {
                // show: true,
                confine: true,
                trigger: "item",
                formatter: "{b} : {c}",
              },
              series: [
                {
                  avoidLabelOverlap: false,
                  type: "pie",
                //   roseType: "area", // 玫瑰图
                  center: ["50%", "60%"],
                  radius: ["60%", "50%"],
                  color: colorA,
                  itemStyle: {
                    normal: {
                      borderColor: "#050F20",
                      borderWidth: 3,
                    },
                  },
                  label: {
                    normal: {
                      //   formatter: '{b}\n{d}%\t{c}',
                      formatter: "{b|{b}}\n{d|{d}%}",
                      rich: {
                        icon: {
                          fontSize: 14,
                        },
                        d: {
                          fontSize: 10,
                          padding: [5, 0, 0, 0],
                          color: "#fff",
                        },
                        b: {
                          fontSize: 10,
                          padding: [0, 0, 5, 0],
                          color: "#fff",
                        },
                      },
                    },
                  },
                  labelLine: {
                    normal: {
                      length: 20,
                      length2: 25,
                    },
                  },
                  data: charts.data_confirm,
                },
              ],
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
                        rotate: 45,
                        textStyle: {
                            fontSize: 10
                        },
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

//死亡率
(function () {
    $.ajax({
        url: "/get_dead_ratio",  // 向接口地址发出请求
        success: function (data) {
            // 实例化对象，注意 .bar1 .chart 意思是找到bar1类别下面的chart类别所代表的标签
            var myChart = echarts.init(document.querySelector('.pie1 .chart'))
            // 加载配置项
            console.log(data,'sa');
            let dataList = []
            data.province.forEach((item,index)=>{
                dataList.push({
                    name:item,
                    value:data.ratio[index].toFixed(4)
                })
            })
            let option = {
                title: {
                  text: `全国死亡率\n\t\t\t\t${data.history_ratio[0].toFixed(4) * 100}%`,
                  top: "40%",
                  left: "41%",
                  textStyle: {
                    fontSize: 12,
                    color: "#ffffff",
                  },
                },
                tooltip: {
                  show: true,
                  confine: true,
                  trigger: "item",
                },
                series: [
                  {
                    avoidLabelOverlap: false,
                    type: "pie",
                  //   roseType: "area", // 玫瑰图
                    center: ["50%", "45%"],
                    radius: ["60%", "50%"],
                    itemStyle: {
                      normal: {
                        borderColor: "#050F20",
                        borderWidth: 3,
                      },
                    },
                    label: {
                      normal: {
                        //   formatter: '{b}\n{d}%\t{c}',
                        formatter: "{b|{b}}",
                        rich: {
                          icon: {
                            fontSize: 14,
                          },
                          d: {
                            fontSize: 15,
                            color: "#fff",
                          },
                          b: {
                            fontSize: 15,
                            padding: [0, 0, 0, 0],
                            color: "#fff",
                          },
                        },
                      },
                    },
                    labelLine: {
                      normal: {
                        length: 30,
                        length2: 30,
                      },
                    },
                    data: dataList,
                  },
                ],
              };
            myChart.setOption(option);
            // 让图表跟随屏幕自动地去适应
            window.addEventListener("resize", function() {
            myChart.resize();
            });
        }
    })
})();