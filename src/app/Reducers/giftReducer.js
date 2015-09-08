import {FETCH_GIFTS} from '../Constants/ActionTypes';

const initialState = {};

export default function giftReducer(state=initialState, action) {
  // DO NOT mutate the state, return a NEW state

  switch (action.type) {
    case FETCH_GIFTS:
      return Object.assign({}, action.gifts);

    default:
      return state;
  }
}
