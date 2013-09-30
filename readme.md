First of all, this library is so useless that it's absolutely pointless and hence, DON'T USE IT.
# What's useless?

It is a javascript library (sort of like backbone or angular, but by far simpler).
It gives Rails like structure for your project, but it's javascript.

I know there are a lot of global objects, but you know what, [deal with it](http://i.pikstra.com/pics/21766.gif). It seems normal to me, that you can access controllers from routes and models from controllers without any restrictions.

Note that this is an absolute alpha version of this library. Everything could change without any notice.

Tests? Are you kidding me? It's so useless it doesn't have any.

##So how does one create an app with useless.js?

In this tutorial I'm gonna create a simple tasklist. No additionals features, for the sake of simplicity.

I am going to use [rails-api](https://github.com/rails-api/rails-api) gem for API so make sure you have ruby and rails-api gem installed before following this tutorial.

And for the client I'm going to use [node.js](http://nodejs.org/) and [express.js](http://expressjs.com/) to serve our files. So make sure you have those as well. Or you can just put useless to rails-api public folder. I just prefer if client and API are separate projects.

## Creating an API for useless

Firstly, because useless is completely dependent on API (if you need to create an offline web application, you are in the wrong place man), we need a backend.

You can choose whichever technology or framework you prefer. PHP (Yii), Ruby (Rails), Java (Play), whatever. I'm gonna use rails-api gem because it's the simplest way to create an API. If you want to use something else, then scroll down to see how to actually use useless.

Open command line and navigate to directory where you want to create your API.

We need to make an API for useless to use. Hopefully you have rails-api gem installed already.

`rails-api new server`

For enabling crossdomain requests, we need to install another gem into the system.

**/Gemfile**

`gem 'rack-cors', :require => 'rack/cors'`

On the command line, run `bundle` while being in project directory.

Next .. some extra configuration has to be done to actually enable the gem.
We will add a few lines in between a specific block in application configuration.

**/config/application.rb**

```ruby
### other code ###
class Application < Rails::Application
  config.middleware.use Rack::Cors do
    allow do
      origins '*'
      resource '*', :headers => :any, :methods => [:get, :post, :delete, :put, :options]
    end
  end
end
### other code ###
```

So finally our groundwork with rails-api is done and we can add our Task model and controller actions.
Run this in your project directory:

`rails-api generate scaffold Task name:string completed:boolean --no-test-framework`

`rake db:migrate`

This creates controller for tasks and model as well.

Let's fire up our API on port 3001: `rails s -p 3001`

At this point our basic API is completed and finally we can go to useless, which this tutorial is really about.

## Creating useless client
### Hello World!
Because useless is only an alpha, it hasn't got any generators so everything must be done by hand.

Open command line and navigate to directory where you want to create your useless app.
We need to create a directory structure for our application:

app
  controllers
  views
    tasks
js
  lib

To do this, I wrote a small script wich you need to copy and paste to your command line.

`mkdir -p app/controllers app/views/tasks js/lib`

We need to download five files. jquery.js, mustache.js, useless.js, server.js and package.json.
First two because useless has two hard dependencies. [JQuery](http://jquery.com/) and [https://github.com/janl/mustache.js](Mustache).

TODO: Write here wget things

Once you have these files, run `npm install` to install express (for static file serving).
Note: You can choose witchever server you prefer to serve static files (Apache, nginix).

You can already start up server by typing `node server.js`

The main configuration file is called **application.js** and it resides typically in **js** directory. Of course, useless does not set boundaries for file placement.

**/js/application.js**

```javascript
Application = {
  apiUrl: 'http://localhost:3001'
};

ApplicationController.initialize();
```

Pretty straightforward stuff. `ApplicationController.initialize();` will kick off the application.

Controllers are responsible for getting data from API and rendering it.  
Next we need application controller. Just like Rails.

**/app/controllers/applicationController.js**

```javascript
ApplicationController = new Controller({
  initialize: function() {
    Routes.initialize();
  }
});
```

Little more interesting, isn't it.

Initialize is the entry point for the application. We can kick off the first request by calling `Routes.initialize();` We will get into Routes in a moment, for now, let's keep to controllers

Next, tasks contoller.

**/app/controllers/tasksController.js**

```javascript
TasksController = ApplicationController.extend({
  viewDir: '/app/views/tasks/',

  index: function() {
    this.render({view: 'index'});
  }
});
```

`viewDir` defines the path where views for this controller reside in.

`index` function is for listing all tasks. At the moment, we just render the index view.

Next, we need a view for the index function we just created. Again, pretty straightforward.  

**/app/view/tasks/index.html**

```html
Hello World!
```

And last, but not least, we need to define Routes object.

**/js/routes.js**

```javascript
Routes = new Routes({
  'get#/tasks': function() { TasksController.index(); }
});
```

So it catches get request on url `http://localhost:3000/#/tasks` and calls `TasksController.index();`

All this logic, we have written, must be called from a static file. Our last file for now will be index.html

**/index.html**

```html
<!doctype html>
<html lang="en">
  <head>
    <title>Useless.js</title>
    <meta charset="utf-8">
  </head>
  <body>
    <script src="js/lib/jquery.min.js"></script>
    <script src="js/lib/mustache.js"></script>
    <script src="js/lib/useless.js"></script>
    <script src="js/routes.js"></script>
    <script src="app/controllers/applicationController.js"></script>
    <script src="app/controllers/tasksController.js"></script>
    <script src="js/application.js"></script>
  </body>
</html>

```

Actually there are some other options how to include all necessary files, but for this tutorial, I will stick to this simple html that everyone understands.

At this point, we are ready to try out our application. Open browser and go to `http://localhost:3000/#/tasks`.

If everything went right, you should see Hello World! displayed to you.

### Link it to the API

Next, we are going to tie the basic application to our API.

To list some tasks, we need to have some data. So we will have to make a form to add some data.

**/app/views/tasks/blank.html**

```html
<form method="post" action="#/tasks">
  Task name: <input type="text" name="post[name]" />
  <button>Submit!</button>
</form>
```

For this view, we have to add a function to `TasksController` which renders the form.

We need to create a new controller method.

**/app/controllers/tasksController.js**

```javascript
blank: function() {
  this.render({ view: 'blank' });
}
```

And now we need to create a route for this view.

**/js/routes.js**

```javascript
'get#/tasks/blank': function() { TasksController.blank(); }
```

Navigate your browser to `http://localhost:3000/#/tasks/blank`

Success, now we have to create an action to really submit the form.

**/app/controllers/tasksController.js**

```javascript
create: function(params) {
  Model.post(params.action, params.form.serialize(), function(data) {
    this.redirect('/tasks/' + data.id);
  }.bind(this));
},

show: function(params) {
  Model.get('/tasks/' + params.id, function(data) {
    this.render({view: 'show', data: data});
  }.bind(this));
}
```

This gets interesting. We made two new actions. One for creating the task and other for showing it. Can you see how we draw the lines already with Rails?

`Model.post(...)` posts form to API and then redirects application to `http://localhost:3000/tasks/1`.

`Model.get(...)` gets data from API and then renders show.html

Remeber this line we added to blank.html? `<form method="post" action="#/tasks">`
We will now fashion a new route out of this.

**/js/routes.js**

```javascript
'get#/tasks/:id': function(params) { TasksController.show(params); },
'post#/tasks': function(params) { TasksController.create(params); }
```

`get#...` executes `TasksController.show(params);` Notice the `params` we now pass into the method. In this case, `params.id` is equal to task id we need to show.

`post#...` executes `TasksController.create(params);` `params` in this holds the entire form and for the sake of simplicity, also the action where the form should post. You can try to console.log everything out to see it for yourself.

Now, all we need is a show.html

**/app/views/show.html**

```html
Task name: {{name}}<br />
Done:
{{#completed}}yup{{/completed}}
{{^completed}}nope{{/completed}}<br />
<a href="#/tasks">Go to all tasks</a>
```

Useless uses Mustache templating language. That means, name and completed values come from API.

Open browser again `http://localhost:3000/#/tasks/blank`, type in task name and hit Submit!  
Useless makes a request to API to save the task, then redirects you to `http://localhost:3000/#/tasks/1`, asks API for data and then displays it.

To display all tasks, lets make some changes to index method and index.html view.

**/app/controllers/tasksController.js**

```javascript
index: function() {
  Model.get('/tasks', function(data) {
    this.render({view: 'index', data: data});
  }.bind(this));
}
```

**/app/views/tasks/index.html**

```html
{{#.}}
  Task name: {{name}}<br />
  Done:
  {{#completed}}yup{{/completed}}
  {{^completed}}nope{{/completed}}<br />
  <a href="#/tasks/{{id}}">Edit</a>
  <br /><br />
{{/.}}
```

Pretty intuitive. If you want to learn more about mustache.js, refer to their [github](https://github.com/janl/mustache.js).

Lastly, we need a way to edit the task. I already created edit links to index, we now just need to hook up functionality.

Instead of setting up a new route to edit view, I'm just gonna improve show.html for now.

**/app/views/show.html**

```html
<form method="put" action="#/tasks/{{id}}">
  Task name: <input type="text" name="task[name]" value="{{name}}" /><br />
  Done:
  <input type="hidden" name="task[completed]" value="false"/>
  <input type="checkbox" name="task[completed]" {{#completed}}checked{{/completed}} /><br />
  <button>Save</button>
</form>
<br />
<a href="#/tasks">Go to all tasks</a>
```

**/app/controllers/tasksController.js**

```javascript
update: function(params) {
  Model.put('/tasks/' + params.id, params.form.serialize(), function() {
    this.redirect('/tasks/' + params.id);
  }.bind(this));
}
```

**/js/routes.js**

```javascript
  'put#/tasks/:id': function(params) { TasksController.update(params); }
```

And that's useless!
