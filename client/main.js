import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { Tournaments } from '/imports/api/api.js';

import '/imports/startup/accounts-config.js';
import './body.js';


Template.layout.helpers({
    currentTournament() {
        var tournament = Tournaments.findOne({_id : Session.get('tID')});
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