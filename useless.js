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
  var urlHash = window.location.hash;
  var hashSlices = urlHash.split('/');

  for(var path in this.obj) {
    var pathSlices = path.split('/');

    //Match obvious paths like /users/blank
    if('get' + urlHash == path) {
      this.obj[path]();
      return;
    }

    //Match paths with params
    if(('get' + hashSlices[0] == pathSlices[0]) && hashSlices.length == pathSlices.length) {
      var params = mapParams(hashSlices, pathSlices);
      if(isEmptyObject(params)) { continue; }
      this.obj[path](params);
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

function mapParams(hashSlices, pathSlices) {
  var params = {};

  for(var i in pathSlices) {
    if(pathSlices[i][0] == ':') {
      params[pathSlices[i].substr(1)] = hashSlices[i];
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