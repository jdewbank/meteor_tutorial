import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';


import { Players } from '/imports/api/api.js';

import './playerAnswerCount.html';

Template.playerAnswerCount.helpers({  
    findPlayerById(id) {
        if(Players.find(id).count() > 0){
            return Players.findOne(id).playerName;
        } else {
            return "Player Not Found";
        }
    },
});

