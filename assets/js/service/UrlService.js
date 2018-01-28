linkyApp.service('UrlService', function($http, $q) {
  return {
    'createUrl': function(url) {
      var defer = $q.defer();
      $http.post('/url/createUrl', url).success(function(res) {
        defer.resolve(res);
      }).error(function(err) {
        defer.reject(err);
      });
      return defer.promise;
    },
    'sendPass': function(url) {
      var defer = $q.defer();
      $http.post('/url/sendPass', url).success(function(resp){
        defer.resolve(resp);
      }).error( function(err) {
        defer.reject(err);
      });
      return defer.promise;
    }
  }
});
