import React from 'react';

class Header extends React.Component {
  render(){
    return (
      <div className="header__container">
        <h1 className="header__title--which-dashboard">
           Proyectos
        </h1>
        <h1 className="header__title--which-project">
          &nbsp;> IKEA DS
        </h1>
      </div>
    );
  }
}

export default Header;
