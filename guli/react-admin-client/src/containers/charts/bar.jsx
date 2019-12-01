import React from 'react'
import ReactEcharts from "echarts-for-react";

export default function Bar () {
  function getOptions () {
    const option = {
      legend: {
        data: ['category']
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: 'category',
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar'
      }]
    };
    return option
  }
  return <>
    <ReactEcharts
      option={getOptions()}
    />  </>
}