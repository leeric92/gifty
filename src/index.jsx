import 'babel-core/polyfill';
import React from 'react';
import BrowserHistory from 'react-router/lib/BrowserHistory';
import { Provider } from 'react-redux';
import { Router, Route, Redirect } from 'react-router';
import configStore from './app/Store/configStore';

// containers
import App from './app/Containers/app';
import Login from './app/Containers/login';
import FriendManager from './app/Containers/friendManager';
import GiftDetail from './app/Containers/giftDetail';
import GiftRecs from './app/Containers/giftRecommendations';
import AllFriendsList from './app/Containers/allFriendsList';
import InviteFriend from './app/Containers/inviteFriend';
import WishList from './app/Containers/pinnedGiftList';
import ImageView from './app/Containers/imageView';
import ImageClassify from './app/Containers/imageClassify';

const history = new BrowserHistory();

// store
const store = configStore();

// react routes
React.render(
  <Provider store={store}>
  {() =>
    <Router history={history}>
      <Redirect from="/" to="/login"/>
      <Route path="/" component={App}>
        <Route name="login" path="login" component={Login} />
        <Route name="friends" path="friends" component={FriendManager} />
        <Route name="allFriendsList" path="friends/invite" component={AllFriendsList} />
        <Route name="inviteFriend" path="friends/invite/:friendId" component={InviteFriend} />
        <Route name="wishList" path="friends/:friendId/wishList" component={WishList} />
        <Route name="friendGifts" path="friends/:friendId" component={GiftRecs} />
        <Route name="giftDetail" path="gifts/:giftId" component={GiftDetail} />
        <Route name="imageView" path="friends/:friendId/image" component={ImageView} />
        <Route name="imageClassify" path="/friends/:friendId/imageclassify" component={ImageClassify} />
      </Route>
    </Router>
  }
  </Provider>,
  document.getElementById('app')
);
