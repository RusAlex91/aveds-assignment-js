const route = event => {
  event = event || window.event
  event.preventDefault()
  window.history.pushState({}, '', event.target.href)
  handleLocation()
}

const routes = {
  404: '../pages/404.html',
  '/': '../pages/home.html',
  '/contacts': '../pages/contacts.html',
  '/personal': '../pages/personal.html'
}

const handleLocation = async () => {
  const path = window.location.pathname
  const route = routes[path] || routes[404]
  const html = await fetch(route).then(data => data.text())
  document.getElementById('main').innerHTML = html
}

window.onpopstate = handleLocation
window.route = route

handleLocation()
