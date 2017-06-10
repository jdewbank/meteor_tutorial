import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { Matches } from '/imports/api/api.js';
import { Teams } from '/imports/api/api.js';

import './matchTab.html';

Template.matches.helpers({
    matches() {
        return Matches.find({tournamentID: Session.get('tID')}, { sort: { createdAt: -1 } } );
    },
    matchCount() {
        return Matches.find({tournamentID: Session.get('tID')}).count();
    },
    teams() {
        return Teams.find({tID: Session.get('tID')}, { sort: { createdAt: -1 } } );
    },
});
Template.matches.events({  
    'click .insert'(event) {
        Router.go('/enterMatch');
    },
});

