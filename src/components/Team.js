import React from "react";
import Header from './Header';
import WeekTasksChart from './WeekTasksChart';
import WeekCommitsChart from './WeekCommitsChart';
import TeamStatusBar from './TeamStatusBar';
import Notifications from './Notifications';
import '../App.css';

class Team extends React.Component {
  constructor(props) {
    super(props)
    this.texts = {
      title: "Equipo"
    }
  }

  render() {
    return (
      <div className = "team__container databoard">
        <Header title = {this.texts.title} />
        <div className = "main__container--team">
          <WeekTasksChart
            data = {this.props.weekChartData}
            memberPics = {this.props.memberPics}
          />
          <WeekCommitsChart
            data = {this.props.weekChartData}
            memberPics = {this.props.memberPics}
          />
          <TeamStatusBar
            averageTask = {this.props.averageTask}
            averageCommits = {this.props.averageCommits}
          />
          <div className = "dashboard people__container--asana">
            <p className = "asana__title">Asana killer</p>
            <img className = "profile__pic" src={this.props.tasksWinner.photo} alt = "profile__pic"></img>
            <p className = "killer__name">{this.props.tasksWinner.nombre}</p>
            <p className = "killer__record">{this.props.tasksWinner.tasks}</p>
            <p className = "killer__detail">Tareas completadas esta semana</p>
          </div>
          <div className = "dashboard people__container--git">
            <p className = "git__title">Git killer</p>
            <img className = "profile__pic" src = {this.props.commitsWinner.photo} alt = "profile__pic"></img>
            <p className = "killer__name">{this.props.commitsWinner.nombre}</p>
            <p className = "killer__record">{this.props.commitsWinner.commits}</p>
            <p className = "killer__detail">Commits esta semana</p>
          </div>
        </div>
        <Notifications
          notifications = {this.props.notifications}
          currentNotifications = {this.props.currentNotifications} />
      </div>
    );
  }
}

export default Team;
