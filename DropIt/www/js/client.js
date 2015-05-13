/**
 * Created by tmrlvi on 4/30/15.
 */


//var SERVER_ADDRESS = 'http://132.65.249.127:3000'; // Audituriom Address
//var SERVER_ADDRESS = 'http://132.65.250.197:3000'; // Aquirium Address
var SERVER_ADDRESS = 'http://ec2-54-191-148-244.us-west-2.compute.amazonaws.com:8000'; // Amazon Address


var module = angular.module("socket.io", []);

module.provider("$socket", function $socketProvider(){
    var server = io(SERVER_ADDRESS);

    this.getTags = function(){
        console.log("in get tags");
        navigator.wifi.getAccessPoints(function (accessPoints) {
                var chosen = null;
                for (var index in accessPoints){
                    if (chosen === null || accessPoints[index].level > chosen.level){
                        chosen = accessPoints[index];
                    }
                }

                server.emit('getTags', {
                    'BSSID' : chosen.BSSID,
                    'user' : cordova.plugins.uid.IMEI
                });
            },
            function (error) {
                server.emit('getTags', {
                    'BSSID' : "None",
                    'user' : "None"
                })
            });
    };

    server.on("connect", this.getTags);
    server.on("connect_error", function(err){ alert("Connection error: " + err.message); }); // TODO: show in gui
    server.on("connect_timeout", function() { console.log("connect_timeout!" ); });
    server.on("diconnect", function(){ console.log("disconnect"); });

    this.$get = function $socketFactory($rootScope) {
        return {
                on : function on(event, callback){
                    server.on(event, function(data){
                        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments
                        var args = arguments;

                        $rootScope.$apply(function () {
                            // este callback.apply regista a função callback que
                            // poderá conter referencias à variavel socket
                            callback.apply(server, args);
                        });
                    });
                },
                emit : function emit(event, data){
                    server.emit(event, data);
                }
        }
    };

});


