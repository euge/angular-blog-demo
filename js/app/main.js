var app = angular.module('app', []);

app.controller('people', function($scope) {  
  $scope.data = [
    { name : "Euge", id : 3429 },
    { name : "Bob", id : 1234 },
    { name : "Joe", id : 9393 }
  ];
  
  $scope.save = function(name) {
    $scope.data.push({ name : name + $scope.mainControllerSuffix, id : Math.random() });
    $scope.name = "";
  }

});

app.controller('math', function($scope) {
  $scope.nums = { first : 1, second : 2 };
  
  $scope.incFirst = function() {
    $scope.nums.first += 1;
  };
});

app.controller('main', function($scope, $http, $timeout, Blog) {
  $scope.mainControllerSuffix = "-mainy";
  $scope.blogs                = [];
  $scope.counter              = 0;

  $scope.fetchBlogs = function() {
    Blog.get(function(blogs) {
      $scope.blogs = blogs;
    });    
  }

  $scope.addNewBlog = function(data) {
    Blog.create(data, function() {
      $scope.blogs.push(angular.extend({}, data));
      $scope.setNewBlogState(false);
    })
  };

  $scope.deleteBlog = function(blog, index) {
    Blog.destroy(blog, function() {
      $scope.blogs.splice(index, 1);
    })
  };

  // asynchronously update the counter
  $scope.addToTimer = function() {
    $timeout(function() {
      $scope.counter += 1;
      $scope.addToTimer();
    }, 1000)
  };

  $scope.setNewBlogState = function(state) {
    $scope.showingNewBlog = state;
    $scope.newBlog = null;
  }


  $scope.setNewBlogState(false);
  $scope.addToTimer();
});

app.factory("Blog", function($http) {

  return {
    get : function(callback) {
      $http({
        method : "GET",
        url : "/blogs.json"
      }).success(callback);
    },

    create : function(data, callback) {
      // not we are using #finally because the POST action doesn't exist yet
      $http({
        method : "POST",
        url : "/blogs.json",
        data : data
      }).finally(callback);

    },

    destroy : function(data, callback) {
      // not we are using #finally because the POST action doesn't exist yet
      $http({
        method : "DELETE",
        url : "/blogs.json",
        data : data
      }).finally(callback);

    }

  };
});