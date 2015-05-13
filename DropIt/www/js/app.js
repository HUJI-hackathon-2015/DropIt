// TODO: actually make it communications between controllers
var TagsController;

(function(){
    var ngApp = angular.module('dropIt', ["socket.io"]);

    ngApp.controller("RoomController", function($scope, $socket){
        TagsController = this;

        this.name = "Waiting for WiFi";
        this.tags = {};

        this.createLabel = function(){
            var name = prompt("New Label Name");
            // If not canceled
            if (name !== null) {
                $socket.emit("newLabel", {'name': name})
            }
        };

        // TODO: should make option to send file directly instead
        this.joinTag = function(tag){
            console.log("joined!!!!");
            $socket.emit('joinLabel', {'name': tag});
        };

        // Callbacks from socket
        $socket.on("getTags", function(data){
            $scope.user = data["user"];
            $scope.room.name = data["user"] + "@" + data["location"];
            $scope.room.tags = data["labels"];
        });

        $socket.on("addedLabel", function(data){
            // TODO: population + to sort
            $scope.room.tags.push({ "name" : data["name"] });
            $socket.emit('addedLabel', { 'status' : 'OK' });
        });

        this.tagName = "";
        this.tagMembers = {};

        this.partTag = function(){
            console.log("Parted!!!!");
            if ($scope.room.tagName !== "") {
                $socket.emit('partLabel', {'name': $scope.room.tagName});
                $scope.room.tagName = ""
            }
        };

        $socket.on("joinLabel", function(data) {
            console.log($scope);
            $scope.room.partTag();
            $scope.room.tagName = data["name"];
            $scope.room.tagMembers = data["members"];
        });

    });

    ngApp.controller("ChatController", function($scope, $socket){
        this.message = "";
        this.messages = [
            {
                "user" : "test1",
                "text" : "adsadas",
                "fromMe" : false,
                "url" : null
            },
            {
                "user": "test2",
                "text": "Send Att: 3213213",
                "fromMe": false,
                "url" : "http://www.google.com/"
            },
            {
                "user" : "Tomer",
                "text" : "adsadas",
                "fromMe" : true,
                "url" : null
            }
        ];

        this.postMsg = function() {
            console.log($scope);
            $socket.emit('postMsg', {
                "label":  $scope.user,
                "type": "text",
                "content": $scope.chat.message
            });
            this.messages.push({
                "user" : $scope.user,
                "text" : $scope.chat.message,
                "fromMe" : true
            });
            this.message = "";
        };

        this.postFile = function(image, fName){
            alert("posting file");
            $socket.emit('postMsg', {
                "label" : $scope.room.tagName,
                "type" : "file",
                "content" : image,
                "fileName" : fName
            });
        };

        this.openFile = function(uri){
            if (uri !== null) {
                window.plugins.webintent.startActivity({
                        action: window.plugins.webintent.ACTION_VIEW,
                        url: uri
                    },
                    function () {
                    },
                    function () {
                        alert('Failed to open URL via Android Intent');
                    });
            }
        };

        this.takePicture = function(){
                navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                    destinationType: Camera.DestinationType.DATA_URL
                });

                function onSuccess(imageData) {
                    console.log("got image");
                    var date = new Date();
                    var fName = Math.round(Math.random()*1000000) + ".jpg";
                    console.log("posting");
                    alert("Trying to send");
                    alert($scope.chat);
                    alert($scope.chat.postFile);
                    $scope.chat.postFile(imageData, fName);
                }

                function onFail(message) {
                    alert(message);
                }
        };

        $socket.on("msgPosted", function(data){
            if (data["type"] == "text") {
                $scope.chat.messages.push({
                        "user" : data["user"],
                        "text" : data["content"],
                        "fromMe" : false,
                        "url" : null
                    });
            } else if  (data["type"] == "file") {
                if ($scope.user === data["user"]) {
                    $scope.chat.messages.push({
                        "user" : "me",
                        "text" : "Send Att" + Math.round(Math.random()*1000000), // TODO: cut the filename from the file
                        "fromMe" : true,
                        "url" : data["uri"]
                    });
                } else {
                    $scope.chat.messages.push({
                        "user" : data["user"],
                        "text" : "Send Att" + Math.round(Math.random()*1000000), // TODO: cut the filename from the file
                        "fromMe" : false,
                        "url" : data["uri"]
                    });
                }
            } else {
                alert("Unknown msg recieved")
            }
        });

        document.addEventListener("backbutton", function(){
            // TODO: need a way to control it only in chat
            $scope.$apply(function() {
                if ($scope.room.tagName !== "") {
                    $scope.chat.message = "";
                    $scope.room.partTag();
                } else {
                    navigator.app.exitApp();
                }
            });
        }, false);

    });

})();

// Start app only when device is ready
// TODO: should show loading scrren before
document.addEventListener("deviceready", function() {
    // retrieve the DOM element that had the ng-app attribute
    var domElement = document.querySelector("html");
    angular.bootstrap(domElement, ["dropIt"]);
}, false);