const appData = {
  usersData: undefined,
  loginUserData: undefined,
  currentUserPassword: undefined,
  currentUserLogin: undefined
}

const helpers = {
  validatePassword: function () {
    let pattern = new RegExp('^(?=(.*[a-zA-Z]){1,})(?=(.*[0-9]){2,}).{8,}$')
    let inputToListen = document.getElementById('passwordInput')
    let valide = document.getElementsByClassName('password-error-msg')[0]
    //не очень понимаю, зачем тестировать пароль на входе, а не на регистрации

    if (pattern.test(inputToListen.value)) {
      valide.innerHTML = 'ok'
      this.setCurentUserName()
      appData.currentUserPassword = inputToListen.value
      return true
    } else {
      valide.innerHTML = 'not ok'
      return false
    }
  },
  checkUserAuth: async function () {
    const login = appData.currentUserLogin
    const password = appData.currentUserPassword
    const userData = appData.usersData.find(user => user.login === login)
    if (userData.password === password) {
      window.history.pushState({}, '', '/personal')
      await handleLocation()
      appData.loginUserData = userData
      dataSetters.setUserAuthDataLocalStorage(userData)
      dataFillers.filloutPersonalData()
      helpers.closeModalLoginForm()
      createListeners.logoutButton()
      dataSetters.setLoginButtonText(true)
    }
  },
  setCurentUserName: function () {
    appData.currentUserLogin = document.getElementById('loginInput').value
  },
  resetData: function () {
    appData.usersData = undefined
    appData.loginUserData = undefined
    appData.currentUserPassword = undefined
    appData.currentUserLogin = undefined
  },
  openModalLoginForm: function () {
    document.getElementsByClassName('modal')[0].style.display = 'block'
    createListeners.loginFormCloseButton()
  },
  closeModalLoginForm: function () {
    document.getElementsByClassName('modal')[0].style.display = 'none'
  }
}

const createListeners = {
  loginFormButton: function () {
    let submitbtn = document.getElementsByClassName('modal-submit-button')[0]
    submitbtn.addEventListener('click', async function () {
      if (helpers.validatePassword()) {
        await dataGetters.getUserData()
        helpers.checkUserAuth()
      }
    })
  },
  logoutButton: function () {
    document
      .getElementsByClassName('personal-page-logout')[0]
      .addEventListener('click', function () {
        helpers.resetData()
        localStorage.removeItem('userData')
        localStorage.removeItem('sessionActive')
        window.history.pushState({}, '', '/')
        handleLocation()
        dataSetters.setLoginButtonText()
      })
  },
  loginButtons: function () {
    const loginButtonHeader = document.getElementsByClassName('login-header')[0]
    const loginButtonMain = document.getElementsByClassName('login-main')[0]

    loginButtonMain.addEventListener('click', function () {
      helpers.openModalLoginForm()
    })
    loginButtonHeader.addEventListener('click', function () {
      if (appData.loginUserData !== undefined) {
        helpers.resetData()
        localStorage.removeItem('userData')
        localStorage.removeItem('sessionActive')
        window.history.pushState({}, '', '/')
        handleLocation()
        dataSetters.setLoginButtonText()
      } else {
        helpers.openModalLoginForm()
      }
    })
  },
  loginFormCloseButton: function () {
    const modalCloseBtn = document.getElementsByClassName('close-modal')[0]

    modalCloseBtn.addEventListener('click', function () {
      helpers.closeModalLoginForm()
    })
  }
}

const dataGetters = {
  getUserData: async function () {
    try {
      let response = await fetch(`http://localhost:9000/usernames`)
      appData.usersData = await response.json()
    } catch (err) {
      console.error(err)
      // Handle errors here
    }
  },
  getLocalUserData: function () {
    if (localStorage.getItem('sessionActive')) {
      dataSetters.setLocalUserData()
    }
  }
}

const dataSetters = {
  setUserAuthDataLocalStorage: function (userData) {
    localStorage.setItem('userData', JSON.stringify(userData))
    localStorage.setItem('sessionActive', true)
  },
  setLocalUserData: function () {
    let localUserData = localStorage.getItem('userData')
    appData.loginUserData = JSON.parse(localUserData)
  },
  setLoginButtonText: function (exit) {
    const navLoginButton = document.getElementsByClassName('login-header')[0]
    if (exit) {
      navLoginButton.innerHTML = 'Выход'
    } else {
      navLoginButton.innerHTML = 'Вход'
    }
  }
}

const dataFillers = {
  filloutPersonalData: function () {
    const userData = appData.loginUserData
    const userName = userData.name
    document.getElementsByClassName(
      'personal-page-greeting'
    )[0].innerHTML = `Привет, ${userName}`
  }
}

window.onload = async function () {
  dataGetters.getLocalUserData()
  createListeners.loginButtons()
  if (appData.loginUserData !== undefined) {
    window.history.pushState({}, '', '/personal')
    await handleLocation()
    dataFillers.filloutPersonalData()
    createListeners.logoutButton()
  }
}

createListeners.loginFormButton()
