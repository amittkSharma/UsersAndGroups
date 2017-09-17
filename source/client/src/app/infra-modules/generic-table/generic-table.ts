'use strict'

class GenericTableCtrl {

 /* @ngInject */
 constructor(private $log: angular.ILogService) {
   $log.info('starting up the generic table controller')
 }
}

export const GenericTable: ng.IComponentOptions = {
  controllerAs: 'vm',
  template: require('./generic-table.html'),
  controller: GenericTableCtrl,
  bindings: {
    items: '=',
    area: '<',
  },
}
