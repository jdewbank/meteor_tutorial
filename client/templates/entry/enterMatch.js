import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { Matches } from '/imports/api/api.js';
import { Teams } from '/imports/api/api.js';

import './enterMatch.html';

Template.enterMatch.helpers({
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
    players(team) {
        if(team === 1)
        {
            if(Teams.findOne({_id: Session.get('team1ID')}) === undefined)
                return;
            return Teams.findOne({_id: Session.get('team1ID')}).players;
        }
        else
        {            
            if(Teams.findOne({_id: Session.get('team2ID')}) === undefined)
                return;
            return Teams.findOne({_id: Session.get('team2ID')}).players;
        }
    },
});

Template.enterMatch.events({  
    
    'submit .new-match'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        console.log(event);
        var t1Players = Teams.findOne({_id: Session.get('team1ID')}).players;
        console.log(t1Players);

        // Get value from form element
        const target = event.target;
        const rd = target.round.value;
        const t1 = target.team1.value;
        const t2 = target.team2.value;
        const s1 = target.score1.value;
        const s2 = target.score2.value;
        
        var i;
        for(i = 4;i < 4+(4*t1Players.length); ){
            console.log((t1Players[i/4 - 1]) + " got");
            console.log(target[i++].value);
            console.log(target[i++].value);
            console.log(target[i++].value);
            console.log(target[i++].value);
            console.log("next");
        }
        
        
        tID = Session.get('tID');

        // Insert a task into the collection
        Meteor.call('matches.insert', rd, t1, s1, t2, s2, tID);

        // Clear form
        target.round.value = '';
        target.team1.value = '';
        target.team2.value = '';
        target.score1.value = '';
        target.score2.value = '';
    },
    'change .team-select'(event){
        Session.set('team1ID', $("#team1").val());
        Session.set('team2ID', $("#team2").val());
    }
});

