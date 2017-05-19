import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
 
import { Matches } from '../api/matches.js';
import './team.html';
 
Template.team.events({
    'click .delete'() {
        console.log(this._id);
        Meteor.call('teams.remove', this._id);
    },
});

Template.team.helpers({
   pct(id) {
    /this helper gives the percentage win-loss, counting ties as half a win/
       
        var total = 0;
        var wins = 0;
        
        var matches = Matches.find({});
        
        
        matches.forEach((match) => {
            if(match.t1 === id || match.t2 === id){
                total += 1;
                
                if(match.s1 === match.s2){
                    wins += .5;
                } else if (match.t1 === id && match.s1 > match.s2) {
                    wins += 1;
                } else if (match.t2 === id && match.s2 > match.s1) {
                    wins += 1;
                }
            }
        });
        
        if(total === 0)
            return 0.0;
        return (wins / total);
           
   },
   wins(id) {
    /this helper gives the total number of wins (not counting ties)/
       
        var total = 0;
        var wins = 0;
        
        var matches = Matches.find({});
        
        
        matches.forEach((match) => {
            if(match.t1 === id || match.t2 === id){
                total += 1;
                
                if (match.t1 === id && match.s1 > match.s2) {
                    wins += 1;
                } else if (match.t2 === id && match.s2 > match.s1) {
                    wins += 1;
                }
            }
        });
        
        if(total === 0)
            return 0.0;
        return (wins);           
   },
   ties(id) {
    /this helper gives the number of ties only/
       
        var total = 0;
        var ties = 0;
        
        var matches = Matches.find({});
        
        
        matches.forEach((match) => {
            if(match.t1 === id || match.t2 === id){
                total += 1;
                
                if(match.s1 === match.s2){
                    ties += 1;
                }
            }
        });
        
        if(total === 0)
            return 0.0;
        return ties;      
   },
   losses(id) {
    /this helper gives the number of losses by subtracting the number of wins from the total/
       
        var total = 0;
        var wins = 0;
        
        var matches = Matches.find({});
        
        
        matches.forEach((match) => {
            if(match.t1 === id || match.t2 === id){
                total += 1;
                
                if (match.t1 === id && match.s1 > match.s2) {
                    wins += 1;
                } else if (match.t2 === id && match.s2 > match.s1) {
                    wins += 1;
                }
            }
        });
        
        if(total === 0)
            return 0.0;
        return (total - wins);           
   },

});