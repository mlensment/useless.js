var Application = {
  apiUrl: 'http://localhost:3001',
  locales: ['et', 'en']
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

  renderHeader: function() {
    this.render({ view: 'header', container: '#header' });
  },

  renderFooter: function() {
    this.render({ view: 'footer', container: '#footer' });
  }
});

var UsersController = ApplicationController.extend({
  viewDir: '/views/users/',
  container: '#content',

  blank: function() {
    this.render({ view: 'blank' });
  },

  create: function(params) {
    Model.post(params.action, params.form.serialize(), function(data) {
      this.redirect('/users/' + data.id);
    }.bind(this));
  },

  index: function() {
    Model.get('/users', function(data) {
      this.render({view: 'index', data: data});
    }.bind(this));
  },

  show: function(params) {
    Model.get('/users/' + params.id, function(data) {
      this.render({view: 'show', data: data});
    }.bind(this));
  },

  edit: function(params) {
    Model.get('/users/' + params.id, function(data) {
      this.render({view: 'edit', data: data});
    }.bind(this));
  },

  update: function(params) {
    Model.put('/users/' + params.id, params.form.serialize(), function() {
      this.redirect('/users/' + params.id);
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

  index: function() {
    this.render({ view: 'index' });
  },

  show: function(id) {
    this.render({ view: 'show' });
  }
});

var Routes = new Routes({
  'get': function() { UsersController.index(); },
  'get#/customers': function() { CustomersController.index(); },
  'get#/users': function() { UsersController.index(); },
  'get#/users/blank': function() { UsersController.blank(); },
  'get#/users/:id': function(params) { UsersController.show(params); },
  'post#/users': function(params) { UsersController.create(params); },
  'delete#/users/:id': function(params) { UsersController.destroy(params); },
  'get#/users/:id/edit': function(params) { UsersController.edit(params); },
  'put#/users/:id': function(params) { UsersController.update(params); }
});
