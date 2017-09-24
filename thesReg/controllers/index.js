
var IndexController = {
  getIndex: function(request, response) {
    if(request.user) {
      response.render('index', {
        title: 'Totes logged in',
        user: request.user,
        loggedIn: true
      })
    } else {
      response.render('index', {
        title: 'Not logged in',
        loggedIn: false
      })
    }
  }
}

module.exports = IndexController;