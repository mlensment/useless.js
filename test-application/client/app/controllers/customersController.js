CustomersController = ApplicationController.extend({
  viewDir: '/app/views/customers/',
  container: '#content',

  index: function() {
    this.render({ view: 'index' });
  },

  show: function(id) {
    this.render({ view: 'show' });
  }
});