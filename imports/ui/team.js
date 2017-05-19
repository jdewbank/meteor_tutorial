import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
 
import './team.html';
 
Template.team.events({
  'click .delete'() {
    Meteor.call('teams.remove', this._id);
  },
});