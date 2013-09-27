#

So how does one create an app with useless.js?

In this tutorial I'm gonna create a simple tasklist.

## Creating an API for useless

Firstly, because useless is completely dependent on API (if you need to create an offline web application, you are in the wrong place man), we need a backend.

You can choose whichever technology or framework you prefer. PHP (Yii), Ruby (Rails), Java (Play), whatever. I'm gonna use [https://github.com/rails-api/rails-api](rails-api) gem because it's the simplest way to create an API. If you want to use something else, then scroll down to see how to actually use useless.

Open command line and navigate to directory where you want to create your API.

We need to make an API for useless to use. Hopefully you have [https://github.com/rails-api/rails-api](rails-api) installed already.

`rails-api new server`

For enabling crossdomain requests, we need to install another gem into the system.

Into newly created project's your **Gemfile** add the following line:
`gem 'rack-cors', :require => 'rack/cors'`

And in the project's directory, run `bundle` in your command line.

Next .. some extra configuration has to be done to actually enable the gem.
Open **config/application.rb** and add a few lines in between a specific block.

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

This creates controller for tasks and model as well.

Let's fire up our API on port 3001: `rails s -p 3001`

At this point our basic API is completed and finally we can go to useless, which this tutorial is really about.

## Creating useless

Open command line and navigate to directory where you want to create your useless app.

Because useless is only an alpha, it hasn't got any generators so everything must be done by hand.
