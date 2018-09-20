import React from 'react';

class TeamStatusBar extends React.Component {
  render() {
    return (
      <div className = "average__container">
        <div className = "dashboard average__container--commits">
          <p className = "commits__number">{parseFloat(this.props.averageCommits).toFixed(0)}</p>
          <p className = "commits__text">Commits/dia/persona</p>
        </div>
        <div className = "dashboard average__container--tasks">
          <p className = "tasks__number">{parseFloat(this.props.averageTask).toFixed(0)}</p>
          <p className = "tasks__text">Tareas/dia/persona</p>
        </div>
      </div>
    );
  }
}

export default TeamStatusBar;
