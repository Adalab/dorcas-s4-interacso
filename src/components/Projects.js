import React from "react";
import Header from "./Header";
import ProjectListStatusBar from "./ProjectListStatusBar";
import Notifications from "./Notifications";
import Env from "../data/.env.json";
import MostCommitsChart from "./MostCommitsChart";
import MostHoursChart from "./MostHoursChart";

class Projects extends React.Component {
  constructor(props) {
    super(props);
    this.texts = {
      title: "Proyectos"
    };
    this.state = {
      projectsCharts: [],
      hoursCharts: []
    };
    this.getProjectsData = this.getProjectsData.bind(this);
  }

  componentDidMount() {
    this.getProjectsData();
  }

  getProjectsData() {
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
          const projectsData = [];

          for (var elemento in json.data[0].commitRank) {
            projectsData.push({
              projectName: elemento,
              commits: json.data[0].commitRank[elemento]
            });
          }
          this.setState({
            projectsCharts: projectsData
          });

          const hoursData = [];

          for (var hoursProject in json.data[0].hourRank) {
            hoursData.push({
              hoursName: hoursProject,
              time: json.data[0].hourRank[hoursProject]
            });
          }
          this.setState({
            hoursCharts: hoursData
          });
          console.log(hoursData);
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
    return (
      <div className="projects__container databoard">
        <Header title={this.texts.title} />
        <ProjectListStatusBar apiService={this.props.apiService} />
        <div className="statistics__chart">
          <div className="chart-commits">
            <p>Proyectos más activos (commits)</p>
            <MostCommitsChart data={this.state.projectsCharts} />
          </div>
          <div className="chart-commits">
            <p>Proyectos más activos (horas)</p>
            <MostHoursChart hours={this.state.hoursCharts} />
          </div>
        </div>
        <Notifications />
      </div>
    );
  }
}

export default Projects;
