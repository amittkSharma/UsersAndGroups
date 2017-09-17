import * as angular from 'angular'
import { IGroup } from '../_types/IGroups'
import { IUser } from '../_types/IUser'
import * as uniqueId from 'uuid'

export class AddUserCtrl {
  public allGroups: any[]
  public selectedGroups: IGroup[]
  public user: IUser
  private simulateQuery: boolean

  /* @ngInject */
  constructor(
    private $mdDialog: angular.material.IDialogService,
    private $timeout: angular.ITimeoutService,
    private $q: angular.IQService,
    public allAvailGroups: IGroup[]) {
      this.simulateQuery = false
      this.selectedGroups = []
      this.allGroups = allAvailGroups.map(x => {
        const grp = {
          ...x,
          searchText: x.name.toLowerCase(),
        }
        return grp
      })
  }

  querySearch(criteria) {
    return criteria ? this.allGroups.filter(this.createFilterFor(criteria)) : []
  }

  createFilterFor(query) {
    const lowercaseQuery = angular.lowercase(query)
    return function filterFn(item) {
      return (item.searchText.indexOf(lowercaseQuery) === 0)
    }
  }

  cancel() {
    this.$mdDialog.cancel()
  }

  save() {
    this.user.memberOf = this.selectedGroups.map(x => {
      return {
        groupId: x.id,
        membershipId: uniqueId(),
      }
    })
    this.$mdDialog.hide(this.user)
  }
}
