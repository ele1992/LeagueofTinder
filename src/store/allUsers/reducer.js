const initialState = [];

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case "FETCH_USERS_SUCCES": {
      return action.payload;
    }
    default: {
      return state;
    }
  }
}
