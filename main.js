var Application = {
  apiUrl: 'http://localhost:3001'
};

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

  blank: function blank() {
    this.renderView();
  },

  create: function create(params) {
    Model.post(params.action, params.form.serialize(), function(data) {
      this.renderView({view: 'show', data: data});
    }.bind(this));
  },

  index: function index() {
    Model.get('/users', function(data) {
      this.renderView({view: 'index', data: data});
    }.bind(this));
  },

  show: function show(id) {
    Model.get('/users/' + id, function(data) {
      this.renderView(data);
    }.bind(this));
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
  '/users': function() { UsersController.index(); },
  '/users/blank': function() { UsersController.blank(); },
  '/users/create': function(params) { UsersController.create(params); }
});
