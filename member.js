function skillsMember() {
  return {
    restrict: 'E',
    templateUrl: 'templates/skills-member.html',
    scope: {
      member: '=',
      skills: '=',
      delete: '&',
      update: '&'
    },
    controller: function($scope) {
      $scope.deleteMember = function() {
        $scope.delete();
      };
      $scope.updateMember = function() {
        $scope.update();
      };
    }
  };
}