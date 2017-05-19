import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
 
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
    tournaments() {
        return Tournaments.find({}, { sort: { createdAt: -1 } } );
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
    'submit .new-tournament'(event) {
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const tournament = target.tournament.value;
 
    
    // Insert a task into the collection
    Meteor.call('tournaments.insert', tournament);
 
    // Clear form
    target.tournament.value = '';
  },
});
