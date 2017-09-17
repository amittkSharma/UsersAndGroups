'use strict'

import { viewModelGenerator as gen } from './viewmodel-generator'
import { IGroupType, IGroup, ISaveGroup } from '../_types/IGroups'
import { IUser } from '../_types/IUser'

export class RestApi {

    public allGroupTypes: ng.IPromise<IGroupType[]>
    public allUsers: ng.IPromise<IUser[]>
    public allGroups: ng.IPromise<IGroup[]>

    /* @ngInject */
    constructor(private $http: angular.IHttpService,
                private $q: angular.IQService,
                private $log) {
        this.allGroupTypes = this.getGroupTypes()
        this.allUsers = this.getUsers()
        this.allGroups = this.getGroups()
    }

    getGroupTypes() {
        this.$log.info(`start getting all available group types`)
        return this.$http.get('/api/groupTypes').then(grpTypes => {
            return gen.getAllVmGroupTypes(grpTypes.data)
        })
    }

    getUsers() {
        this.$log.info(`start getting all available persons`)
        return this.$http.get('/api/users').then(users => {
            return gen.getAllVmUsers(users.data)
        })
    }

    getGroups() {
        return this.allGroupTypes.then(types => {
            return this.allUsers.then(users => {
                return this.$http.get('/api/groups').then(grpsInfo => {
                    return gen.getAllVmGroups(grpsInfo.data, types, users)
                })
            })
        })
    }

    saveGroup(newGroup: ISaveGroup) {
        this.$log.info(`Adding new group with name ${newGroup.name}`)
        return this.$http.post('/api/newGroup', {data: newGroup}).then(grpsInfo => {
            return this.allGroupTypes.then(types => {
                return this.allUsers.then(users => {
                    return gen.getAllVmGroups([grpsInfo.data], types, users)
                })
            })
        })
    }

    saveUser(newUser: IUser) {
        this.$log.info(`Adding new user with name ${newUser.name}`)
        return this.$http.post('/api/newUser', {data: newUser}).then(users => {
            return gen.getAllVmUsers([users.data])
        })
    }
}
