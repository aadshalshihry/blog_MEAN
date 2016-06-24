
angular.module('articles').factory('Articles',
['$resource', function ($resource) {
 return $resource('api/aricles/:articleId',{
   articleId: '@_id'
 }, {
   update: {
     method: 'PUT'
   }
 });
}]);
