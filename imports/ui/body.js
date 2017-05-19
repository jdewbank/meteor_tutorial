import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
 
import { Matches } from '../api/matches.js';

import './match.js';
import './body.html';
import './enterMatch.js';
 
Template.body.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
});
 
Template.body.helpers({
    matches() {

        const instance = Template.instance();
        if(instance.state.get('hideCompleted')) {
            return Matches.find({checked : { $ne: true }}, { sort: { createdAt: -1 } });
        }
        // Show newest tasks at the top
        return Matches.find({}, { sort: { createdAt: -1 } } );
    },
    toDoCount() {
        return Matches.find({checked : { $ne: true}}).count();
    },
  
});

Template.body.events({
  'change .hide-completed input'(event, instance) {
      instance.state.set('hideCompleted', event.target.checked);
  },
  'click .tablinks'(event){
        console.log(event);
        var tabcontent, i;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        if(event.target.id == 'team-tab'){
            console.log("TEAM!");
            document.getElementById('team-container').style.display = "block";
        }
      
      if(event.target.id == 'match-tab')
            console.log("MATCH!");
            document.getElementById('match-container').style.display = "block";
  },
});


//        var i, tabcontent, tablinks;
//    
//        // Get all elements with class="tabcontent" and hide them
//        tabcontent = document.getElementsByClassName("tabcontent");
//        for (i = 0; i < tabcontent.length; i++) {
//            tabcontent[i].style.display = "none";
//        }
//
//        // Get all elements with class="tablinks" and remove the class "active"
//        tablinks = document.getElementsByClassName("tablinks");
//        for (i = 0; i < tablinks.length; i++) {
//            tablinks[i].className = tablinks[i].className.replace(" active", "");
//        }
//
//        // Show the current tab, and add an "active" class to the button that opened the tab
//        document.getElementById(tabName).style.display = "block";
////        evt.currentTarget.className += " active";