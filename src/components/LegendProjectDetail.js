import React from 'react';

class LegendProjectDetail extends React.Component {
  render(){
    return (
      <div className="chart__project--legend">
        <h2 className="chart__project--legend--completed">{this.props.totalCompleted} completadas</h2>
        <h2 className="chart__project--legend--pending">{this.props.totalPending} pendientes</h2>
      </div>
    );
  }
}

export default LegendProjectDetail;
