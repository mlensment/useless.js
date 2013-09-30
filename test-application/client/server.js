var path = require('path');
var express = require('express');
var app = express();


app.use(express.static(__dirname));

app.get('/js/lib/useless.js', function(req, res){

  res.sendfile(path.resolve('../../useless.js'));
});

app.listen(3000);

