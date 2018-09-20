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
    valueField: "commits"
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

class WeekCommitsChart extends React.Component {

  render() {
    return (
      <div className = "dashboard chart__commits">
        <p className = "commits__title">Commits Semana</p>
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

export default WeekCommitsChart;
