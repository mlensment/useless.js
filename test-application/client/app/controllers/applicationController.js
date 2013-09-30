ApplicationController = new Controller({
  layout: function() {
    return 'main'
  },

  viewDir: '/app/views/layouts/',

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