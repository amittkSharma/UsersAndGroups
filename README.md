# UsersAndGroups
 <h3>Introduction</h3>
<p>
 This app serves as a platform where new users and groups can be created. Users can join any group of their
 choice and enjoy the privilledges of specific group.
 <br>
 The list of groups is alphabetically sorted, shows the most meta information about the group like type and member count.
 The is list is enriched with search facility.
 <br>
 The group details page shows basic information about the group like name, type of group, location and link to
 home page. It also shows basic information about the users along with their membership statuses.
 <br>
 The selection of groups while creation user is enriched with auto-completion facility.
 The list of users is alphabetically sorted, shows the most meta information about the user like nick name and group count.
 The is list is powered with search facility.
 <br>
 The user details page shows the basic information about the user and his/her association with specific group.
 <br>
 The user is notified creation of new group and user via toast in a top right corner. Users and groups got selected after creation.
 Tooltips are placed in all sections in order help user for app usage.
 
 <h3>How to use the app</h3>
<p>
 The app is self driven and gives notification to user at various instances. The icon selection also helps the user to
 navigate through the app. From introduction page user can press "Start App" and navigate to the group page. The group
 page contains a "fab button" for opening creation dialog box. User can select group type and fill the manadatory field
 to create new group. User will get notification in top right corner on successful creation of group and newly created
 group will get selected.
<br>
The user can navigate to the users page by selecting "Person" icon on top of the list. On the "User page" a user
can create the new user, while creating one needs to select the groups to join and once the user is created successfully
system will show the notification.
<br>
Both user page and group page will show groups and members on selecting respective entity.
</p>

<h3>Technical Stack</h3>
<p>
  Typescript, AngularJS, Node.js, Visualization Library: Angular Material, Database: Mongodb, Browser: Chrome
</p>

<h3>Restrictions and assumptions:</h3>
<p>
  For the demo purposes some assumptions are being made:
    <br>App is restricted to add new groups and new users (user joining groups on creation time).
    <br>There are pre-defined group types are present in the system.
    <br>The menu items are disablesd for demo purpose, they represent the future aspect of application.
    <br>A user can only be created after selecting one of the existing groups.
</p>
<br />
<p>Future Aspects:
      <br> Sending mails for notification
      <br>Displaying discussion section in groups page
      <br>Ability to change membership status
</p>

## Steps to install and get app up and running:
<p>Steps:
      <br> Clone the repository on the local machine.
      <br> Install Mongodb, nodejs if not installed on the machine.
      <br> Navigate to the 'Config.ts' in the server section of the app to update the 'Mongodb' connection property      ('userGroupsDataDb') to point current instance of the mongo database
      <br> Install the node packages for server part and execute 'npm start' to start the server
      <br> Install the node and bower packages for client part and execute 'npm start' to get the UI up and running
      <br> If internet explorer is the default browser , then switch to 'Chrome' for better user experience.
</p>



## App Snapshots
#Add Group Dialog:
![Alt text](https://github.com/amittkSharma/UsersAndGroups/blob/master/images/AddGroup.PNG?raw=true "Add Group")
#Add User Dialog:
![Alt text](https://github.com/amittkSharma/UsersAndGroups/blob/master/images/AddUser.PNG?raw=true "Add User")
#User Details Page: Showing user basic information and corrosponding group memberships
![Alt text](https://github.com/amittkSharma/UsersAndGroups/blob/master/images/UserDetailsPage.PNG?raw=true "User Details Page")
#Group Details Page: Showing group baisc information and corrosponding members information.
![Alt text](https://github.com/amittkSharma/UsersAndGroups/blob/master/images/GroupDetailsPage.PNG?raw=true "Group Details Page")
