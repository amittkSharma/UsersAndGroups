'use strict'

class ToolbarCtrl {

 /* @ngInject */
 constructor(
  private $mdDialog: angular.material.IDialogService,
  private $mdSidenav: angular.material.ISidenavService) {
 }

 toggleSidenav() {
    this.$mdSidenav('sidenav').toggle()
  }

 closeSidenav() {
    this.$mdSidenav('sidenav').close()
  }
}

export const ToolBar: ng.IComponentOptions = {
  controllerAs: 'vm',
  template: require('./toolbar.html'),
  controller: ToolbarCtrl,
}
