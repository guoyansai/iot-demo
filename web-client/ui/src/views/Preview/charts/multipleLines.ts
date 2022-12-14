const iotCharts = (data: { time: any; voltage: any; current: any }) => {
  const colors = ['#5793f3', '#d14a61', '#675bba', '#00aaaa'];
  return {
    color: colors,

    tooltip: {
      trigger: 'none',
      axisPointer: {
        type: 'cross',
      },
    },
    legend: {
      data: ['电压', '电流'],
      padding: 10,
      textStyle: {
        color: 'white',
      },
    },
    grid: {
      top: 70,
      bottom: 50,
    },
    xAxis: [
      {
        type: 'category',
        axisTick: {
          alignWithLabel: true,
        },
        axisLine: {
          onZero: false,
          lineStyle: {
            color: colors[1],
          },
        },
        axisPointer: {
          label: {
            formatter: function (params: {
              value: string;
              seriesData: string | any[];
            }) {
              return (
                '电流  ' +
                params.value +
                (params.seriesData.length
                  ? '：' + params.seriesData[0].data
                  : '')
              );
            },
          },
        },
        // data: ['2016-1', '2016-2', '2016-3', '2016-4', '2016-5', '2016-6', '2016-7', '2016-8', '2016-9', '2016-10', '2016-11', '2016-12']
        data: data.time,
      },
      {
        type: 'category',
        axisTick: {
          alignWithLabel: true,
        },
        axisLine: {
          onZero: false,
          lineStyle: {
            color: colors[0],
          },
        },
        axisPointer: {
          label: {
            formatter: function (params: {
              value: string;
              seriesData: string | any[];
            }) {
              return (
                '电压  ' +
                params.value +
                (params.seriesData.length
                  ? '：' + params.seriesData[0].data
                  : '')
              );
            },
          },
        },
        // data: ['2015-1', '2015-2', '2015-3', '2015-4', '2015-5', '2015-6', '2015-7', '2015-8', '2015-9', '2015-10', '2015-11', '2015-12']
        data: data.time,
      },
    ],
    yAxis: [
      {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: colors[3],
          },
        },
      },
    ],
    series: [
      {
        name: '电压',
        type: 'line',
        xAxisIndex: 1,
        smooth: true,
        // data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
        data: data.voltage,
      },
      {
        name: '电流',
        type: 'line',
        smooth: true,
        // data: [3.9, 5.9, 11.1, 18.7, 48.3, 69.2, 231.6, 46.6, 55.4, 18.4, 10.3, 0.7]
        data: data.current,
      },
    ],
  };
};
export default iotCharts;
