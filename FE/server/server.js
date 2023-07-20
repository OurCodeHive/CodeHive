const http = require('http');
const express = require('express');
const path = require('path');
const app = express();


app.use(express.json());
var cors = require('cors');
app.use(cors());

app.use(express.static(path.join(__dirname, '../dist')));

const server = http.createServer(app);

app.get('/', function (요청, 응답) {
  응답.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.get('*', function (요청, 응답) {
    응답.sendFile(path.join(__dirname, '../dist/index.html'));
});

  
server.listen(3000)
console.log("3000번포트")