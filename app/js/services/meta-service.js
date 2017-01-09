angular.module('routerApp');

routerApp.service('MetaService', function() {
       var title = 'Web App';
       var metaDescription = 'sdcdsc';
       var metaKeywords = '';
       return {
          set: function(newTitle, newMetaDescription, newKeywords) {
              metaKeywords = newKeywords;
              metaDescription = newMetaDescription;
              title = newTitle; 
          },
          metaTitle: function(){ return title; },
          metaDescription: function() { return metaDescription; },
          metaKeywords: function() { return metaKeywords; }
       }
    });