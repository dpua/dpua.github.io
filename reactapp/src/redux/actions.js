export const userPostFetch = user => {
  return dispatch => {
    return fetch("https://site.spilka.dp.ua/users.php", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({user})
    })
      .then(resp => resp.json())
      .then(data => {
        if (data.message) {
          //Тут прописываем логику
        } else {
          localStorage.setItem("token", data.jwt)
          dispatch(loginUser(data.user))
        }
      })
  }
}

const loginUser = userObj => ({
    type: 'LOGIN_USER',
    payload: userObj
})

export const userPostForgot = user => {
  return dispatch => {
    return fetch("https://site.spilka.dp.ua/forgot.php", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({user})
    })
      .then(resp => resp.json())
      .then(data => {
        if (data.message) {
          //Тут прописываем логику
        } else {
          //localStorage.setItem("token", data.jwt)
          //dispatch(loginUser(data.user))
        }
      })
  }
}

export const userLoginFetch = user => {
  return dispatch => {
    return fetch("https://site.spilka.dp.ua/login.php", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({user})
    })
      .then(resp => resp.json())
      .then(data => {
        if (data.message) {
         //тут ваша логика
        } else {
          localStorage.setItem("token", data.jwt)
          dispatch(loginUser(data.user))
        }
      })
  }
}

export const getProfileFetch = () => {
  return dispatch => {
    const token = localStorage.token;
    if (token) {
      return fetch("https://site.spilka.dp.ua/profile.php", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
        .then(resp => resp.json())
        .then(data => {
          if (data.message) {
            // Будет ошибка если token не дествительный
            localStorage.removeItem("token")
          } else {
            dispatch(loginUser(data.user))
          }
        })
    }
  }
}

export const logoutUser = () => ({
  type: 'LOGOUT_USER'
})



export const switchMenu = () => ({
  type: 'SWITCH_MENU'
})

