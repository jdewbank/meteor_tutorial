import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
 
export const Matches = new Mongo.Collection('matches');
export const Teams = new Mongo.Collection('teams'); 
export const Tournaments = new Mongo.Collection('tournaments'); 

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('matches', function matchesPublication() {
        return Matches.find();
    });
    Meteor.publish('teams', function teamsPublication() {
        return Teams.find();
    });
    Meteor.publish('tournaments', function tournamentsPublication() {
        return Tournaments.find();
    });
    Meteor.publish('roles', function (){
        return Meteor.roles.find();
    });
    Meteor.publish('users', function (){
        return Meteor.users.find();
    });
}

Meteor.methods({
    
    'users.addEditor' (uID, tournament){
        
        const isAdmin = Roles.userIsInRole(Meteor.userId(),
            ['admin']);
        if (! isAdmin) {
          throw new Meteor.Error('unauthorized',
            'Only admin can add editing permissions.');
        }
        
        
        Roles.addUsersToRoles(uID, 'editor', tournament);
    },
    'users.removeEditor' (uID, tournament){
        
        const isAdmin = Roles.userIsInRole(Meteor.userId(),
            ['admin']);
        if (! isAdmin) {
          throw new Meteor.Error('unauthorized',
            'Only admin can add editing permissions.');
        }
        
        
        Roles.removeUsersFromRoles(uID, 'editor', tournament);
    },
    
    'tournaments.insert'(tournament){
        check(tournament, String);
        
        if(! Meteor.userId()){
            throw new Meteor.Error('not logged in');
        }
        
        //Only admins can add tournaments
        const isAdmin = Roles.userIsInRole(Meteor.userId(),
            ['admin']);
        if (! isAdmin) {
          throw new Meteor.Error('unauthorized',
            'Only admin can add tournaments.');
        }
        
        
        
        var tID = Tournaments.insert({
            title: tournament,            
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username,
            matches: [],
            teams: [],
        });
        return tID;
    },
    'tournaments.remove'(tournamentID){
        check(tournamentID, String);

        var users = Roles.getUsersInRole('editor', tournamentID);
        
        //remove editing permissions for deleted tournament
        var uIDs = [];
        users.forEach(function(user){
            uIDs.push(user._id);
        });
      
        Roles.removeUsersFromRoles(
                uIDs,
                'editor',
                tournamentID
        );

        //remove matches and teams for this tournament
        Teams.remove({tID: tournamentID});
        Matches.remove({tID: tournamentID});
        
        //remove the tournament
        Tournaments.remove(tournamentID);
    },
    
    'matches.insert'(rd, t1, s1, t2, s2, tID) {
        check(t1, String);
        check(t2, String);
        
        
        if(! Meteor.userId()){
          throw new Meteor.Error('unauthorized',
            'Not logged in.');
        }
        
        
        var mID = Matches.insert({
            rd,
            t1,
            s1,
            t2,
            s2,
            tID,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username,
        });
        
        //Add match to its tournament
//        Tournaments.update(
//                {
//                    _id: tID
//                },
//                {
//                    $addToSet: {matches: mID}
//                }
//        );
        
    },
    'matches.remove'(matchId){
        check(matchId, String);
        
        Matches.remove(matchId);
    },
    
    'teams.insert'(team, tID, players) {
        check(team, String);
        
        if(! Meteor.userId()){
            throw new Meteor.Error('unauthorized',
              'Not logged in.');
        }
        
        var teamID = Teams.insert({
            tID,
            players,
            teamName: team,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username,
        });
        
        Tournaments.findOne({_id: tID}).matches.push(teamID);
    },
    'teams.remove'(teamID){
        check(teamID, String);
        
        if(! Meteor.userId()){
            throw new Meteor.Error('unauthorized',
              'Not logged in.');
        }
        
        //Remove all matches with that team
        Matches.remove({
            $or:[
                {
                    t1: teamID
                },
                {
                    t2: teamID
                }
            ]
        });
        
        //Remove team
        Teams.remove(teamID);
    },
});