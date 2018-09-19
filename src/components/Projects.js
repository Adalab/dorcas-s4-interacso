import React from "react";
import Header from "./Header";
import ProjectListStatusBar from "./ProjectListStatusBar";
import Notifications from "./Notifications";
import MostCommitsChart from "./MostCommitsChart";
import MostHoursChart from "./MostHoursChart";

class Projects extends React.Component {
  constructor(props) {
    super(props);
    this.texts= {
      title: "Proyectos"
    };
  }

  render() {
    return (
      <div className = "projects__container databoard">
        <Header title = {this.texts.title} />
        <ProjectListStatusBar projectsdata = {this.props.projectsdata}
          retrieveFromApi = {this.props.retrieveFromApi}
        />
        <div className = "statistics__chart">
          <div className = "chart__details">
            <p>Proyectos más activos (commits)</p>
            <MostCommitsChart data = {this.props.projectsCharts} />
          </div>
          <div className = "chart__details">
            <p>Proyectos más activos (horas)</p>
            <MostHoursChart hours = {this.props.hoursCharts} />
          </div>
        </div>
        <Notifications
          currentNotificationsTransition = {this.props.currentNotificationsTransition}
          notifications = {this.props.notifications}
          currentNotifications = {this.props.currentNotifications}
         />
      </div>
    );
  }
}

export default Projects;
