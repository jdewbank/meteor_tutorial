import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { Matches } from '/imports/api/api.js';
import { Teams } from '/imports/api/api.js';
import { Players } from '/imports/api/api.js';

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

        var t1Players = Teams.findOne({_id: Session.get('team1ID')}).players;
        var t2Players = Teams.findOne({_id: Session.get('team2ID')}).players;

        // Get value from form element
        const target = event.target;
        const rd = target.round.value;
        const t1 = target.team1.value;
        const t2 = target.team2.value;
        const s1 = target.score1.value;
        const s2 = target.score2.value;
        
        
        //Create first match team
        var matchTeam1 = {};
        matchTeam1.type = "MatchTeam"
        matchTeam1.team = t1;
        matchTeam1.points = s1;
        matchTeam1.matchPlayers = [];
        
        var i, j;
        for(i = 0, j = 4; i < t1Players.length; ++i){
            var matchPlayer = {};
            matchPlayer.type = "MatchPlayer"
            matchPlayer.player = Players.findOne({_id: t1Players[i]});
            
            var tuh = target[j++].value;
            matchPlayer.tossups_heard = tuh;
            
            var playerAnswerCount1 = target[j++].value;
            var playerAnswerCount2 = target[j++].value;
            var playerAnswerCount3 = target[j++].value;
            
            matchPlayer.answerCounts = [playerAnswerCount1, playerAnswerCount2, playerAnswerCount3];
            
            matchTeam1.matchPlayers.push(matchPlayer);
        }
        
        //create second match team
        var matchTeam2 = {};
        matchTeam2.type = "MatchTeam"
        matchTeam2.team = t2;
        matchTeam2.points = s2;
        matchTeam2.matchPlayers = [];
        
        for(i = 0, j = 4; i < t2Players.length; ++i){
            var matchPlayer = {};
            matchPlayer.player = Players.findOne({_id: t2Players[i]});
            
            var tuh = target[j++].value;
            matchPlayer.tossups_heard = tuh;
            
            var playerAnswerCount1 = target[j++].value;
            var playerAnswerCount2 = target[j++].value;
            var playerAnswerCount3 = target[j++].value;
            
            matchPlayer.answerCounts = [playerAnswerCount1, playerAnswerCount2, playerAnswerCount3];
            
            matchTeam2.matchPlayers.push(matchPlayer);
        }
        
        console.log(matchTeam1);
        
        tID = Session.get('tID');

        var match = {}
        match.type = "Match";
        match.match_teams = [matchTeam1, matchTeam2];
        match.round = rd;


        // Insert a match into the collection
        Meteor.call('matches.insert', match, tID);

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

