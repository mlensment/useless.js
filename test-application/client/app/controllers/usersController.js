UsersController = ApplicationController.extend({
  viewDir: '/app/views/users/',
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