import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { ReactiveVar } from 'meteor/reactive-var';

import { Tournaments } from '/imports/api/api.js';

import '/imports/startup/accounts-config.js';
import './body.js';


Template.layout.onCreated(function(){
});

Template.layout.helpers({
    currentTournament() {
        
        var currentTournamentID = 0;
        if(Meteor.user()){
            currentTournamentID = Meteor.user().profile.current_tournament;            
        }
        var tournament = Tournaments.findOne({_id : currentTournamentID});
        if(tournament){
            return tournament.title;            
        }
        else{
            return "No Tournament Selected";
        }
    },
});

Template.layout.events({

    'click .tablinks'(event){
        Router.go('/' + event.target.id);
    },      
});