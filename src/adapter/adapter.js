








var EOL = '\r\n';
var counter = 0;
var connected = 0;
//Serial2.setup(115200);
//Serial2.setConsole(false);
Serial1.setup(115200,{path:'/dev/ttyAMA0'});
Serial1.println('AT');
console.log("Connecting to SIM900 module");
var gprs = require('SIM900').connect(Serial1, 5 /*reset*/, function(err) {
  //gprs.at.debug();
  //gprs.debug();
  if (err) throw err;
  gprs.connect('everywhere', 'eesecure', 'secure', function(err) {
    if (err) throw err;
    gprs.getIP(function(err, ip) {
      if (err) throw err;
      console.log('IP:' + ip);
      require("net").connect({host:"www.wattu.com",port:'1974'}, function(res) {
        res.on('data', function(d) {
          console.log("--->"+d);
          if(!connected) {
            if(d === 'HELLO PHEV' + EOL) {
              connected = 1;
              res.write('CONNECT ' + process.env.SERIAL);
            } else {
              console.log('Error');
            }
           } else {
             if(connected === 1) {
               if(d === 'OK' + EOL) {
                 console.log('Connected ok');
               } else {
                 console.log('Connection failed : ' + d);
             
               }
             }
           }
        });
      });  
    });
  });
});

if(!wifi) {
wifi.connect('BTHub3-HSZ3', { password: 'simpsons' },
    function (err) {
        if (err) {
            console.log(err);
        } else {
            net.connect({ host: '192.168.1.150', port: '1974' }, function (socket) {
                socket.on('data', function (data) {
                    console.log(data);
                    if (data === 'HELLO PHEV' + eol) {
                        socket.write('CONNECT 12345' + eol);
                    }
                });
            });
        }
    });

wifi.startAP(process.env.SERIAL, null, function () {
    console.log('AP Started ' + process.env.SERIAL);
    var http = require('http');
    http.createServer(function (req, res) {
        res.writeHead(200);
        res.end('Hello World');
    }).listen(8080);
    console.log('Server Started ');
});
}
