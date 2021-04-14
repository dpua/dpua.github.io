const initialState = {
  currentUser: {}
}

const reducer = (state = initialState, action)  => {
    switch (action.type) {
      case 'LOGIN_USER':
        return {...state, currentUser: action.payload}
      case 'LOGOUT_USER':
        return {...state, currentUser: {} }
      case 'SWITCH_MENU':
        return state;
      default:
        return state;
    }
  }
  
  export default reducer;