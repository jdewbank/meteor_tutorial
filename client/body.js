import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Session } from 'meteor/session';
import { Roles } from 'meteor/alanning:roles';

import { Matches } from '/imports/api/api.js';
import { Tournaments } from '/imports/api/api.js';
import { Teams } from '/imports/api/api.js';

import './templates/match.js';
import './templates/team.js';
import './templates/entry/enterMatch.js';
import './templates/entry/enterTeam.js';


Template.body.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
    
    Meteor.subscribe('matches');
    Meteor.subscribe('tournaments');
    Meteor.subscribe('teams');
    Meteor.subscribe('roles');
    Meteor.subscribe('users');
    Meteor.subscribe('players');
});
 
Template.registerHelper( 'tournamentPermission', () => {
    
        
        var currentTournamentID = Meteor.user().profile.current_tournament;
    
        var tournament = Tournaments.findOne({_id : currentTournamentID});
        if(!tournament)
            return false;
        return Roles.userIsInRole(Meteor.userId(), 'editor', tournament._id);
}); 

Template.registerHelper( 'admin', () => {
        return Roles.userIsInRole(Meteor.userId(), ['admin']);
}); 

Template.registerHelper( 'teams', () => {
        var currentTournamentID = 0;
        if(Meteor.user()){
            currentTournamentID = Meteor.user().profile.current_tournament;
        }
        console.log("TEST HELPER MAIN");
        return Teams.find({tID: currentTournamentID}, { sort: { createdAt: -1 } } );
});

 
Template.admin.helpers({
    users() {
        return Meteor.users.find({});
    },
    editableTournaments(uID) {
        
        return Roles.getGroupsForUser(uID, 'editor');
    },
    nonEditableTournaments(uID) {
        var allTournaments = Tournaments.find({}, { sort: { createdAt: -1 } } );
        var net = [];
        var et = Roles.getGroupsForUser(uID, 'editor');
        
        allTournaments.forEach(function (tournament){
            if(!et.includes(tournament._id)){
                net.push(tournament._id);
            }
        });
        return net;
    },
    getTournamentFromId(id) {
        if(Tournaments.find(id).count() > 0){
            return Tournaments.findOne(id).title;
        } else {
            return id;
        }
    },
});

Template.tournaments.onRendered(function(){
    
    //On initial rendering, sometimes the user doesn't get logged on until
    //after the check. Need to make this better.
    if(Meteor.user()){
        var currentTournamentID = Meteor.user().profile.current_tournament;
        var button = this.find('input[id=' + currentTournamentID + ']');
        button.checked = true;
        
    } else {
        var template = this;
        Meteor.setTimeout(function(){
            if(Meteor.user()){
                var currentTournamentID = Meteor.user().profile.current_tournament;
                var button = template.find('input[id=' + currentTournamentID + ']');
                button.checked = true;
            }
        }, 800);
        
    }
});



Template.tournaments.helpers({
    tournaments() {
        return Tournaments.find({}, { sort: { createdAt: -1 } } );
    },
});


Template.tournaments.events({
    'change .tournaments'(event){        
        Meteor.users.update(
                {_id: Meteor.userId()},
                {$set: 
                    {'profile.current_tournament': event.target.value}
                }
        );        
        
    },
    'submit .new-tournament'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        const target = event.target;
        const tournament = target.tournament.value;

        // Insert a task into the collection
        Meteor.call('tournaments.insert', tournament, function(error, result){
            Session.set('current_tournament_id', result);
        });

        target.tournament.value = '';

    },
    'click #tournamentDelete'(event) {
        Meteor.call('tournaments.remove', event.target.value);
    },
});

Template.admin.events({
    'click #editorDelete'(event) {
        event.preventDefault();
//        TODO - Fix this - need to find a way to get the UID to be deleted.
        Meteor.call('users.removeEditor', event.target.parentElement.parentElement.title, event.target.value);
    },
    'click .add-editor'(event) {
        event.preventDefault();
//        TODO - Fix this too
        Meteor.call('users.addEditor', event.target.parentElement.parentElement.title, event.target.value);
    },
});
