import * as types from '../Constants/ActionTypes';

export function addFriend(id) {
  return {
    type: types.ADD_FRIEND,
    id
  };
};

export function removeFriend(id) {
  return {
    type: types.REMOVE_FRIEND,
    id
  };
};

export function fetchFriends(friends){
  return {
    type: types.FETCH_FRIENDS,
    friends
  };
};




