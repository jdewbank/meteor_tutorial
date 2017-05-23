import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Session } from 'meteor/session';
import { Roles } from 'meteor/alanning:roles';

import { Matches } from '../api/matches.js';
import { Tournaments } from '../api/matches.js';
import { Teams } from '../api/matches.js';

import './match.js';
import './team.js';
import './body.html';
import './enterMatch.js';
import './enterTeam.js';
 
Template.body.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
    
    Meteor.subscribe('matches');
    Meteor.subscribe('tournaments');
    Meteor.subscribe('teams');
    Meteor.subscribe('roles');
    Meteor.subscribe('users');
});
 
Template.body.helpers({
//    permissions stuff
    admin() {
        return Roles.userIsInRole(Meteor.userId(), ['admin']);
    },
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
        
//        console.log(net);
//        console.log(et);
        allTournaments.forEach(function (tournament){
            if(!et.includes(tournament._id)){
                net.push(tournament._id);
            }
        });
        return net;
    },
//    matches
    matches() {
        return Matches.find({tID: Session.get('tID')}, { sort: { createdAt: -1 } } );
    },
    matchCount() {
        return Matches.find({tID: Session.get('tID')}).count();
    },
//    teams
    teams() {
        return Teams.find({tID: Session.get('tID')}, { sort: { createdAt: -1 } } );
    },
    teamCount() {
        return Teams.find({tID: Session.get('tID')}).count();
    },
//    tournaments
    getTournamentFromId(id) {
        if(Tournaments.find(id).count() > 0){
            return Tournaments.findOne(id).title;
        } else {
            return id;
        }
    },
    tournaments() {
        return Tournaments.find({}, { sort: { createdAt: -1 } } );
    },
    currentTournament() {
        var tournament = Tournaments.findOne({_id : Session.get('tID')});
        if(tournament){
            return tournament.title;            
        }
        else{
            return "No Tournament Selected";
        }
    },
    tournamentPermission() {
        var tournament = Tournaments.findOne({_id : Session.get('tID')});
        if(!tournament)
            return false;
        return Roles.userIsInRole(Meteor.userId(), 'editor', tournament._id);
    },
});

Template.body.events({

    'click .tablinks'(event){
        
        document.getElementById('team-container').style.display = "none";
        document.getElementById('match-container').style.display = "none";
        document.getElementById('tournament-container').style.display = "none";
        document.getElementById('admin-container').style.display = "none";
        
        
        if(event.target.id === 'team-tab'){
            document.getElementById('team-container').style.display = "block";
        } else if(event.target.id === 'tournament-tab'){
            document.getElementById('tournament-container').style.display = "block";
        } else if(event.target.id === 'match-tab'){
            document.getElementById('match-container').style.display = "block";
        } else if(event.target.id === 'admin-tab'){
            document.getElementById('admin-container').style.display = "block";
        }
    },  
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
