import React from "react";

class TableCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animationStarted: false
    };
    this.milisecondsInADay = 86400000;
    this.calendarContainer = React.createRef();
    if (
      typeof this.props.datesToPrint !== "undefined" &&
      this.props.datesToPrint.length === 0
    ) {
      this.getCalendarDates(this.props.datesToPrint);
    }
    this.setDatesNotifications = this.setDatesNotifications.bind(this);
  }

  componentDidMount() {
    this.props.retrieveFromApi("calendar").then(apiResponse => {
      if (this.props.calendarLoaded === false) {
        this.setDatesNotifications(apiResponse.data);
        this.props.updateState({ calendarLoaded: true });
      }
    });
  }
  componentDidUpdate() {
    if (this.state.animationStarted === false) {
      const withEvents = this.calendarContainer.current.querySelectorAll(
        ".day__container--with-event"
      );
      withEvents.forEach(withEvent => {
        const notificationEvents = withEvent.querySelectorAll(
          ".day__notifications-event"
        );
        if (notificationEvents.length > 1) {
          this.animate(notificationEvents);
        }
      });
      const withDeadline = this.calendarContainer.current.querySelectorAll(
        ".day__container"
      );
      withDeadline.forEach(withDeadline => {
        const notificationDeadline = withDeadline.querySelectorAll(
          ".day__notifications-deadline"
        );
        if (notificationDeadline.length > 1) {
          this.animate(notificationDeadline);
        }
      });
      this.setState({
        animationStarted: true
      });
    }
  }
  animate(elements) {
    const visibleTime = 2500;
    const delay = 500;
    const animationTotalTime = elements.length * visibleTime;
    setInterval(() => {
      let fadeInStart = 0;
      let fadeOutStart = visibleTime;
      elements.forEach((element, index) => {
        fadeInStart = visibleTime * index + delay;
        fadeOutStart = fadeOutStart * (index + 1);
        this.fadeIn(element, fadeInStart);
        this.fadeOut(element, fadeOutStart);
      });
    }, animationTotalTime);
  }
  fadeIn(element, time) {
    setTimeout(() => {
      element.classList.remove("display-off");
      element.classList.remove("opacity-off");
    }, time);
  }
  fadeOut(element, time) {
    setTimeout(() => {
      element.classList.add("opacity-off");
      setTimeout(() => {
        element.classList.add("display-off");
      }, 500);
    }, time);
  }

  makeCalendarStructure() {
    let datesInHTML = [];
    const todayDate = new Date();
    this.props.datesToPrint.forEach(dateToPrint => {
      const colorContainer = this.getTodayColor(
        dateToPrint.dateObject,
        todayDate
      );
      let dayContainerClass =
        "day__container " + "day__container" + colorContainer;
      if (dateToPrint.events.length !== 0) {
        dayContainerClass =
          "day__container " +
          "day__container--with-event " +
          "day__container" +
          colorContainer;
      }
      datesInHTML.push(
        <div className={dayContainerClass} key={dateToPrint.label}>
          <div className={"day__label " + "day__label" + colorContainer}>
            {dateToPrint.label}
          </div>
          <div className="day__notifications">
            <div className="notifications__container--events">
              {this.makeEventsStructure(dateToPrint.events)}
            </div>
            <div className="notifications__container--deadlines">
              {this.makeDeadlinesStructure(
                dateToPrint.deadlines,
                dateToPrint.dateObject,
                todayDate
              )}
            </div>
          </div>
        </div>
      );
    });
    return (
      <div className="calendar__container" ref={this.calendarContainer}>
        <div className="calendar__weekday">Lunes</div>
        <div className="calendar__weekday">Martes</div>
        <div className="calendar__weekday">Miércoles</div>
        <div className="calendar__weekday">Jueves</div>
        <div className="calendar__weekday">Viernes</div>
        {datesInHTML}
      </div>
    );
  }

  makeEventsStructure(events) {
    let eventsInHTML = [];
    let counter = 0;
    events.forEach(event => {
      let hiddenClass = "";
      if (counter !== 0) {
        hiddenClass = "opacity-off display-off ";
      }
      eventsInHTML.push(
        <div className={"day__notifications-event " + hiddenClass}>{event}</div>
      );
      counter++;
    });
    return eventsInHTML;
  }

  makeDeadlinesStructure(deadlines, dateObject, todayDate) {
    let deadlinesInHTML = [];
    let counter = 0;
    deadlines.forEach(deadline => {
      let hiddenClass = "";
      if (counter !== 0) {
        hiddenClass = "opacity-off display-off ";
      }
      const colorClass = this.getDeadlineColor(
        deadline.completed,
        dateObject,
        todayDate
      );
      deadlinesInHTML.push(
        <div
          className={
            hiddenClass +
            "day__notifications-deadline " +
            "day__notifications-deadline" +
            colorClass
          }
        >
          <span
            className={
              hiddenClass + "deadline__point deadline__point" + colorClass
            }
          />
          {deadline.text}
        </div>
      );
      counter++;
    });
    return deadlinesInHTML;
  }

  getDeadlineColor(completed, dateObject, todayDate) {
    const nextWeekInMiliseconds = this.nextWeekAndRestOfThisWeek(todayDate);
    const warningDays = nextWeekInMiliseconds + todayDate.getTime();
    if (completed === true) {
      return "--completed";
    } else {
      if (dateObject.getTime() <= todayDate.getTime()) {
        return "--past-deadline";
      } else if (
        dateObject.getTime() > todayDate.getTime() &&
        dateObject.getTime() <= warningDays
      ) {
        return "--nearby-deadline";
      } else {
        return "--got-slack";
      }
    }
  }
  getTodayColor(dateObject, todayDate) {
    if (this.formatDate(dateObject) === this.formatDate(todayDate)) {
      return "--today ";
    } else {
      return " ";
    }
  }

  nextWeekAndRestOfThisWeek(todayDate) {
    const nextWeekAndRestOfThisWeek = 6 - todayDate.getDay() + 1 + 7;
    const nextWeekInMiliseconds =
      nextWeekAndRestOfThisWeek * this.milisecondsInADay;
    return nextWeekInMiliseconds;
  }

  getCalendarDates(datesToPrint) {
    let calendarDate = this.calculateStartDate();
    let weekDays = 0;
    for (let i = 0; i < 20; i++) {
      datesToPrint.push({
        date: this.formatDate(calendarDate),
        dateObject: calendarDate,
        label: calendarDate.getDate(),
        events: [],
        deadlines: []
      });
      calendarDate = this.incrementDaysInMiliseconds(calendarDate, 1);
      if (weekDays === 4) {
        calendarDate = this.incrementDaysInMiliseconds(calendarDate, 2);
        weekDays = 0;
      } else {
        weekDays++;
      }
    }
    this.props.updateState({ datesToPrint: datesToPrint });
  }

  formatDate(date) {
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return date.getFullYear() + "-" + month + "-" + day;
  }

  setDatesNotifications(apiResponse) {
    const datesToPrint = this.props.datesToPrint;
    datesToPrint.forEach((dateToPrint, index) => {
      apiResponse.forEach(dayFromApi => {
        if (dayFromApi.datecalendar === dateToPrint.date) {
          if (dayFromApi.datetype === "event") {
            dateToPrint.events.push(dayFromApi.text);
          }
          if (dayFromApi.datetype === "deadline") {
            dateToPrint.deadlines.push({
              text: dayFromApi.text,
              completed: dayFromApi.completed
            });
          }
        }
      });
      datesToPrint[index] = dateToPrint;
    });
    this.props.updateState({
      datesToPrint: datesToPrint
    });
  }

  incrementDaysInMiliseconds(date, numDays) {
    const totalMiliseconds = this.milisecondsInADay * numDays;
    return new Date(date.getTime() + totalMiliseconds);
  }

  calculateStartDate() {
    const today = new Date();
    const mondayPastWeek = today.getDay() - 1 + 7;
    const mondayPastWeekMiliseconds = this.milisecondsInADay * mondayPastWeek;
    const miliseconds = today.getTime() - mondayPastWeekMiliseconds;
    const startDate = new Date(miliseconds);
    return startDate;
  }

  render() {
    return <React.Fragment>{this.makeCalendarStructure()}</React.Fragment>;
  }
}

export default TableCalendar;
