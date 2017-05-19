import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
 
import { Matches } from '../api/methods.js';
import { Teams } from '../api/methods.js';

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

//        const instance = Template.instance();
//        if(instance.state.get('hideCompleted')) {
//            return Matches.find({checked : { $ne: true }}, { sort: { createdAt: -1 } });
//        }
        // Show newest tasks at the top
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
//  'change .hide-completed input'(event, instance) {
//      instance.state.set('hideCompleted', event.target.checked);
//  },
  'click .tablinks'(event){
        console.log(event);
//        var tabcontent, i;
//        tabcontent = document.getElementsByClassName("tabcontent");
//        for (i = 0; i < tabcontent.length; i++) {
//            tabcontent[i].style.display = "none";
//        }
        document.getElementById('team-container').style.display = "none";
        document.getElementById('match-container').style.display = "none";
        
        if(event.target.id == 'team-tab'){
            console.log("TEAM!");
            document.getElementById('team-container').style.display = "block";
        }
      
      if(event.target.id == 'match-tab')
            console.log("MATCH!");
            document.getElementById('match-container').style.display = "block";
  },
});
