(function() {
  //Catch form submits and redirect them to controller
  $(document).on("submit", "form", function(e) {
    e.preventDefault();
    var action = e.target.action.split('#')[1];
    var params = {
      form: $(e.target),
      action: action
    };
    Routes.matchRoute('#' + action, $(e.target).attr('method'), params);
  });

  //Update language on links when new links appear in dom
  $('body').on('DOMNodeInserted', 'a', function(e) {
    updateLocaleOnLink(e.target);
  });

  // CONTROLLER
  Controller = function(obj) {
    $.extend(this, obj);

    if(typeof this.initialize === 'function') {
      this.initialize();
    }
  };

  Controller.stat = function() {
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
    if(!view) { throw 'View must be defined!'}

    $.ajax({
      url: viewDir + view + '.html',
      dataType: 'html'
    }).done(function(data) {

      //Load locale before render
      Routes.loadLocale(function() {
        obj.data = obj.data || {};
        //If obj.data hasn't attribute t then add it for translations
        if(!obj.data.t && !isEmptyObject(Application.t)) {
          obj.data.t = Application.t;
        }

        $(selector).html(Mustache.render(data, obj.data));
        if(typeof callback === 'function') { callback(); }
      });

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

  Model.put = function(action, data, callback) {
    Model.query('put', action, data, callback);
  }

  Model.query = function(type, action, data, callback) {
    if(typeof data === 'function') {
      callback = data;
    }

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
      //Update locale and continue route matching when done
      this.loadLocale(function() {
        this.matchRoute(window.location.hash, 'get');
      }.bind(this));

    }.bind(this));
  };

  Routes.prototype.initialize = function() {
    this.loadLocale(function() {
      this.matchRoute(window.location.hash, 'get');
    }.bind(this));
  };

  Routes.prototype.matchRoute = function(path, type, params) {
    var pathSlices = path.split('/');

    //Remove locale from path
    if(parseLocaleFromUrl() != null && type == 'get') {
      pathSlices.splice(1, 1);
      path = pathSlices.join('/');
    }

    //Match obvious paths like /users/blank
    for(var route in this.obj) {
      var routeSlices = route.split('/');
      if(type + path == route) {
        this.obj[route](params);
        Application.currentPath = path.substr(1);
        return;
      }
    }

    //Match paths with params
    for(var route in this.obj) {
      var routeSlices = route.split('/');

      if((type + pathSlices[0] == routeSlices[0]) && pathSlices.length == routeSlices.length) {
        var urlParams = mapParams(pathSlices, routeSlices);
        if(isEmptyObject(urlParams)) { continue; }
        $.extend(urlParams, params);
        this.obj[route](urlParams);
        Application.currentPath = path.substr(1);
        return;
      }
    }
  };

  Routes.prototype.loadLocale = function(callback) {
    //Callback at once when there are no locales in application
    if(typeof Application.locales === 'undefined' || Application.locales.length == 0) {
      callback();
      return;
    }

    //Load locale from URL or default if that locale is not yet loaded
    var localeToLoad = parseLocaleFromUrl() || Application.locales[0];
    if(Application.locale == localeToLoad) { callback(); return;}

    if(Application.locale != null) { location.reload(); };

    $.ajax({
      url: Application.localesLocation + localeToLoad + '.json',
      dataType: 'json'
    }).done(function(data) {
      Application.locale = localeToLoad;
      Application.t = data;
      callback();
    });
  };

  // HELPERS
  function updateLocaleOnLink(link) {
    var oldHref = $(link).attr('href');
    //If link does not start with #, skip
    if(oldHref[0] != "#") { return true; }

    var localeInOldHref = getLocaleFromHref(oldHref);
    //If locale already matches with new locale, skip
    if(localeInOldHref == Application.locale) { return true; }

    //If there is some other locale set in href, update it to new locale
    if(localeInOldHref != null) {
      var oldHrefParts = oldHref.split('/');
      //If locale was reset, then remove locale pathPart
      if(Application.locale == null) {
        oldHrefParts.splice(1,1);
      } else {
        oldHrefParts[1] = Application.locale;
      }

      var newHref = oldHrefParts.join('/');
    } else {
      //Otherwise add locale to href
      var newHref = '#/' + Application.locale + oldHref.substr(1);
    }

    //Update href
    $(link).attr('href', newHref);
  }

  function getLocaleFromHref(href) {
    var splits = href.split('/');
    if($.inArray(splits[1], Application.locales) != -1) {
      return splits[1];
    }
    return null;
  }

  function parseLocaleFromUrl() {
    var hash = window.location.hash;
    var localeInUrl = hash.split('/')[1];
    if($.inArray(localeInUrl, Application.locales) != -1) { return localeInUrl; }
    return null;
  }

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
    if(typeof obj === 'undefined') { return true;}
    for(var prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        return false;
      }
    }
    return true;
  }
})();
