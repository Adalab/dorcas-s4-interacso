import React from 'react';

class LegendProjectDetail extends React.Component {
  render() {
    return (
      <div className = "chart__project--legend">
        <p className = "chart__project--legend--completed">
          {this.props.totalCompleted} completadas
        </p>
        <p className = "chart__project--legend--pending">
          {this.props.totalPending} pendientes
        </p>
      </div>
    );
  }
}

export default LegendProjectDetail;
