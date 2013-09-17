Model = function(obj) {

};

Controller = function(obj) {
  $.extend(this, obj);
};

Controller.stat = function() {
  console.log('static');
};

Controller.prototype.render = function(view) {
  view = view || arguments.callee.caller.name;
  this.loadLayout(function() { this.loadView(view) }.bind(this));
};

Controller.prototype.loadView = function(view) {
  var selector = getAttr(this.container, 'body')
  var viewDir = getAttr(this.viewDir);
  $(selector).load(viewDir + view + '.html');
};

Controller.prototype.loadLayout = function(callback) {
  $('body').load(this.layout() + '.html', function() {
    callback();
  });
};

Controller.prototype.extend = function(obj) {
  $.extend(this, obj);
  return this;
};


// HELPERS
function getAttr(attr, def) {
  if(typeof attr === 'function') {
    return attr();
  }

  return attr || def;
}