import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './enterMatch.html';

Template.enterMatch.events({  
  'submit .new-match'(event) {
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const t1 = target.team1.value;
    const t2 = target.team2.value;
    const s1 = target.score1.value;
    const s2 = target.score2.value;
 
    // Insert a task into the collection
    Meteor.call('matches.insert', t1, s1, t2, s2);
 
    // Clear form
    target.team1.value = '';
    target.team2.value = '';
    target.score1.value = '';
    target.score2.value = '';
  },
});

