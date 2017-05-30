import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './enterTeam.html';

Template.enterTeam.events({  
  'submit .new-team'(event) {
    // Prevent default browser form submit
    event.preventDefault();
 
    console.log(event);
    
    // Get value from form element
    const target = event.target;
    const name = target.team.value;
    
    console.log(name);
    console.log(target[1].value);
    console.log(target[2].value);
    console.log(target[3].value);
    console.log(target[4].value);
    
    var players = [target[1].value, target[2].value, target[3].value, target[4].value];
    console.log(players);
 
    // Insert a task into the collection
    Meteor.call('teams.insert', name, Session.get('tID'), players);
 
    // Clear form
    target.team.value = '';
  },
});

