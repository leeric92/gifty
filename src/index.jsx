require('./css/styles.css'); // add the css for all pages
import 'babel-core/polyfill';
import React from 'react';
// var Reflux        = require('reflux');
import BrowserHistory from 'react-router/lib/BrowserHistory';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router';
import configureStore from 'app/Store/configStore';

// // routing
// var Router        = require('react-router');
// var RouteHandler  = Router.RouteHandler;
// var Route         = Router.Route;
// var DefaultRoute  = Router.DefaultRoute;
// var NotFoundRoute = Router.NotFoundRoute;

// view components
var Login          = require('./app/Containers/login');
var FriendManager = require('./app/Containers/friendManager');
var GiftDetail    = require('./app/Containers/giftDetail');
var GiftRecs      = require('./app/Containers/recommendedGifts');
// TODO GiftList View for each friend

// store
// TODO declare variable for store and require store module for the app
const history = new BrowserHistory();
const store = configureStore();
// TODO need a navigation component for all pages

React.render(
  <Provider store={store}>
    {() =>
      <Router history={history}>
        <Route path="/" component={App}>
          <Route path="/login"
                 component={Login} />
          <Route path="friends"
                 component={FriendManager} />
        </Route>
      </Router>
    }
  </Provider>,
  document.getElementById('app')
);


// // declare our routes and their hierarchy
// var routes = (
//   <Route handler={Main} >
//     <DefaultRoute handler={Boot} />
//     <Route name="login" path="/login" handler={Boot} />
//     <Route name="friends" path="/friends" handler={FriendManager} >
//       <Route name="friendGifts" path="/friends/:friendId" handler={GiftRecs} />
//     </Route>
//     <Route name="giftDetail" path="gifts/:giftId" hander={GiftDetail} />
//   </Route>
// );

// var Main = React.createClass({
//   render: function () {
//     return (
//       <RouteHandler/>
//     );
//   }
// });

// <Route name="friendGiftList" path="/friends/:friendId/giftlist" handler={giftList} />


// // use the HTML5 history API for cleaner URLs
// Router.run(routes, Router.HistoryLocation, function (Handler) {
//   React.render(<Handler/>, document.body);
// });
