import React from 'react';
import Header from './Header';
import TableCalendar from './TableCalendar';

class Calendar extends React.Component {
  constructor(props){
    super(props)
    this.texts = {
      title: "Calendario"
    }
  }

  render() {
    return (
      <div className = "databoard">
        <Header title = {this.texts.title} />
        <TableCalendar
          milisecondsInADay = {this.props.milisecondsInADay}
          datesToPrint = {this.props.datesToPrint}
          formatDate = {this.props.formatDate}
        />
      </div>
    );
  }
}

export default Calendar;
