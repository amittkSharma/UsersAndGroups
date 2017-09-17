import { IUser } from './IUser'

export interface IGroupType {
  id: string,
  name: string,
  icon: string
}

export interface IDuration {
  value: number,
  unit: string,
}

export interface IMember extends IUser {
  membershipId: string,
  joiningDate: string,
  duration: IDuration,
  designation: string,
}

export interface IGroup {
  id: string,
  name: string,
  date: string,
  address: string,
  homepage: string,
  shortName: string,
  groupType: IGroupType,
  members?: IMember[],
  description: string
}

export interface ISaveGroup {
  name: string,
  date: Date,
  address: string,
  homepage: string,
  shortName: string,
  groupType: string,
  members: IMember[],
  description: string
}
