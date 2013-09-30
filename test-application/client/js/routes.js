Routes = new Routes({
  'get': function() { UsersController.index(); },
  'get#': function() { UsersController.index(); },
  'get#/': function() { UsersController.index(); },

  'get#/customers': function() { CustomersController.index(); },
  'get#/users': function() { UsersController.index(); },
  'get#/users/blank': function() { UsersController.blank(); },
  'get#/users/:id': function(params) { UsersController.show(params); },
  'post#/users': function(params) { UsersController.create(params); },
  'delete#/users/:id': function(params) { UsersController.destroy(params); },
  'get#/users/:id/edit': function(params) { UsersController.edit(params); },
  'put#/users/:id': function(params) { UsersController.update(params); }
});