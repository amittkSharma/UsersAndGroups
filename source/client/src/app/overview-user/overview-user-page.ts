'use strict'

import * as angular from 'angular'
import { RestApi } from '../rest-communication/rest-api'
import { IUser } from '../_types/IUser'
import { IGroup } from '../_types/IGroups'
import { AddUserCtrl } from './add-user'
import { DialogService } from '../infra-modules/services/dialog.service'

class OverviewUserCtrl {

    public users: IUser[]
    public selectedUser: IUser
    public userAssociations: IGroup[]
    public allGroups: IGroup[]

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
        this.$log.info('initializing user control')

        this.api.allUsers.then(usrs => {
            this.users = usrs
            this.showUserDetails(this.users[0])
        })

        this.api.allGroups.then(grps => {
            this.allGroups = grps
        })
    }

    showUserDetails(user: IUser) {
        this.selectedUser = user
        this.api.allGroups.then(grps => {
            this.userAssociations = user.memberOf.map(x => {
                return grps.filter(y => y.id === x.groupId)[0]
            })
        })
    }

    addUser(ev) {
        this.dialogService.show({
            controller: AddUserCtrl,
            template: require('./add-user.html'),
            targetEvent: ev,
            locals: {
                allAvailGroups: angular.copy(this.allGroups),
            },
        }).then( userInfo => {
            this.api.saveUser(userInfo).then(result => {
                const persistedUser = result[0]
                this.users.push(persistedUser)
                this.showUserDetails(persistedUser)

                this.dialogService.notify(`User with name ${this.selectedUser.name} is created.`)

                userInfo.memberOf.map(mem => {
                    const membershipDetails = {
                      ...userInfo,
                      membershipId: mem.membershipId,
                      joiningDate: new Date().toLocaleString(),
                      duration: {value: 1, unit: 'year'},
                      designation: 'Member',
                      isMembershipCancelled: false,
                    }
                    const specificGrp = this.allGroups.filter(x => x.id === mem.groupId)[0]
                    specificGrp.members.push(membershipDetails)
                  })
            })
        })
    }
}

export const OverviewUserPage = {
    controllerAs: 'vm',
    template: require('./overview-user-page.html'),
    controller: OverviewUserCtrl,
}
