import React from "react";
import moment from "moment";
import bell from "../images/bell.svg";

class Notifications extends React.Component {

  constructor(props) {
  super(props);
    this.state = {
      currentNotifications: 0,
      rotateNotifications: 1500
    }
    this.animateNotifications = this.animateNotifications.bind(this)
  }

  animateNotifications() {
    let totalNotifications = this.props.notifications.length;
    if (this.state.currentNotifications >= (totalNotifications - 1)) {
      this.setState({
        currentNotifications: 0
      })
    } else {
      this.setState({
        currentNotifications: this.state.currentNotifications + 1
      });
    }
  }

  componentDidMount() {
    this.animateNotifications();
    setInterval(this.animateNotifications, this.state.rotateNotifications);
  }

  render() {
    if (this.props.notifications.length == 0) {
      return (
        <div className= "footer__container">
          <div className= "footer__notif--number">NOTIFICACIONES ({this.props.notifications.length})
          </div>
        </div>
      )
    }
    return (
      <div className= "footer__container">
        <div className= "footer__notif--number">NOTIFICACIONES ({this.props.notifications.length})
        </div>
          <div className= "footer__notif--container" style= {{top: `-${this.state.currentNotifications * 70}px`}}>
            {this.props.notifications.map(notification =>
              <div className= "footer__notif-details">
                <div className= "detail__notif--category">
                  <div className= "footer__bell">
                    <img src= {bell} className= "bell" />
                  </div>
                  <p className= "detail__notif--type">{notification.category}</p>
                </div>
                <div className= "detail__notif--content">{notification.text}</div>
                <div className= "detail__notif--time">{notification.from}</div>
              </div>
            )}
          </div>
        </div>
      );
    }
  }

export default Notifications;
