
var IndexController = {
  getIndex: function(request, response) {
    if(request.user) {
      response.render('index', {
        user: request.user,
        loggedIn: true
      })
    } else {
      response.render('index', {
        loggedIn: false
      })
    }
  }
}

module.exports = IndexController;