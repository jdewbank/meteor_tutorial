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
});