import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Session } from 'meteor/session';

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
});
 
Template.body.helpers({
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
    tournamentSelected() {
        if(Tournaments.findOne({_id : Session.get('tID')}))
            return true;
        return false;
    },
});

Template.body.events({

    'click .tablinks'(event){
        
        document.getElementById('team-container').style.display = "none";
        document.getElementById('match-container').style.display = "none";
        document.getElementById('tournament-container').style.display = "none";
        
        
        if(event.target.id == 'team-tab'){
            document.getElementById('team-container').style.display = "block";
        } else if(event.target.id == 'tournament-tab'){
            document.getElementById('tournament-container').style.display = "block";
        } else if(event.target.id == 'match-tab'){
            document.getElementById('match-container').style.display = "block";
        }
    },  
    'click .tournament'(event){
//        console.log(event);
        Session.set('tID', event.target.title);
    },
    'submit .new-tournament'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        const target = event.target;
        const tournament = target.tournament.value;
        
        // Insert a task into the collection
        Meteor.call('tournaments.insert', tournament, function(error, result){
            console.log(result);
            Session.set('tID', result);
        });

        target.tournament.value = '';
        
    },
    'click .delete'(event) {
        Meteor.call('tournaments.remove', event.target.value);
    },
});
