var express = require('express'),
    app = express();

//Express 3
//app.configure(function() {
//    app.use(express.static(__dirname, '/'));
//});

//Express 4
app.use(express.static(__dirname, '/'));



app.get('/clientrelationships', function(req, res) {
    res.json(clients);
    //res.json(500, { error: 'An error has occurred!' });
});

app.listen(8080);

console.log('Express listening on port 8080');

        var clients = [
 
        ];