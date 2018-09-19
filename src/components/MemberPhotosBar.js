import React from 'react';

class MemberPhotosBar extends React.Component {
  render(){
    return (
      <div className= "team-member__photo">
        {this.props.memberPics.map((pic, index) =>
          <img className= "team-member__photo--circles" src= {pic} alt="member__photo" key={"photo_" + index}/>
        )}
      </div>
    );
  }
}

export default MemberPhotosBar;
