// 서버 사용을 위해 http모듈을 http라는 변수에 담는다.
var http = require('http');
var fs = require('fs');

// http모듈로 서버를 생성한다. 
var app = http.createServer(function(req,res){
  var url = req.url;
    if(req.url == '/'){
      url = '/index.html';
    }
    if(req.url == '/favicon.ico'){
      return res.writeHead(404);
    }
    res.writeHead(200);
    res.end(fs.readFileSync(__dirname + url));
 
});

// listen 함수로 3000 포트에 서버를 실행한다.
app.listen(3000, function(){
  console.log("server is running.")
});