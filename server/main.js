import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import '/imports/api/api.js';

Meteor.startup(() => {
    
    var adminUser = Meteor.users.findOne({username: "amy"});
    Roles.addUsersToRoles(adminUser._id, 'admin', Roles.GLOBAL_GROUP);
});
