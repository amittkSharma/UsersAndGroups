import * as angular from 'angular'

export interface IDialogOptions {
  controller: any,
  template: string,
  targetEvent?: any,
  locals?: any
}

export class DialogService {
  /* @ngInject */
  constructor(
    private $mdToast: angular.material.IToastService,
    private $mdDialog: angular.material.IDialogService,
    private $mdMedia: angular.material.IMedia,
    private $log: angular.ILogService) { }

  show(opts: IDialogOptions) {
    const useFullScreen = this.$mdMedia('xs')
    return this.$mdDialog.show({
      controllerAs: 'vm',
      controller: opts.controller,
      template: opts.template,
      parent: angular.element(document.body),
      targetEvent: opts.targetEvent,
      clickOutsideToClose: false,
      fullscreen: useFullScreen,
      locals: opts.locals,
    })
  }

  notify(msg: string) {
    this.$log.info(msg)
    const toast = this.$mdToast.simple()
          .textContent(msg)
          .action('OK')
          .highlightAction(false)
          .hideDelay(6000)
          .position('top right')
    return this.$mdToast.show(toast)
  }

  alert(msg: string, title: string, event: MouseEvent) {
    const confirm = this.$mdDialog.alert()
    .title(title)
    .textContent(msg)
    .targetEvent(event)
    .ok('OK')
    return this.$mdDialog.show(confirm)
  }

  confirm(msg: string, event: MouseEvent) {
    const confirm = this.$mdDialog.confirm()
    .title('Confirmation Dialog')
    .textContent(msg)
    .targetEvent(event)
    .ok('Delete')
    .cancel('Cancel')
    return this.$mdDialog.show(confirm)
  }
}
