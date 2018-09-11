import React from "react";
import Env from "../data/.env.json";

class ProjectListStatusBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      projectsdata: []
    };
  }

  componentDidMount() {
    this.callProjectsData();
  }

  callProjectsData() {
    if ((typeof Env !== "undefined") & (Env.token !== "undefined")) {
      fetch(this.props.apiService + "projects", {
        method: "get",
        withCredentials: true,
        headers: {
          "Cache-Control": "no-cache",
          Authorization: Env.token,
          "Content-Type": "application/json"
        }
      })
        .then(response => {
          if (response.status === 401) {
            throw Error(response.statusText);
          } else {
            return response.json();
          }
        })
        .then(json => {
          this.setState({
            projectsdata: json.data[0]
          });
        })
        .catch(error => {
          alert("El token es incorrecto");
          console.error(error);
        });
    } else {
      alert("No esta usted autorizado");
    }
  }

  render() {
    let projects = this.state.projectsdata;
    return (
      <div className="projects__statistics--container">
        <div className="statistics__data projects__projects">
          <div className="data-number">
            <p>{projects.active}</p>
          </div>
          <div className="data-tags">
            <p>Proyectos activos</p>
          </div>
        </div>
        <div className="statistics__data projects__tasks">
          <div className="data-number">
            <p>{projects.tasksTotal}</p>
          </div>
          <div className="data-tags">
            <p>tareas a completar</p>
          </div>
        </div>
        <div className="statistics__data projects__weeks">
          <div className="data-number">
            <p>{projects.tasksCompleted}</p>
          </div>
          <div className="data-tags">
            <p>completadas esta semana</p>
          </div>
        </div>
        <div className="statistics__data projects__commits">
          <div className="data-number">
            <p>{projects.commits}</p>
          </div>
          <div className="data-tags">
            <p>commits</p>
          </div>
        </div>
        <div className="statistics__data projects__hours">
          <div className="data-number">
            <p>{projects.hours}</p>
          </div>
          <div className="data-tags">
            <p>horas</p>
          </div>
        </div>
      </div>
    );
  }
}

export default ProjectListStatusBar;
