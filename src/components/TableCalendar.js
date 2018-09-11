import React from 'react';
import Env from '../data/.env.json';

class Table extends React.Component {
  constructor(props){
    super(props);
    this.milisecondsInADay = 86400000;
    this.state = {
      datesToPrint: this.getCalendarDates()
    };
  }
  componentDidMount() {
    this.getCalendarNotifications();
  }
  makeCalendarStructure() {
    let datesInHTML = [];
    const todayDate = new Date();
    this.state.datesToPrint.forEach(dateToPrint => {
      let dayContainerClass = 'day__container ';
      if (dateToPrint.events.length !== 0) {
        dayContainerClass += 'day__container--with-event';
      }
      datesInHTML.push(
        <div className = {dayContainerClass} key={dateToPrint.label}>
          <div className = "day__label">{dateToPrint.label}</div>
          <div className = "day__notifications">
          {this.makeEventsStructure(dateToPrint.events)}
          {this.makeDeadlinesStructure(dateToPrint.deadlines, dateToPrint.dateObject, todayDate)}
          </div>
        </div>
      )
    })
    return <div className="calendar__container">
      <div className="calendar__weekday">Lunes</div>
      <div className="calendar__weekday">Martes</div>
      <div className="calendar__weekday">Miércoles</div>
      <div className="calendar__weekday">Jueves</div>
      <div className="calendar__weekday">Viernes</div>
      {datesInHTML}
    </div>
  }
  makeEventsStructure(events) {
    let eventsInHTML = [];
    events.forEach(event => {
      eventsInHTML.push(
        <div className ="day__notifications-event">{event}</div>
      );
    });
    return eventsInHTML;
  }
  makeDeadlinesStructure(deadlines, dateObject, todayDate){
    let deadlinesInHTML = [];
    deadlines.forEach(deadline => {
      const colorClass = this.getDeadlineColor(deadline.completed, dateObject, todayDate);
      deadlinesInHTML.push(
        <div className ={"day__notifications-deadline day__notifications-deadline" + colorClass}>
          <span className={"deadline__point deadline__point" + colorClass}></span>
          {deadline.text}
        </div>
      );
    });
    return deadlinesInHTML;
  }
  getDeadlineColor(completed, dateObject, todayDate) {
    const nextWeekInMiliseconds = this.nextWeekAndRestOfThisWeek(todayDate);
    const warningDays = nextWeekInMiliseconds + todayDate.getTime();
    if(completed === true) {
      return "--completed";
    } else {
      if(dateObject.getTime() <= todayDate.getTime()) {
        return "--pastDeadline";
      } else if(dateObject.getTime() > todayDate.getTime() && dateObject.getTime() <= warningDays) {
        return "--nearbyDeadline";
      } else {
        return "--gotSlack"
      }
    }

  }
  nextWeekAndRestOfThisWeek(todayDate){
    const nextWeekAndRestOfThisWeek = ((6 - todayDate.getDay()) + 1) + 7;
    const nextWeekInMiliseconds = nextWeekAndRestOfThisWeek * this.milisecondsInADay
    return nextWeekInMiliseconds;
  }
  getCalendarDates() {
    let calendarDate = this.calculateStartDate();
    let weekDays = 0;
    let datesToPrint = [];
    for (let i = 0; i < 20; i++) {
      datesToPrint.push(
        {
          date: this.formatDate(calendarDate),
          dateObject: calendarDate,
          label: calendarDate.getDate(),
          events: [],
          deadlines: []
        })
        calendarDate = this.incrementDaysInMiliseconds(calendarDate, 1);
        if (weekDays === 4){
          calendarDate = this.incrementDaysInMiliseconds(calendarDate, 2);
          weekDays = 0;
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
    getCalendarNotifications() {
      if(typeof Env !== "undefined" & Env.token !== "undefined") {
        fetch(
          this.props.apiService + 'calendar',
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
        this.setDatesNotifications(json.data);
      }).catch(error => {
        alert("El token es incorrecto");
        console.error(error);
      });
    } else {
      alert("No esta usted autorizado");
    }
  }
  setDatesNotifications(apiResponse){
    const datesToPrint = this.state.datesToPrint;
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
    this.setState({
      datesToPrint: datesToPrint
    })
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
    return startDate; //objeto con el día de inicio
  }
  render() {
    return (
      <React.Fragment>
        {this.makeCalendarStructure()}
      </React.Fragment>
    );
  }
}

export default Table;
