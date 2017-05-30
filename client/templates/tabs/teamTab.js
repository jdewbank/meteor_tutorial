import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { Matches } from '/imports/api/api.js';
import { Teams } from '/imports/api/api.js';

import './teamTab.html';

Template.teams.helpers({
    teams() {
        return Teams.find({tID: Session.get('tID')}, { sort: { createdAt: -1 } } );
    },
    teamCount() {
        return Teams.find({tID: Session.get('tID')}).count();
    },
    
});

Template.teams.events({  
    'click .insert'(event) {
        console.log("Add team");
        Router.go('/enterTeam');
    },
});

