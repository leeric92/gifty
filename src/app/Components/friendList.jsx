var React = require('react');

var Friend = require('./friend');

var FriendList = React.createClass({
  getInitialState: function(){
    return {
      appFriends : this.props.appFriends
    }
  },
  render: function() {
    // console.log("HERE",this.props.appFriends)
    return (
      <div className='friend-list'>
        {this.props.appFriends.map(function(friend){
          return (
            <Friend friend={friend} key={friend.id} onClick={this.props.actions.removeFriend.bind(this, friend.id)}/>
            );
        },this)}

      </div>
    );
  }
});

module.exports = FriendList;
