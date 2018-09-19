import React from 'react';

class TeamStatusBar extends React.Component {
  render() {
    return (
      <div className = "average__container">
        <div className = "dashboard average__container--commits">
          <p className = "commits__number">{this.props.averageCommits}</p>
          <p className = "commits__text">Commits/dia/persona</p>
        </div>
        <div className = "dashboard average__container--tasks">
          <p className = "tasks__number">{this.props.averageTask}</p>
          <p className = "tasks__text">Tareas/dia/persona</p>
        </div>
      </div>
    );
  }
}

export default TeamStatusBar;
