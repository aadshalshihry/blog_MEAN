angular.module('example')
// .controller('ExampleController', ['$scope',
//  function ($scope) {
//     $scope.name = 'MEAN Application';
// }]);
.controller('ExampleController', ['$scope', 'Authentication',
 function ($scope, Authentication) {
    $scope.name = Authentication.user ? Authentication.user.fullName : 'MEAN Application';
    $scope.authentication = Authentication;
}]);
