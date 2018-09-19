import React from "react";

class ProjectListStatusBar extends React.Component {
  render() {
    const projects= this.props.projectsdata;
    return (
      <div className= "projects__statistics--container">
        <div className= "statistics__data projects__projects">
          <div className= "data__number">
            <p>{projects.active}</p>
          </div>
          <div className= "data__tags">
            <p>Proyectos activos</p>
          </div>
        </div>
        <div className= "statistics__data projects__tasks">
          <div className= "data__number">
            <p>{projects.tasksTotal}</p>
          </div>
          <div className= "data__tags">
            <p>tareas a completar</p>
          </div>
        </div>
        <div className= "statistics__data projects__weeks">
          <div className= "data__number">
            <p>{projects.tasksCompleted}</p>
          </div>
          <div className= "data__tags">
            <p>completadas esta semana</p>
          </div>
        </div>
        <div className= "statistics__data projects__commits">
          <div className= "data__number">
            <p>{projects.commits}</p>
          </div>
          <div className= "data__tags">
            <p>commits</p>
          </div>
        </div>
        <div className= "statistics__data projects__hours">
          <div className= "data__number">
            <p>{projects.hours}</p>
          </div>
          <div className= "data__tags">
            <p>horas</p>
          </div>
        </div>
      </div>
    );
  }
}

export default ProjectListStatusBar;
