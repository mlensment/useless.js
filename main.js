var Application = {
  apiUrl: 'http://localhost:3001'
};

var ApplicationController = new Controller({
  layout: function() {
    return 'main'
  },

  viewDir: 'views/layouts/',

  initialize: function() {
    this.render({ view: this.layout() }, function() {
      this.renderHeader();
      this.renderFooter();
      Routes.initialize();
    }.bind(this));
  },

  renderHeader: function header() {
    this.render({ container: '#header' });
  },

  renderFooter: function footer() {
    this.render({ container: '#footer' });
  }
});

var UsersController = ApplicationController.extend({
  viewDir: '/views/users/',
  container: '#content',

  blank: function blank() {
    this.render();
  },

  create: function create(params) {
    Model.post(params.action, params.form.serialize(), function(data) {
      this.redirect('/users/' + data.id);
    }.bind(this));
  },

  index: function index() {
    Model.get('/users', function(data) {
      this.render({view: 'index', data: data});
    }.bind(this));
  },

  show: function show(params) {
    Model.get('/users/' + params.id, function(data) {
      this.render({view: 'show', data: data});
    }.bind(this));
  },

  destroy: function(params) {
    Model.delete('/users/' + params.id, function() {
      this.redirect('/users');
    }.bind(this));
  }
});


var CustomersController = ApplicationController.extend({
  viewDir: '/views/customers/',
  container: '#content',

  index: function index() {
    this.render();
  },

  show: function show(id) {
    this.render();
  }
});

var Routes = new Routes({
  'get#/customers': function() { CustomersController.index(); },
  'get#/users': function() { UsersController.index(); },
  'get#/users/blank': function() { UsersController.blank(); },
  'get#/users/:id': function(params) { UsersController.show(params); },
  'post#/users': function(params) { UsersController.create(params); },
  'delete#/users/:id': function(params) { UsersController.destroy(params); }
});
