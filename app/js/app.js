var routerApp = angular.module('routerApp', ['ngMaterial', 'ui.router', 'shared', 'ngSanitize', '720kb.socialshare', 'angularUtils.directives.dirPagination', 'infinite-scroll']);

routerApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    
    $urlRouterProvider.otherwise('/');
    
    $stateProvider
        
        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/',
            templateUrl: 'views/home.html',
            controller: 'sharedController'
        })
        // HOME STATES AND NESTED VIEWS ========================================
        .state('contact', {
            url: '/contact',
            templateUrl: 'views/contact.html',
            controller: 'sharedController'
        })

        // HOME STATES AND NESTED VIEWS ========================================
        .state('nonLocal', {
            url: '/representative-contact-info/{state}',
            templateUrl: 'views/nonLocal-contact.html',
            controller: 'sharedController'
        });

        // use the HTML5 History API
        $locationProvider.html5Mode(true);
        
});


routerApp.service('MetaService', function() {

       var title = '';
       var metaDescription = '';
       var metaOgTitle = '';
       var metaOgImage = '';
       var metaOgUrl = '';

       return {
          set: function(newTitle, newMetaDescription, newMetaOgTitle, newMetaOgImage, newMetaOgUrl) {
              metaDescription = newMetaDescription;
              title = newTitle;
              metaOgTitle = newMetaOgTitle;
              metaOgImage = newMetaOgImage;
              metaOgUrl = newMetaOgUrl;
          },
          metaTitle: function(){ return title; },
          metaDescription: function() { return metaDescription; },
          metaOgTitle: function() { return metaOgTitle; },
          metaOgImage: function() { return metaOgImage; },
          metaOgUrl: function() { return metaOgUrl; }
       }
    });

routerApp.directive('compile', ['$compile', function ($compile) {
    return function(scope, element, attrs) {
        scope.$watch(
            function(scope) {
                // watch the 'compile' expression for changes
                return scope.$eval(attrs.compile);
            },
            function(value) {
                // when the 'compile' expression changes
                // assign it into the current DOM
                element.html(value);

                // compile the new DOM and link it to the current
                // scope.
                // NOTE: we only compile .childNodes so that
                // we don't get into infinite loop compiling ourselves
                $compile(element.contents())(scope);
            }
        );
    };
}]);