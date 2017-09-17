export interface IAddress {
  street: string,
  state: string,
  country: string
}

export interface IMemberOf {
  groupId: string,
  membershipId: string
}

export interface IUser {
  id?: string,
  name: string,
  email: string,
  shortName: string
  address: IAddress,
  description: string,
  memberOf: IMemberOf[]
}
