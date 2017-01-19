angular.module('shared', ['ngMaterial', 'md.data.table'])

.controller('sharedController', ['$mdEditDialog', '$q', '$scope', '$timeout', '$stateParams', '$state', '$rootScope', 'MetaService', '$http', '$filter', '$compile', '$window',
	function ($mdEditDialog, $q, $scope, $timeout, $stateParams, $state, $rootScope, MetaService, $http, $filter, $compile, $window) {
  'use strict';


/*  */
  $rootScope.metaservice = MetaService;
/*  */


/* user data */
      $scope.userCity = "";
      $scope.userState = "";
      $scope.userEmail = "";
      $scope.userName = "";
      $scope.emailBody = "must";
      $scope.emailExample = "";
      $scope.emailIntro = "";
      $scope.emailOutro = "";
      $scope.makeEmailPublic = "";

      $scope.inputText = '';

      $scope.openLetters = [];

      $scope.$watch('inputText', function(newText, oldText) {
        $scope.emailBody = $scope.inputText;
      });

/* pagination page size */
  $scope.pageSize = 10;

/* PRODUCTS TABLE SETUP */
  $scope.selected = [];
  $scope.limitOptions = [5, 10, 15];
  
  $scope.options = {
    rowSelection: true,
    multiSelect: true,
    autoSelect: true,
    decapitate: false,
    largeEditDialog: false,
    boundaryLinks: false,
    limitSelect: true,
    pageSelect: true
  };
  
  $scope.query = {
    order: 'popularity',
    limit: 10,
    page: 1
  };
/* END TABLE SETUP */



/* SEO SETUP FOR STATES */
  if( $state.current.name == 'homepage' ){
      $rootScope.metaservice.set("#AskYourMayor | AskYourMayor.com", "Currently, every U.S. city is deciding whether or not to become a sanctuary city for immigrants. Email your mayor with your thoughts about becoming a sanctuary city today!");  
   } else if( $state.current.name == 'productpage' ){
      $rootScope.metaservice.set( $scope.productName + " - Virtual Data Room Product Overview | DataRoomSearch.com",   $scope.productName + " complete product profile, including data room pricing, features, and reviews.");  
   } else if( $state.current.name == 'comparepage' ){
      $rootScope.metaservice.set( "Compare " +   $scope.compareProduct1 + " vs " + $scope.compareProduct2 + " Data Rooms | DataRoomSearch.com", "Compare " + $scope.compareProduct1 + " vs " + $scope.compareProduct2 + " Data Rooms.");  
   } else if( $state.current.name == 'guide' ){
      $rootScope.metaservice.set( "data room buyer's guide | DataRoomSearch.com", "guide");  
   } else {}

/* END SEO SETUP */

// Select product data when a product page is requested
  if( $state.current.name == 'productpage' ){
  	  $scope.selectedProduct = $scope.products.data.filter(function( obj ) {
	  return obj.urlSlug == $stateParams.productName;
	  });
  	} else {}

// switch buttons on mouseover so data for mailto exists

      $scope.switchBlueButton = function() {
          $scope.showBlueEmailButton = 'show';
      }

      $scope.switchRedButton = function() {
          $scope.showRedEmailButton = 'show';
      }
        // Hide loading image on state change success
    $scope.doneLoading = 'false';
    if( !$state.current.name ) { 
      $scope.doneLoading = 'true';  
    } else {
      $scope.doneLoading = 'false';
    }
    


     // api call for mayor & city officals

      $scope.getCivicData = function (){

      if( $scope.userState.length >= 2 || $scope.userCity.length >= 3){
      $http({
            //  url: 'http://api.giphy.com/v1/gifs/random',
                url : 'https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyCxbmvVMAG7TkNmY7vOuldHS2TJYHyvSPo&address=' + $scope.userCity + '%20' + $scope.userState,
                method: 'GET',

            //  params: {api_key: 'dc6zaTOxFJmzC', tag: self.selected.tag},
                dataType: 'jsonp',
                data: ''
              }).then(function successCallback(response) {
                  $scope.response = response.data; 
                  console.log($scope.response)
                   $scope.message = "show";
                       for (var index = 0; index < response.data.offices.length; index++) {
                        console.log(response.data.offices[index]);
                        if (response.data.offices[index].name == 'Mayor'){
                          $scope.theMayor = "here";
                        }
                        debugger
                        
                        if (response.data.offices[index].name == 'Sheriff'){
                          $scope.theSheriff == "here";
                              } else {}
                      }
                  // this callback will be called asynchronously
                  // when the response is available
                }, function errorCallback(error) {
                  $scope.error = error;
                  
                  // called asynchronously if an error occurs
                  // or server returns response with an error status.
                });
             
          }else{
            $scope.missingData = "needLoc";
          }
      }

     // api call for creating new public post
      $scope.getPublicPosts = function (){
      $scope.loadingIcon = 'show';
      $http({
            //  url: 'http://api.giphy.com/v1/gifs/random',
                url: 'https://api.askyourmayor.com/publicEmails',
                method: 'GET'

              }).then(function successCallback(response) {
                  $scope.openLetters = angular.fromJson(response.data);
                  $scope.message = "show";    
                  console.log($scope.openLetters) 

                  // this callback will be called asynchronously
                  // when the response is available
                }, function errorCallback(error) {
                  $scope.error = error;
                  
                  // called asynchronously if an error occurs
                  // or server returns response with an error status.
                });
            }
      if($state.current.name == 'home' || $state.current.name == 'home2') {
      $scope.getPublicPosts();
      }

     // api call to get all public posts
      $scope.postEmail = function (){

      $http({
            method: 'POST',
            url: 'https://api.askyourmayor.com/createUser' + '?userName=' + $scope.userName + '&userCity=' + $scope.userCity + '&userState=' + $scope.userState + '&userEmail=' + $scope.userEmail,
      }).success(function () {
        $scope.successPost = 'show';

         }), function errorCallback(error) {
                  $scope.error = error;
                  
                  // called asynchronously if an error occurs
                  // or server returns response with an error status.
                };
      $scope.createPost()
    }

    $scope.createPost = function () {
         if($scope.postInhibitor !== 'inh') {
          debugger
          $http({

          method: 'POST',
          url: 'https://api.askyourmayor.com/createEmail' + '?title=Some title' + '&content=' + $scope.emailBody + '&userName=' + $scope.userName + '&userCity=' + $scope.userCity + '&userState=' + $scope.userState + '&makeEmailPublic=' + $scope.makeEmailPublic,
      }).success(function () {

          $scope.successPost = 'show';
          $scope.postInhibitor = 'inh';

      }), function errorCallback(error) {
                  $scope.error = error;
                  
                  // called asynchronously if an error occurs
                  // or server returns response with an error status.
                };
          }
    }

    $scope.postbutton = function (){
      $scope.postToSite == 'show';
      $scope.postEmail()
    }

    $scope.callSheriff = function () {
      $scope.successCallSheriff = 'show';
    }
    $scope.callMayor = function () {
      $scope.successCallMayor = 'show';
    }
// Select product data when


  $scope.loadMore = function() {
    var last = $scope.openLetters[$scope.openLetters.length - 1];
    for(var i = 1; i <= 8; i++) {
      $scope.openLetters.push(last + i);
    }
  };
  
  $scope.loadStuff = function () {
    $scope.promise = $timeout(function () {
      // loading
    }, 2000);
  }


  // Select product data when a comparison page is requested
  if( $state.current.name == 'comparepage' ){
      //makes first product's entire object of data available in the comparison state
      $scope.compare1 = $scope.products.data.filter(function( obj ) {
    return obj.urlSlug == $scope.compareProduct1;
    });
      //makes second product's entire object of data available in the comparison state
      $scope.compare2 = $scope.products.data.filter(function( obj ) {
    return obj.urlSlug == $scope.compareProduct2;
    });
    } else {}
  
  $scope.unlogItem = function (item) {
    console.log(item.name, 'was deselected');
  	if( $scope.compareProduct1 !== undefined ){
  		$scope.compareProduct1 = undefined;
  	} else if ( $scope.compareProduct2 !== undefined ) {
  		$scope.compareProduct2 = undefined;
  	}
  };

  $scope.logOrder = function (order) {
    console.log('order: ', order);
  };
  
  $scope.logPagination = function (page, limit) {
    console.log('page: ', page);
    console.log('limit: ', limit);
  }
}]);
