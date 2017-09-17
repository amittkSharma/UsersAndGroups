import { IGroupType, ISaveGroup } from '../_types/IGroups'

export class AddGroupCtrl {
  public groupTypes: IGroupType[]
  public group: ISaveGroup

  /* @ngInject */
  constructor(
    private $mdDialog: angular.material.IDialogService,
    public allGroupTypes: IGroupType[]) {

      this.groupTypes = allGroupTypes

  }

  cancel() {
    this.$mdDialog.cancel()
  }

  save() {
    this.group.members = []
    this.$mdDialog.hide(this.group)
  }
}
