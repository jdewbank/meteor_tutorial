import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Matches = new Mongo.Collection('matches');
export const Teams = new Mongo.Collection('teams'); 
export const Tournaments = new Mongo.Collection('tournaments'); 

Meteor.methods({
    'tournaments.insert'(tournament){
        check(tournament, String);
        
        if(! Meteor.userId()){
            throw new Meteor.Error('not-authorized');
        }
        
        var tID = Tournaments.insert({
            title: tournament,            
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username,
            matches: [],
        });
        
        return tID;
    },
    'tournaments.remove'(tournamentID){
        check(tournamentID, String);
        Tournaments.remove(tournamentID);
    },
    
    'matches.insert'(t1, s1, t2, s2, tID) {
        check(t1, String);
        check(t2, String);
        
        
        if(! Meteor.userId()){
            throw new Meteor.Error('not-authorized');
        }
        
        var mID = Matches.insert({
            t1,
            s1,
            t2,
            s2,
            tID,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username,
        });
        
        var t = Tournaments.findOne({_id: tID});
        t.matches.push(mID);
        
    },
    'matches.remove'(matchId){
        check(matchId, String);
        Matches.remove(matchId);
    },
    'matches.setChecked'(matchId, setChecked){
        check(matchId, String);
        check(setChecked, Boolean);
        
        Matches.update(matchId, { $set: { checked: setChecked } });
    }, 
    'teams.insert'(team, tID) {
        check(team, String);
        console.log(Tournaments.find({tID: tID}));
        
        if(! Meteor.userId()){
            throw new Meteor.Error('not-authorized');
        }
        
        Teams.insert({
            tID,
            teamName: team,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username,
        });
    },
    'teams.remove'(team){
        check(team, String);
        console.log(team);
        Teams.remove(team);
    },
});