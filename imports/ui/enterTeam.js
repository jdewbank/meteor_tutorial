import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './enterTeam.html';

Template.enterTeam.events({  
  'submit .new-team'(event) {
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const team = target.team.value;
// 
//    console.log("team");
    console.log(team);
 
    // Insert a task into the collection
    Meteor.call('teams.insert', team, Session.get('tID'));
 
    // Clear form
    target.team.value = '';
  },
});

