linkyApp.service('UserService', function($http, $q) {
  return {
    'getUserLogged': function() {
      var defer = $q.defer();
      $http.get('/user/getUserLogged').success(function(resp){
        defer.resolve(resp);
      }).error( function(err) {
        defer.reject(err);
      });
      return defer.promise;
    },
    'addUser': function(user) {
      var defer = $q.defer();
      $http.post('/user/addUser', user).success(function(resp){
        defer.resolve(resp);
      }).error( function(err) {
        defer.reject(err);
      });
      return defer.promise;
    },
    'removeUser': function(user) {
      var defer = $q.defer();
      $http.post('/user/removeUser', user).success(function(resp){
        defer.resolve(resp);
      }).error( function(err) {
        defer.reject(err);
      });
      return defer.promise;
    }
}});
