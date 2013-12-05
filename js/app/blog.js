var app = angular.module('app', [ "ngResource" ]);

app.controller("users", function($scope, User) {

  $scope.users = [];

  User.fetch(function(users) {
    $scope.users = users;
  });



});

app.factory("User", function($http, $resource) {

  return {
    fetch : function(cb) {
      cb([
        { name : "Eugene", email : "eugegim@gmail.com" }
      ])
    }
  };

});

app.directive("collection", function() {

  return {
    restrict : "E",

    scope : {
      "items" : "="
    },

    compile : function(el, attrs) {
      var itemTemplate = el.text();
      el.html('<ul><li ng-repeat="item in items">' + itemTemplate + '</li></ul>');
    }

  };

});


// relevant commit
https://github.com/angular/angular.js/commit/d0efd5eefcc0aaf167c766513e152b74dd31bafe#commitcomment-4755033

// using compile service in link
http://plnkr.co/edit/CWMUwWzQnmiBDfiUoInz?p=preview


working demo! using transclusion

http://jsbin.com/iPIbubA/20/edit

got it. so in conclusion....if you are hacking a custom template yourself in compile....it will not get an isolate scope...but if you specific an entire template...it will http://jsbin.com/iPIbubA/18/edit?