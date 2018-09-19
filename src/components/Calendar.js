import React from 'react';
import Header from './Header';
import TableCalendar from './TableCalendar';

class Calendar extends React.Component {
  constructor(props){
    super(props)
    this.texts= {
      title: "Calendario"
    }
  }
  render() {
    return (
      <div className= "databoard">
        <Header title= {this.texts.title}/>
        <TableCalendar
          identifier={this.props.identifier}
          milisecondsInADay={this.props.milisecondsInADay}
          datesToPrint={this.props.datesToPrint}
          calendarLoaded={this.props.calendarLoaded}
          calendarResponseApi={this.props.calendarResponseApi}
          setDatesNotifications={this.props.setDatesNotifications}
          updateState={this.props.updateState}
          retrieveFromApi = {this.props.retrieveFromApi}
          formatDate={this.props.formatDate}
        />
      </div>
    );
  }
}

export default Calendar;
