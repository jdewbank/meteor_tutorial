import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Matches } from '/imports/api/api.js';
import { Teams } from '/imports/api/api.js';

import './teamTab.html';

Template.teams.helpers({
    teams() {
      
        var currentTournamentID = 0;
        if(Meteor.user()){
            currentTournamentID = Meteor.user().profile.current_tournament;
        }
        return Teams.find({tID: currentTournamentID}, { sort: { createdAt: -1 } } );  
    },
    teamCount() {
        var currentTournamentID = 0;
        if(Meteor.user()){
            currentTournamentID = Meteor.user().profile.current_tournament;
        }
        return Teams.find({tID: currentTournamentID}).count();
    },
    
});

Template.teams.events({  
    'click .insert'(event) {
        console.log("Add team");
        Router.go('/enterTeam');
    },
});

