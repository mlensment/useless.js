var ApplicationController = new Controller({
  layout: function() {
    return '/views/layouts/main'
  }
});

var UsersController = ApplicationController.extend({
  viewDir: '/views/users/',
  container: '#content',

  index: function index() {
    this.render();
  },

  show: function show(id) {
    this.render();
  }
});

$(document).ready(function() {

});
