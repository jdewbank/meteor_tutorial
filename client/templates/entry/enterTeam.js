import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './enterTeam.html';

Template.enterTeam.events({  
  'submit .new-team'(event) {
    // Prevent default browser form submit
    event.preventDefault();
 
    
    // Get value from form element
    const target = event.target;
    const name = target.team.value;
    
    // Todo - make this a variable length array
    var length = 4;
    
    var i;
    
//    for (i=1; i<=4; i+=1)
//    { 
//        target[i].value = '';   
//    }
    
    var players = [target[1].value, target[2].value, target[3].value, target[4].value];
    
    // Insert a task into the collection
    Meteor.call('teams.insert', name, Meteor.user().profile.current_tournament, players);
 
    // Clear form
    for (i=1; i<=4; i+=1)
    { 
        target[i].value = '';   
    }
    target.team.value = '';
  },
});

