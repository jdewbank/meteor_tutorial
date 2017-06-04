import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
 
export const Matches = new Mongo.Collection('matches');
export const Teams = new Mongo.Collection('teams'); 
export const Tournaments = new Mongo.Collection('tournaments'); 
export const Players = new Mongo.Collection('players'); 

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
    Meteor.publish('players', function playersPublication() {
        return Players.find();
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
    
    'matches.insert'(rd, match, tournamentID) {
        
        if(! Meteor.userId()){
          throw new Meteor.Error('unauthorized',
            'Not logged in.');
        }
        
        match.rount = rd;
        match.tournamentID = tournamentID;
        match.createdAt = new Date();
        match.username = Meteor.user().username;
        
        
        var matchID = Matches.insert(match);
        
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
    
    'teams.insert'(team, tID, playerNames) {
        check(team, String);
        
        if(! Meteor.userId()){
            throw new Meteor.Error('unauthorized',
              'Not logged in.');
        }
        
        var players = [];
        
        var i;
        for(i = 0; i < playerNames.length; ++i){
            var playerID = Players.insert({
                playerName: playerNames[i],
            });
            players.push(playerID);
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