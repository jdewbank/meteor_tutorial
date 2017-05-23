import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
 
import { Teams } from '/imports/api/api.js';

import './match.html';
 
Template.match.events({
  'click .toggle-checked'() {
    // Set the checked property to the opposite of its current value
    Meteor.call('matches.setChecked', this._id, !this.checked);
  },
  'click .delete'() {
    Meteor.call('matches.remove', this._id);
  },
});

Template.match.helpers({
   getTeamFromId(id) {
       if(Teams.find(id).count() > 0){
           return Teams.findOne(id).teamName;
       } else {
           return id;
       }
   },
});