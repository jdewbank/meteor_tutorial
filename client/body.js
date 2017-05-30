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
});
 
Template.registerHelper( 'tournamentPermission', () => {
        var tournament = Tournaments.findOne({_id : Session.get('tID')});
        if(!tournament)
            return false;
        return Roles.userIsInRole(Meteor.userId(), 'editor', tournament._id);
}); 

Template.registerHelper( 'admin', () => {
        return Roles.userIsInRole(Meteor.userId(), ['admin']);
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

Template.tournaments.helpers({
    tournaments() {
        return Tournaments.find({}, { sort: { createdAt: -1 } } );
    },
});




 


Template.tournaments.events({
    'change .tournaments'(event){
        Session.set('tID', event.target.value);
    },
    'submit .new-tournament'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        const target = event.target;
        const tournament = target.tournament.value;

        // Insert a task into the collection
        Meteor.call('tournaments.insert', tournament, function(error, result){
            Session.set('tID', result);
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
