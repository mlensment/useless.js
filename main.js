var ApplicationController = new Controller({
  layout: function() {
    return '/views/layouts/main'
  },

  initialize: function() {
    this.renderLayout(function() {
      this.renderHeader();
      this.renderFooter();
    }.bind(this));
  },

  renderHeader: function header() {
    this.renderView({ viewDir: 'views/layouts/', container: '#header' });
  },

  renderFooter: function footer() {
    this.renderView({ viewDir: 'views/layouts/', container: '#footer' });
  }
});

var UsersController = ApplicationController.extend({
  viewDir: '/views/users/',
  container: '#content',

  index: function index() {
    this.renderView();
  },

  show: function show(id) {
    this.renderView();
  },


});

$(document).ready(function() {

});
