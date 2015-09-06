import React from 'react';
import { connect } from 'react-redux';
import Friend from './friend';
import { removeFriend } from '../Actions/user';

var FriendList = React.createClass({

  clickHandler: function(id) {
    $.ajax({
      url: "http://localhost:" + PORT.PORT + "/api/friends/remove",
      method: 'POST',
      data: {friendId: id}, // need to pass in the access token
      success: function(id) {
        this.props.dispatch(removeFriend(id));
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("http://localhost:" + PORT.PORT + "/api/friends", status, err.toString());
      }.bind(this)
    });

  },

  render: function() {
    return (
      <div className='friend-list'>
        {
          this.props.appFriends.map(function(friend) {

            return (
              <Friend friend={friend} key={friend.id} onClick={this.clickHandler.bind(this, friend.id)}/>
            );

          }, this)
        }
      </div>
    );
  }

});

export default connect()(FriendList);
