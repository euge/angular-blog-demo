var app = angular.module('app', [ "ngResource" ]);

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

app.controller('main', function($scope, $http, $timeout, $q, Blog) {
  $scope.mainControllerSuffix = "-mainy";
  $scope.blogs                = [];
  $scope.counter              = 0;
  $scope.showingModal_1       = false;
  $scope.showingModal_2       = false;

  $scope.modalOpened = function() {
    alert("wow! the modal opened!");
  }

  $scope.fetchBlogs = function() {
    Blog.query(function(blogs) {
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

  var deferred = $q.defer();

  deferred.promise.then(function(response) {
    $scope.asyncItems = response;
  });

  $timeout(function() {
    deferred.resolve([ { name : "a" }, { name : "b" }, { name  : "c "} ]);
  }, 2000);
});

app.factory("Blog", function($http, $resource) {

  var Blog = $resource("/blogs.json");

  return {
    query : function(callback) {
      Blog.query(callback);
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

app.directive("blogItem", function() {
  return {
    template: '\
      <td>{{ blog.title }}</td>\
      <td>{{ blog.readers }}</td>\
      <td><a href="" ng-click="deleteBlog(blog, $index)" style="color:#c12e2a;"><span class="glyphicon glyphicon-remove-circle"></span></a></td>'
  };
});

app.directive("customTable", function($compile) {

  function createTemplate(headings) {
    return "<ul><li ng-repeat='item in headings'>{{ item}}</li></ul>";
  }


  return {
    restrict : "E",
    link : function($scope, element, attrs) {
      var headings = $scope.$eval(attrs.headings)
      $scope.headings = headings;
      var html = createTemplate(headings);

      var el = angular.element(html),

             //compile the view into a function.
                 compiled = $compile(el);

             //append our view to the element of the directive.
             element.append(el);

             //bind our view to the scope!
             //(try commenting out this line to see what happens!)
             compiled($scope);
    }
  }
})

app.directive("modal", function() {
  return {
    restrict : "E",
    template: "<div ng-show='show'><div>something standard here</div><div ng-transclude></div></div>",
    replace : true,
    transclude : true,
    scope : {
      // take the attribute value provided as "showing" and make it available in this scope as "show"
      // also sets up bidirectional bridge between em
      "show" : "=showing",
      // take the event handler provided as "after-open" and make it available in this scope as "customAfterOpen"
      "customAfterOpen" : "&afterOpen",
      // take the attribute string "color" and make it available in this scope as "color"
      "color" : "@"
    },
    link : function(scope, elem, attrs) {
      // style the element
      elem.css({
        position: "fixed",
        width: "100%",
        height: "40%",
        backgroundColor : scope.color,
        zIndex: 1000
      });

      // watch for change in the show property
      scope.$watch('show', function(newValue, oldValue) {
        if (newValue) {
          // dialog is now open
          scope.customAfterOpen();
        }
      });

    }
  };
});