import React from 'react';
import { Chart } from 'devextreme-react';
import MemberPhotosBar from './MemberPhotosBar'
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.compact.css';

const settings =
{
  type: "bar",
  argumentField: "member",
  color: "green"
};

const series =
[
  {
    color: "#57718D",
    valueField: "tasks"
  },
];

const size =
{
  height: 120
}

const axisSettings =
{
  label: {
    overlappingBehavior: "none",
    visible: false
  },
  grid:{
    visible: false
  }
}

const legendsSettings = {
  visible: false
}

class WeekTasksChart extends React.Component {

  render() {
    return (
      <div className = "dashboard chart__tasks">
        <p className = "tasks__title">Tareas Semana</p>
        <div className = "">
          <Chart
            dataSource = {this.props.data}
            commonSeriesSettings = {settings}
            series = {series}
            size = {size}
            argumentAxis = {axisSettings}
            valueAxis = {axisSettings}
            legend = {legendsSettings}
          />
          <MemberPhotosBar memberPics = {this.props.memberPics}/>
        </div>
      </div>
    );
  }
}

export default WeekTasksChart;
