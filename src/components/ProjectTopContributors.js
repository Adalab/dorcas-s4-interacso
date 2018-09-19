import React from "react";

class ProjectTopContributors extends React.Component {
  render() {
    const orderContributors = this.props.contributors.sort(function(c1, c2) {
      if (c1.commits < c2.commits){
        return 1;
      } else if (c1.commits < c2.commits){
        return -1;
      } else {
        return 0;
      }
    });
    return (
      <div className="chart__project--top-contributors">
        <div className="top-contributors__chart">
          <p className="top-contributors__title">Top contributors</p>
          <div className="top-contributors__list">
            <ul className="top-contributors__list">
              {orderContributors.map((contributor, index) =>
                <li className="top-contributors__list--element" key={'contributors_' + index}>
                  <span className="top-contributors__list--number">
                    <span>#{index+1}</span>
                    <span className="top-contributors__list--name">{contributor.name}</span>
                  </span>
                  <span className="top-contributors__list--commits">
                    {contributor.commits}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default ProjectTopContributors;
