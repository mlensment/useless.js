var ApplicationController = new Controller({
  layout: function() {
    return '/views/layouts/main'
  },

  viewDir: 'views/layouts/',

  initialize: function() {
    this.renderLayout(function() {
      this.renderHeader();
      this.renderFooter();
      Routes.hashchange();
    }.bind(this));
  },

  renderHeader: function header() {
    this.renderView({ container: '#header' });
  },

  renderFooter: function footer() {
    this.renderView({ container: '#footer' });
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

  bla: function() {
    console.log('bla');
  }
});


var CustomersController = ApplicationController.extend({
  viewDir: '/views/customers/',
  container: '#content',

  index: function index() {
    this.renderView();
  },

  show: function show(id) {
    this.renderView();
  }
});

var Routes = new Routes({
  '/customers': function() { CustomersController.index(); },
  '/users': function() { UsersController.index(); }
});

$(document).ready(function() {

});
