import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FriendManager from '../components/friendManager';

import {ADD_FRIEND, REMOVE_FRIEND } from '../Actions/user';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleDismissClick = this.handleDismissClick.bind(this);
  }

  handleChange(nextValue) {
    // Available thanks to contextTypes below
    const { router } = this.context;
    router.transitionTo(`/${nextValue}`);
  }

  // renderErrorMessage() {
  //   const { errorMessage } = this.props;
  //   if (!errorMessage) {
  //     return null;
  //   }

  //   return (
  //     <p style={{ backgroundColor: '#e99', padding: 10 }}>
  //       <b>{errorMessage}</b>
  //       {' '}
  //       (<a href="#"
  //           onClick={this.handleDismissClick}>
  //         Dismiss
  //       </a>)
  //     </p>
  //   );
  // }

  render() {
    // Injected by React Router
    const { location, children } = this.props;
    const { pathname } = location;
    const value = pathname.substring(1);

    return (
      <div>
        <Header value={value}
                 onChange={this.handleChange} />
        <hr />
        {children}
      </div>
    );
  }
}

App.propTypes = {
  //   location: PropTypes.shape({
  //   pathname: PropTypes.string.isRequired
  // }),
  // params: PropTypes.shape({
  //   userLogin: PropTypes.string,
  //   repoName: PropTypes.string
  // }).isRequired,
  // children: PropTypes.node
// };

// App.contextTypes = {
//   router: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    friends: state.friends
  };
}

export default connect(mapStateToProps,{ friends })(App);
