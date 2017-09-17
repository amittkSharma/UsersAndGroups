class MenuCtrl {
  public item: any
  public category: string

  /* @ngInject */
  constructor(
    private $mdDialog: angular.material.IDialogService) {}

  openMenu($mdOpenMenu, ev) {
    $mdOpenMenu(ev)
  }

  isMenuItemVisible() {
    return this.category !== undefined
  }
}

export const Menu: ng.IComponentOptions = {
  controllerAs: 'vm',
  controller: MenuCtrl,
  template: require('./menu.html'),
  bindings: {
    category: '<',
    item: '=',
    onDelete: '&',
    onEdit: '&',
    onClone: '&',
    onAdd: '&',
  },
}
