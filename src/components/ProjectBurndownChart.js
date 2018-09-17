import React from 'react';
import { Chart } from 'devextreme-react';

const settings=
{
  type: "line",
  argumentField: "weekDay",
  color: "green"
};
const series =
[
  {
    color: "#f5a623",
    valueField: "completed",
  },

  {
    color: "#3dcef0",
    valueField: "created",
  },
];
const size=
{
  height: 300,
  width: 1000
}
const axisSettings=
{
  label: {
    overlappingBehavior: "rotate",
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
const legendsSettings= {
  visible: false
}

class ProjectBurndownChart extends React.Component {
  render(){
    return (
      <div className= "statistics__charts">
        <div className= "chart__project--completed-tasks">
        <Chart
          dataSource= {this.props.data}
          commonSeriesSettings= {settings}
          series= {series}
          size= {size}
          argumentAxis= {axisSettings}
          valueAxis= {axisSettings}
          legend= {legendsSettings}
        />
        </div>
      </div>
      );
  }
}

export default ProjectBurndownChart;
