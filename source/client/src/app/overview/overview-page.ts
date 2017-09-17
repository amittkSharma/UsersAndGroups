'use strict'

import { RestApi } from '../rest-communication/rest-api'
import { IGroup, IGroupType, ISaveGroup } from '../_types/IGroups'
import { DialogService } from '../infra-modules/services/dialog.service'
import { AddGroupCtrl } from './add-group'

class OverviewCtrl {

    public groups: IGroup[]
    public selectedGroup: IGroup
    public allGroupTypes: IGroupType[]

    /* @ngInject */
    constructor(
        private $timeout: angular.ITimeoutService,
        private $mdMedia: angular.material.IMedia,
        private $mdSidenav: angular.material.ISidenavService,
        private $q: angular.IQService,
        private $log: angular.ILogService,
        private $state,
        private api: RestApi,
        private dialogService: DialogService,
       ) {
        this.api.allGroups.then(grps => {
            this.groups = grps
            this.showGroupDetails(this.groups[0])
        })

        this.api.allGroupTypes.then(grpTypes => {
            this.allGroupTypes = grpTypes
        })
    }

    toggleSidenav(menuId: string) {
        this.$mdSidenav(menuId).toggle()
    }

    showGroupDetails(group) {
        this.selectedGroup = group
    }

    addGroup(ev) {
        this.dialogService.show({
            controller: AddGroupCtrl,
            template: require('./add-group.html'),
            targetEvent: ev,
            locals: {
                allGroupTypes: this.allGroupTypes,
            },
          }).then( grpInfo => {
            this.api.saveGroup(grpInfo).then(result => {
                this.groups.push(result[0])
                this.selectedGroup = result[0]

                this.dialogService.notify(`Group with name ${this.selectedGroup.name} is created.`)
            })
        })
    }
}

export const OverviewPage = {
    controllerAs: 'vm',
    template: require('./overview-page.html'),
    controller: OverviewCtrl,
}
