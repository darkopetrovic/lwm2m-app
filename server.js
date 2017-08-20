var express = require('express');
var path = require('path');

var app = express();
var pathToApp = __dirname + '/public';

// app.use('/static', express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));


app.get("*",function(req, res){
    console.log("send file", path.join(__dirname, 'public', 'index.html'));
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// app.get('*', (req, res) => {
//     console.log("send file");
//     res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
// });

// app.get('/', function(req, res) {
//     res.sendFile(pathToApp + '/index.html');
// });

app.listen(3000, function () {
    console.log('Listening on port 3000!');
});