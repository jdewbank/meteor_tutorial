import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Matches = new Mongo.Collection('matches');
export const Teams = new Mongo.Collection('teams'); 

Meteor.methods({
    'matches.insert'(t1, s1, t2, s2) {
        check(t1, String);
        check(t2, String);
        
        
        if(! Meteor.userId()){
            throw new Meteor.Error('not-authorized');
        }
        
        Matches.insert({
            t1,
            s1,
            t2,
            s2,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username,
        });
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
    'teams.insert'(team) {
        check(team, String);
        
        if(! Meteor.userId()){
            throw new Meteor.Error('not-authorized');
        }
        
        Teams.insert({
            team,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username,
        });
    },
});