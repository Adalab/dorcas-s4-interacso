import React from "react";

class ProjectDetailBar extends React.Component {
  render() {
    const hours= (this.props.projectHours)
    const commits= (this.props.projectCommits)
    const tasks= (this.props.projectTasks)
    const percentage = Math.round(
      this.props.projectTasks.completed / this.props.projectTasks.total*100
    )
    let total = parseInt(tasks.total, 10);
    if (total === 0) {
      total = 1;
    }
    return (
      <div className= "detailed-projects__statistics--container">
        <div className= "statistics__data project__progress">
          <div className= "project-progress__percentage">
            <div className= "data__number"><p>{percentage}%</p></div>
            <div className= "data__tags"><p>progreso</p></div>
          </div>
          <div className= "project-progress__integer">
            <p className= "progress__integer--completed">{tasks.completed}/{tasks.total}</p>
          </div>
        </div>
        <div className= "statistics__data project__hours">
          <div className= "data__number"><p>{hours.total}</p></div>
          <div className= "data__tags"><p>horas</p></div>
        </div>
        <div className= "statistics__data project__hours--week">
          <div className= "data__number"><p>{hours.week}</p></div>
          <div className= "data__tags"><p>horas semana</p></div>
        </div>
        <div className= "statistics__data project__commits">
          <div className= "data__number"><p>{commits}</p></div>
          <div className= "data__tags"><p>commits</p></div>
        </div>
      </div>
    );
  }
}

export default ProjectDetailBar;
