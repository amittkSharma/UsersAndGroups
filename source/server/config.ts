export const config = {
  serverPort: 8090,
  userGroupsDataDb: 'mongodb://localhost:27017/UsersGroups',
  dataTables: {
    users: 'users',
    groups: 'groups',
    groupTypes: 'groupTypes',
  },
  tableNames: ['users', 'groups', 'groupTypes'],
}
