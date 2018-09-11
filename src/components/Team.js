import React from "react";
import Header from './Header';
import WeekTasksChart from './WeekTasksChart';
import WeekCommitsChart from './WeekCommitsChart';
import TeamStatusBar from './TeamStatusBar';
import Notifications from './Notifications';
import '../App.css'
import Env from '../data/.env.json';

class Team extends React.Component {
  constructor(props) {
    super(props)
    this.texts = {
      title: "Equipo"
    }
    this.state = {
      weekChartData: [],
      memberPics: [],
      tasksWinner: {},
      commitsWinner: {}
    }
  }
  componentDidMount() {
    this.getKillerInfo();
  }

getKillerInfo() {
  if(typeof Env !== "undefined" & Env.token !== "undefined") {
    fetch(
      this.props.apiService + 'team',
      {
        method: 'get',
        withCredentials: true,
        headers: {
          'Cache-Control': 'no-cache',
          'Authorization': Env.token,
          'Content-Type': 'application/json'
        }
      }
    ).then(response => {
      if(response.status === 401){
        throw Error(response.statusText);
      } else {
        return response.json();
      }
    }
  ).then(json => {
    this.getAverage(json);
    this.getTasksWinner(json);
    this.getCommitsWinner(json);
  }).catch(error => {
    alert("El token es incorrecto");
    console.error(error);
  });
  } else {
    alert("No esta usted autorizado");
  }
}
getAverage(json) {
  let teamData = [];
  let memberPicsData = [];
  let averageCommits = 0;
  let averageTask = 0;
  json.data.forEach(person => {
    averageCommits = averageCommits + person.commits
    averageTask = averageTask + person.tasks
    teamData.push({
      member: person.nombre,
      tasks: person.tasks,
      commits: person.commits
    });
    memberPicsData.push(person.photo);
  });
  this.setState({
    weekChartData: teamData,
    memberPics: memberPicsData,
    averageTask: averageTask/json.data.length,
    averageCommits: averageCommits/json.data.length
  })
}
getTasksWinner(json) {
  let maxTasks = 0;
  let winnerTasksObj = {};
  for (let i = 0; i < json.data.length; i++) {
    if (json.data[i].tasks > maxTasks) {
      maxTasks = json.data[i].tasks;
      winnerTasksObj = json.data[i];
    }
  }
  this.setState({
    tasksWinner: winnerTasksObj,
  });
}

getCommitsWinner(json) {
  let maxCommits = 0;
  let winnerCommitsObj = {};
  json.data.map(peopleData => {
    if (peopleData.commits > maxCommits) {
      maxCommits = peopleData.commits;
      winnerCommitsObj = peopleData;
    }
  });
  this.setState({
    commitsWinner: winnerCommitsObj,
  });
}
render() {
  return (
    <div className="team__container databoard">
      <Header title={this.texts.title} />
      <div className="main__container-team">
        <WeekTasksChart
          data={this.state.weekChartData}
          memberPics={this.state.memberPics}
        />
        <WeekCommitsChart
          data={this.state.weekChartData}
          memberPics={this.state.memberPics}
        />
        <TeamStatusBar
          averageTask={this.state.averageTask}
          averageCommits={this.state.averageCommits}
        />
        <div className="dashborad people__container-asana">
          <p className="asana-title">Asana killer</p>
          <img className="profile-pic" src={this.state.tasksWinner.photo}></img>
          <p className="killer-name">{this.state.tasksWinner.nombre}</p>
          <p className="killer-record">{this.state.tasksWinner.tasks}</p>
          <p className="killer-detail">Tareas completadas esta semana</p>
        </div>
        <div className="dashborad people__container-git">
          <p className="git-title">Git killer</p>
          <img className="profile-pic" src={this.state.commitsWinner.photo}></img>
          <p className="killer-name">{this.state.commitsWinner.nombre}</p>
          <p className="killer-record">{this.state.commitsWinner.commits}</p>
          <p className="killer-detail">Commits esta semana</p>
        </div>
      </div>
      <Notifications />
    </div>
  );
}
}

export default Team;
