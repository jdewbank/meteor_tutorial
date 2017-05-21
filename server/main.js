import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import '../imports/api/matches.js';

Meteor.startup(() => {
    
    var adminUser = Meteor.users.findOne({username: "amy"});
//    console.log(adminUser);
//    console.log(adminUser._id);
//    
    Roles.addUsersToRoles(adminUser._id, 'admin', Roles.GLOBAL_GROUP);
});
