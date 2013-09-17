var ApplicationController = new Controller({
  layout: function() {
    return '/views/layouts/main'
  },

  initialize: function() {
    this.renderHeader();
    this.renderFooter();
  },

  renderHeader: function() {

  },

  renderFooter: function() {

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
