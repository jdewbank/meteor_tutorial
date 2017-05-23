import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { Matches } from '/imports/api/api.js';
import { Teams } from '/imports/api/api.js';

import './enterMatch.html';

Template.enterMatch.helpers({
    matches() {
        return Matches.find({tID: Session.get('tID')}, { sort: { createdAt: -1 } } );
    },
    matchCount() {
        return Matches.find({tID: Session.get('tID')}).count();
    },
    teams() {
        return Teams.find({tID: Session.get('tID')}, { sort: { createdAt: -1 } } );
    },
    teamCount() {
        return Teams.find({tID: Session.get('tID')}).count();
    },
});

Template.enterMatch.events({  
  'submit .new-match'(event) {
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const rd = target.round.value;
    const t1 = target.team1.value;
    const t2 = target.team2.value;
    const s1 = target.score1.value;
    const s2 = target.score2.value;
    tID = Session.get('tID');
 
    // Insert a task into the collection
    Meteor.call('matches.insert', rd, t1, s1, t2, s2, tID);
 
    // Clear form
    target.round.value = '';
    target.team1.value = '';
    target.team2.value = '';
    target.score1.value = '';
    target.score2.value = '';
  },
});

