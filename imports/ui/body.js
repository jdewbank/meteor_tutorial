import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
 
import { Matches } from '../api/matches.js';
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
});

Template.body.events({

    'click .tablinks'(event){

        document.getElementById('team-container').style.display = "none";
        document.getElementById('match-container').style.display = "none";
        
        if(event.target.id == 'team-tab'){
            document.getElementById('team-container').style.display = "block";
        }
      
        if(event.target.id == 'match-tab'){
            document.getElementById('match-container').style.display = "block";
        }
  },
});
