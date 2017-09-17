'use strict'

import { IGroup, IGroupType, IMember } from '../_types/IGroups'
import { IUser, IAddress } from '../_types/IUser'
const _noInformationFound = 'No information found'

export class ViewModelGenerator {

  getAllVmGroupTypes(dataInfo: any) {
    const groupTypes = dataInfo.map(type => {
      const groupType: IGroupType = {
        icon: type.icon,
        name: type.name,
        id: type.groupId,
      }
      return groupType
    })
    return groupTypes
  }

  getAllVmUsers(dataInfo: any) {
    const users = dataInfo.map(x => {
      const user: IUser = {
        name: x.name,
        id: x.id,
        email: x.email,
        address: {
          street: x.address.street || _noInformationFound,
          state: x.address.state || _noInformationFound,
          country: x.address.country || _noInformationFound,
        },
        shortName: x.shortName || _noInformationFound,
        description: x.description,
        memberOf: x.memberOf,
      }
      return user
    })
    return users
  }

  getAllVmGroups(dataInfo: any, grpTypes: IGroupType[], users: IUser[]) {
    const groups = dataInfo.map(grp => {
      const members = grp.members.map(x => {
        const filteredUsers = users.filter(element =>
              element.memberOf.some(subElement =>
              subElement.groupId === grp.id && subElement.membershipId === x.membershipId))[0]
        return ({
          ...x,
          ...filteredUsers,
        })
      })
      const group: IGroup = {
        id: grp.id,
        name: grp.name,
        date: new Date(grp.date).toLocaleString(),
        address: grp.address,
        homepage: grp.homepage,
        groupType: grpTypes.filter( x => x.id === grp.groupType)[0],
        members,
        description: grp.description,
        shortName: grp.shortName,
      }
      return group
    })
    return groups
  }
}

export const viewModelGenerator = new ViewModelGenerator()
