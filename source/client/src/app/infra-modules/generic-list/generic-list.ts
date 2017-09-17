'use strict'

class GenericListCtrl {

 /* @ngInject */
 constructor(private $log: angular.ILogService) {
   $log.info('starting up the generic list controller')
 }
}

export const GenericList: ng.IComponentOptions = {
  controllerAs: 'vm',
  template: require('./generic-list.html'),
  controller: GenericListCtrl,
  bindings: {
    items: '=',
    selectedItem: '=',
    listType: '=',
    itemSelected: '&',
  },
}
