'use strict'

class AppStartCtrl {

  /* @ngInject */
  constructor(
    private $mdMedia: angular.material.IMedia) {

  }
}

export const AppStartPage = {
  controllerAs: 'vm',
  template: require('./app-start.html'),
  controller: AppStartCtrl,
}
