import React from 'react';
import { Chart } from 'devextreme-react';


const settings =
{
  type: "bar",
  argumentField: "hoursName",
  color: "green"
};
const series  =
[
  {
    color: "#57718D",
    valueField: "time",
    label: {
      visible: true,
      backgroundColor: "none",
      font: {
        color: "white",
        size: 25,
        family: "Open Sans"
      }
    }
  },

];
const size =
{
  height: 300

}
const axisSettings =
{
  label: {
    overlappingBehavior: "none",
    font: {
      color: "white",
      family: "Open Sans",
      size: 20
    }
  },
  grid:{
    visible: false
  },
   maxValueMargin: 0.1,

}
const legendsSettings = {
  visible: false
}

class MostHoursChart extends React.Component {

  render(){
    return (
      <Chart
        dataSource={this.props.hours}
        commonSeriesSettings={settings}
        series={series}
        size={size}
        argumentAxis={axisSettings}
        valueAxis={axisSettings}
        legend={legendsSettings}
      />
      );
      }
  }

  export default MostHoursChart;
