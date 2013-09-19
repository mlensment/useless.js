Model = function(obj) {

};

Controller = function(obj) {
  $.extend(this, obj);

  if(typeof this.initialize === 'function') {
    this.initialize();
  }
};

Controller.stat = function() {
  console.log('static');
};

Controller.prototype.render = function(obj) {
  obj = obj || {};
  var view = obj.view || arguments.callee.caller.name;

  this.renderLayout(function() {
    this.renderView({ view: view })
  }.bind(this));
};

Controller.prototype.renderView = function(obj) {
  obj = obj || {};

  var viewDir = obj.viewDir;
  if(!viewDir) {
    viewDir = getAttr(this.viewDir);
  }

  var selector = obj.container;
  if(!selector) {
    selector = getAttr(this.container, 'body')
  }

  var view = obj.view;
  if(!view) {
    view = arguments.callee.caller.name;
  }

  $(selector).load(viewDir + view + '.html');
};

Controller.prototype.renderLayout = function(callback) {
  $('body').load(this.layout() + '.html', function() {
    callback();
  });
};

Controller.prototype.extend = function(obj) {
  var retController = new Controller();
  $.extend(retController, this);
  $.extend(retController, obj);
  return retController;
};


// HELPERS
function getAttr(attr, def) {
  if(typeof attr === 'function') {
    return attr();
  }

  return attr || def;
}