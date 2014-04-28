(function (angular) {
  'use strict';

  angular.module('bot')
    .controller('BotController', ['$scope', '$routeParams', 'Bots', function ($scope, $routeParams, Bots) {
      $scope.bot = Bots.get({id: $routeParams.id});
    }]);
})(angular);