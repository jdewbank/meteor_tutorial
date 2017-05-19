import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
 
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