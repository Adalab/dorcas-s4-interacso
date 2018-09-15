import React from 'react';
import moment from 'moment'
import Header from './Header';
import ProjectsDetailStatusBar from './ProjectDetailStatusBar';
import ProjectBurndownChart from './ProjectBurndownChart';
import Notifications from './Notifications';

class ProjectDetail extends React.Component {
  constructor(props){
    super(props)
    this.texts = {
      title: `Proyectos > ${this.props.projectName}`
    }
    this.state = {
      projectData: {
        hours: "",
        commits: "",
        tasks: "",
        contributors: "",
      },
      projectTasks: []
    }
  this.generateChartData= this.generateChartData.bind(this);
  }

  componentDidMount() {
    this.props.retrieveFromApi(`projects/${this.props.projectId}`).then(apiResponse => {
      this.setState({
        projectData: apiResponse
      });
    });
    this.props.retrieveFromApi(`projects/${this.props.projectId}/tasks`).then(apiResponse => {
      if (apiResponse.data != undefined) {
        const generatedData = this.generateChartData(apiResponse.data);
        this.setState({
          projectTasks: generatedData
        });
      }
    });
  }

  generateChartData(tasks) {
    const totals = {};
    const currentWeekOfYear = moment().isoWeek();
    for (let week = 1; week <= 52; week++) {
      totals[week] = {
        created: 0,
        completed: 0,
        weekFirst: moment(2018).add(week - 1, 'weeks').format("MMM \nD")
      }
    }

    tasks.forEach(task => {
      const taskYear = moment(task.created_at).year();
      const weekOfYear = moment(task.created_at).isoWeek();
      totals[weekOfYear].created = totals[weekOfYear].created + 1;
      if (task.completed){
        totals[weekOfYear].completed = totals[weekOfYear].completed + 1;
      }
    });
    const chartData = [];
    for (let day in totals) {
      chartData.push({
        weekDay: totals[day].weekFirst,
        weekNumber: day,
        completed: totals[day].completed,
        created: totals[day].created,
      })
    }
    chartData.sort((a, b) => {
      return a.weekNumber - b.weekNumber
    })
    return chartData.slice(currentWeekOfYear - 6, currentWeekOfYear + 6);
  }

  render(){
    return (
      <div className= "detailedprojects__container databoard">
        <Header title= {this.texts.title} />
        <div className= "detailedprojects__content">
          <ProjectsDetailStatusBar
          projectId={this.props.projectId}
          projectHours={this.state.projectData.hours}
          projectCommits={this.state.projectData.commits}
          projectTasks={this.state.projectData.tasks}
          updateState={this.props.updateState}
          retrieveFromApi={this.props.retrieveFromApi}/>
        <div className= "statistics__charts">
          <ProjectBurndownChart
           data={this.state.projectTasks}
           />
            <div className= "chart__project--top-contributors">
              <div className= "top-contributors__chart">
                <p className= "top-contributors__title">Top contributors</p>
                <ul className= "top-contributors__list">
                  <li className= "top-contributors__list--element">#1</li>
                  <li className= "top-contributors__list--element">#2</li>
                  <li className= "top-contributors__list--element">#3</li>
                  <li className= "top-contributors__list--element">#4</li>
                  <li className= "top-contributors__list--element">#5</li>
                  <li className= "top-contributors__list--element">#6</li>
                </ul>
            </div>
          </div>
        </div>
      </div>
        <Notifications/>
      </div>
    );
  }
}

export default ProjectDetail;
