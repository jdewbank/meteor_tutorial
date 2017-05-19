import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Matches } from '../api/matches.js';
import { Teams } from '../api/matches.js';

import './enterMatch.html';

Template.enterMatch.helpers({
    matches() {
        return Matches.find({}, { sort: { createdAt: -1 } } );
    },
    matchCount() {
        return Matches.find({}).count();
    },
    teams() {
        return Teams.find({}, { sort: { createdAt: -1 } } );
    },
    teamCount() {
        return Teams.find({}).count();
    },
});

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

