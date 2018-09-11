import React from 'react';
import Header from './Header';
import Notifications from './Notifications';

class ProjectDetail extends React.Component {
  constructor(props){
    super(props)
    this.texts = {
      title: "Proyectos > IKEA JD"
    }
  }
  render(){
     return (
      <div className="detailedprojects__container databoard">
        <Header title={this.texts.title} />
        <div className="detailedprojects__content">
          <div className="detailedprojects__statistics--container">
            <div className="statistics__data project__progress">
              <div className="project-progress__percentage">
                <div className="data-number"><p>55%</p></div>
                <div className="data-tags"><p>progreso</p></div>
              </div>
              <div className="project-progress__integer">
                <p className="progress__integer--completed">550/1000</p>
              </div>
            </div>
            <div className="statistics__data project__hours">
              <div className="data-number"><p>2500</p></div>
              <div className="data-tags"><p>horas</p></div>
            </div>
            <div className="statistics__data project__hours--week">
              <div className="data-number"><p>50</p></div>
              <div className="data-tags"><p>horas semana</p></div>
            </div>
            <div className="statistics__data project__commits">
              <div className="data-number"><p>1800</p></div>
              <div className="data-tags"><p>commits</p></div>
            </div>
          </div>
          <div className="statistics__charts">
            <div className="chart__project--completed-tasks">

            </div>
            <div className="chart__project--top-contributors">
              <div className="top-contributors__chart">
                <p className="top-contributors__title">Top contributors</p>
                <ul className="top-contributors__list">
                  <li className="top-contributors__list--element">#1</li>
                  <li className="top-contributors__list--element">#2</li>
                  <li className="top-contributors__list--element">#3</li>
                  <li className="top-contributors__list--element">#4</li>
                  <li className="top-contributors__list--element">#5</li>
                  <li className="top-contributors__list--element">#6</li>
                </ul>

              </div>

            </div>
          </div>
        </div>
        <Notifications />
      </div>
    );
  }
}

export default ProjectDetail;
