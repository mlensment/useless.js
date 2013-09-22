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

Controller.prototype.render = function(obj, callback) {
  obj = obj || {};

  if(typeof obj === 'function') {
    callback = obj;
  }

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
    if(typeof callback === 'function') { callback(); }
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
  var params = {
    form: $(e.target),
    action: action
  };

  Routes.matchRoute('#' + action, $(e.target).attr('method'), params);
});

// MODEL
Model = function(obj) {};

Model.get = function(action, data, callback) {
  Model.query('get', action, data, callback);
};

Model.post = function(action, data, callback) {
  Model.query('post', action, data, callback);
};

Model.delete = function(action, data, callback) {
  Model.query('delete', action, data, callback);
}

Model.query = function(type, action, data, callback) {
  if(typeof data === 'function') {
    callback = data;
  }

  console.log({
    type: type,
    url: Application.apiUrl + action,
    data: data,
    dataType: "json"
  });

  $.ajax({
    type: type,
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
    this.matchRoute(window.location.hash, 'get');
  }.bind(this));
};

Routes.prototype.initialize = function() {
  this.matchRoute(window.location.hash, 'get');
};

Routes.prototype.matchRoute = function(path, type, params) {
  var pathSlices = path.split('/');

  for(var route in this.obj) {
    var routeSlices = route.split('/');

    //Match obvious paths like /users/blank
    if(type + path == route) {
      this.obj[route](params);
      return;
    }

    //Match paths with params
    if((type + pathSlices[0] == routeSlices[0]) && pathSlices.length == routeSlices.length) {
      var urlParams = mapParams(pathSlices, routeSlices);
      if(isEmptyObject(urlParams)) { continue; }
      $.extend(urlParams, params);
      this.obj[route](urlParams);
      return;
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

function mapParams(pathSlices, routeSlices) {
  var params = {};

  for(var i in routeSlices) {
    if(routeSlices[i][0] == ':') {
      params[routeSlices[i].substr(1)] = pathSlices[i];
    }
  }

  return params;
}

function isEmptyObject(obj) {
  for(var prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }
  return true;
}
