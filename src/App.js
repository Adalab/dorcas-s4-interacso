import React, { Component } from 'react';
import Calendar from './components/Calendar';
import Projects from './components/Projects';
import ProjectDetail from './components/ProjectDetail';
import Team from './components/Team';
import Env from './data/.env.json';
import './App.css';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.compact.css';
import moment from "moment";

class App extends Component {
  constructor(props) {
    super(props);
    this.apiService = 'https://databoards-api.interacso.com/';
    this.milisecondsInADay = 86400000;
    this.state = {
      currentDataboard: 0,
      currentTransition: "0.5s",
      currentSlideLeft: "0",
      totalDataboards: 4,
      datesToPrint: [],
      projectsResponseApi: [],
      teamResponseApi: [],
      projectsdata: [],
      projectsCharts: [],
      hoursCharts: [],
      weekChartData: [],
      memberPics: [],
      tasksWinner: {},
      commitsWinner: {},
      averageTask: 0,
      averageCommits: 0,
      projectHours: {},
      projectCommits: 0,
      projectTasks: {},
      projects: [],
      refreshTime: 15000,
      notificationsRefreshTime: 30000,
      notifications: []
    }
    this.showNextDashboard = this.showNextDashboard.bind(this);
    this.retrieveFromApi = this.retrieveFromApi.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.loadNotifications = this.loadNotifications.bind(this);
  }

  componentDidMount() {
    this.loadNotifications();
    this.effect = setInterval(this.showNextDashboard, this.state.refreshTime);
    setInterval(this.loadNotifications, this.state.notificationsRefreshTime);
    setInterval(this.animateNotifications, this.state.rotateNotifications);
    this.retrieveFromApi("projects/list").then(projectListJson => {
      if (typeof projectListJson !== "undefined") {
        this.setState({
          totalDataboards: this.state.totalDataboards + projectListJson.total,
          projects: projectListJson.data
        });
      }
    });
    this.retrieveFromApi("calendar").then(calendarJson => {
      if (typeof calendarJson !== "undefined") {
        let calendarDates = this.getCalendarDates();
        calendarDates = this.setDatesNotifications(calendarDates, calendarJson);
        this.setState({
          datesToPrint: calendarDates
        });
      }
    });
    this.retrieveFromApi("projects").then(projectsResponseApi => {
      this.saveCommitsAndHours(projectsResponseApi);
    });
    this.retrieveFromApi("projects").then(projectsResponseApi => {
      this.setState({projectsdata: projectsResponseApi.data[0]})
    });
    this.retrieveFromApi("team").then(teamResponseApi => {
      this.getAverage(teamResponseApi);
      this.getTasksWinner(teamResponseApi);
      this.getCommitsWinner(teamResponseApi);
    });
  }

  retrieveFromApi(endpoint) {
    if (typeof Env !== "undefined" & Env.token !== "undefined") {
      return fetch(
        this.apiService + endpoint,
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
        if (response.status === 401) {
          throw Error(response.statusText);
        } else {
          return response.json();
        }
      }
    ).then(json => {
      return json;
    }).catch(error => {
      alert("El token es incorrecto");
      console.error(error);
    });
  } else {
    alert("No está usted autorizado");
    return null;
  }
}

showNextDashboard() {
  if (this.state.currentDataboard === this.state.totalDataboards - 1) {
    clearInterval(this.effect);
    this.setState({
      currentDataboard: 0,
      currentSlideLeft: "0",
      currentTransition: "none"
    });
    this.effect= setInterval(this.showNextDashboard, this.state.refreshTime);
  } else {
    this.setState({
      currentDataboard: this.state.currentDataboard + 1,
    });
    const newSlide = this.state.currentDataboard * -100;
    this.setState({
      currentSlideLeft: `${newSlide}%`,
      currentTransition: "0.5s"
    })
  }
}
//calendar
getCalendarDates() {
  let datesToPrint = [];
  let calendarDate = this.calculateStartDate();
  let weekDays = 0;
  for (let i = 0; i < 20; i++) {
    datesToPrint.push(
      {
        date: this.formatDate(calendarDate),
        dateObject: calendarDate,
        label: calendarDate.getDate(),
        events: [],
        deadlines: []
      }
    )
      calendarDate= this.incrementDaysInMiliseconds(calendarDate, 1);
      if (weekDays === 4){
        calendarDate= this.incrementDaysInMiliseconds(calendarDate, 2);
        weekDays= 0;
      } else {
        weekDays++;
      }
    }
    return datesToPrint;
  }

  formatDate(date) {
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return date.getFullYear() + '-' + month + '-' + day;
  }

  setDatesNotifications(datesToPrint, json) {
    const apiResponse = json.data;
    datesToPrint.forEach((dateToPrint, index) => {
      apiResponse.forEach(dayFromApi => {
        if (dayFromApi.datecalendar === dateToPrint.date) {
          if (dayFromApi.datetype === 'event') {
            dateToPrint.events.push(dayFromApi.text);
          }
          if (dayFromApi.datetype === 'deadline') {
            dateToPrint.deadlines.push({
              "text": dayFromApi.text,
              "completed": dayFromApi.completed
            });
          }
        }
      });
      datesToPrint[index] = dateToPrint;
    });
    return datesToPrint;
  }

  incrementDaysInMiliseconds(date, numDays) {
    const totalMiliseconds = this.milisecondsInADay * numDays;
    return new Date(date.getTime() + totalMiliseconds);
  }

  calculateStartDate() {
    const today = new Date();
    const mondayPastWeek = (today.getDay() - 1) + 7;
    const mondayPastWeekMiliseconds = this.milisecondsInADay * mondayPastWeek;
    const miliseconds = today.getTime() - mondayPastWeekMiliseconds;
    const startDate = new Date(miliseconds);
    return startDate;
  }

  //NOTIFICACIONES
  loadNotifications() {
    const filterTime = 1800000000000000;
    this.retrieveFromApi('notifications').then(projectListJson => {
      const orderedNotifications = projectListJson.data.sort((c1, c2) =>
      moment(c1.created_at) < (c2.created_at)
    );
    const doneNotifications = [];
    orderedNotifications.forEach((notification) => {
      if (moment().diff(moment(notification.created_at)) > filterTime) {
        return;
      }
      doneNotifications.push({
        category: notification.category,
        text: notification.text,
        from: moment(notification.created_at).fromNow(),
      });
    });
    this.setState({
      notifications: doneNotifications
    });
    });
  }

  //PROJECTS

  saveCommitsAndHours(projectsResponseApi) {
    const projectsData = [];
    for (var elemento in projectsResponseApi.data[0].commitRank) {
      projectsData.push({
        projectName: elemento,
        commits: projectsResponseApi.data[0].commitRank[elemento]
      });
    }
    this.setState({
      projectsCharts: projectsData
    });
    const hoursData = [];
    for (var hoursProject in projectsResponseApi.data[0].hourRank) {
      hoursData.push({
        hoursName: hoursProject,
        time: projectsResponseApi.data[0].hourRank[hoursProject]
      });
    }
    this.setState({
      hoursCharts: hoursData
    });
  }

  //TEAM

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
    json.data.forEach(peopleData => {
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
    const sliderStyles = {
      left: this.state.currentSlideLeft,
      transition: this.state.currentTransition
    }
    return (
      <div className = "visor" style = {sliderStyles}>

        <Calendar
          milisecondsInADay = {this.milisecondsInADay}
          datesToPrint = {this.state.datesToPrint}
          formatDate = {this.formatDate}
        />

        <Projects projectsdata = {this.state.projectsdata}
          projectsCharts = {this.state.projectsCharts}
          hoursCharts = {this.state.hoursCharts}
          retrieveFromApi = {this.retrieveFromApi}
          notifications = {this.state.notifications}
          currentNotifications = {this.state.currentNotifications}
        />

        {this.state.projects.map((project, index) =>
          <ProjectDetail
            key = {"projectDetail_" + index}
            projectHours = {this.state.projectHours}
            projectCommits = {this.state.projectCommits}
            projectTasks = {this.state.projectTasks}
            retrieveFromApi = {this.retrieveFromApi}
            projectId = {project.gid}
            projectName = {project.name}
            notifications = {this.state.notifications}
            currentNotifications = {this.state.currentNotifications}
          />
        )}

        <Team
          teamResponseApi = {this.state.teamResponseApi}
          weekChartData = {this.state.weekChartData}
          memberPics = {this.state.memberPics}
          tasksWinner = {this.state.tasksWinner}
          commitsWinner = {this.state.commitsWinner}
          averageTask = {this.state.averageTask}
          averageCommits = {this.state.averageCommits}
          retrieveFromApi = {this.retrieveFromApi}
          notifications = {this.state.notifications}
          currentNotifications = {this.state.currentNotifications}
        />

        <Calendar
          milisecondsInADay = {this.milisecondsInADay}
          datesToPrint = {this.state.datesToPrint}
          formatDate = {this.formatDate}
        />
      </div>
    );
  }
}

export default App;
