import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Matches } from '/imports/api/api.js';
import { Teams } from '/imports/api/api.js';

import './resultsTab.html';

Template.results.helpers({
    results() {
        var currentTournamentID = 0;
        if(Meteor.user()){
            currentTournamentID = Meteor.user().profile.current_tournament;
        }
        return Teams.find({tID: currentTournamentID}, { sort: { createdAt: -1 } } );  
    },
    
});



