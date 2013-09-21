// CONTROLLER

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

  $.ajax({
    url: viewDir + view + '.html',
    dataType: 'html'
  }).done(function(data) {
    $(selector).html(Mustache.render(data, obj.data));
  });
};

Controller.prototype.renderLayout = function(callback) {
  $.ajax({
    url: this.layout() + '.html',
    dataType: 'html'
  }).done(function(data) {
    $('body').html(Mustache.render(data));
    callback();
  });
};

Controller.prototype.redirect = function(path) {
  window.location.hash = '#' + path;
};

Controller.prototype.extend = function(obj) {
  var retController = new Controller();
  $.extend(retController, this);
  $.extend(retController, obj);
  return retController;
};

$(document).on("submit", "form", function(e) {
  e.preventDefault();
  var action = e.target.action.split('#')[1];
  var route = $(e.target).attr('method') + '#' + action
  var params = {
    form: $(e.target),
    action: action
  };
  Routes.obj[route](params);
});


// MODEL

Model = function(obj) {};

Model.get = function(action, data, callback) {
  if(typeof data === 'function') {
    callback = data;
  }

  $.ajax({
    type: 'get',
    url: Application.apiUrl + action,
    data: data,
    dataType: "json"
  }).done(function(data) {
    if(callback) { callback(data); }
  });
};

Model.post = function(action, data, callback) {
  if(typeof data === 'function') {
    callback = data;
  }

  $.ajax({
    type: 'post',
    url: Application.apiUrl + action,
    data: data,
    dataType: "json"
  }).done(function(data) {
    if(callback) { callback(data); }
  });
};
// ROUTES

Routes = function(obj) {
  this.obj = obj;
  $(window).on('hashchange', function() {
    this.hashchange();
  }.bind(this));
};

Routes.prototype.hashchange = function() {
  for(var x in this.obj) {
    if('get' + window.location.hash == x || 'get' + window.location.hash == x) {
      this.obj[x]();
    }
  }
};

// HELPERS
function getAttr(attr, def) {
  if(typeof attr === 'function') {
    return attr();
  }

  return attr || def;
}