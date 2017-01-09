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
      $scope.emailBody = "";
      $scope.emailIntro = "";
      $scope.emailOutro = "";
      $scope.makeEmailPublic = "";

      $scope.inputText = '';

$scope.$watch('inputText', function(newText, oldText) {
  $scope.emailBody = $scope.inputText;
});


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

      if( $scope.userState.length >= 2 ){
      $http({
            //  url: 'http://api.giphy.com/v1/gifs/random',
                url : 'https://www.googleapis.com/civicinfo/v2/representatives/ocd-division/country:us/state:ca/place:san_diego?key=AIzaSyCxbmvVMAG7TkNmY7vOuldHS2TJYHyvSPo',
                method: 'GET',

            //  params: {api_key: 'dc6zaTOxFJmzC', tag: self.selected.tag},
                dataType: 'jsonp',
                data: ''
              }).then(function successCallback(response) {
                  $scope.response = response.data;
                  $scope.message = "show";
                 
                  console.log($scope.response) 

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
                url: 'http://127.0.0.1:5000/publicEmails',
                method: 'GET'

              }).then(function successCallback(response) {
                  $scope.publicPosts = response.data;
                  $scope.message = "show";
                 
                  console.log($scope.response) 

                  // this callback will be called asynchronously
                  // when the response is available
                }, function errorCallback(error) {
                  $scope.error = error;
                  
                  // called asynchronously if an error occurs
                  // or server returns response with an error status.
                });
            }
      $scope.getPublicPosts();


     // api call to get all public posts
      $scope.postEmail = function (){

      $http({
            method: 'POST',
            url: 'http://127.0.0.1:5000/createUser' + '?userName=' + $scope.userName + '&userCity=' + $scope.userCity + '&userState=' + $scope.userState + '&userEmail=' + $scope.userEmail,
      }).success(function () {

         }), function errorCallback(error) {
                  $scope.error = error;
                  
                  // called asynchronously if an error occurs
                  // or server returns response with an error status.
                };
  //    if($scope.makePostPublic == 'true'){
      $scope.createPost()
  //    }
    }

    $scope.createPost = function () {
         
          $http({

          method: 'POST',
          url: 'http://127.0.0.1:5000/createEmail' + '?title=thoughts about becoming a sanctuary city for immigrants' + '&content=' + 'Dear Mayor and city officials, my name is ' + $scope.userName + ' and I live in ' + $scope.userCity + ', ' + $scope.userState + '. ' + $scope.emailBody + ' Thank you for your time and consideration.' + 'Sincerely' + $scope.userName + '&userName=' + $scope.userName + '&userCity=' + $scope.userCity + '&userState=' + $scope.userState,
      }).success(function () {
          $scope.successMessage = 'show';
          debugger
      }), function errorCallback(error) {
                  $scope.error = error;
                  
                  // called asynchronously if an error occurs
                  // or server returns response with an error status.
                };
    }
// Select product data when a product page is requested

  
  $scope.toggleLimitOptions = function () {
    $scope.limitOptions = $scope.limitOptions ? undefined : [5, 10, 15];
  };
  
  $scope.getTypes = function () {
    return ['Candy', 'Ice cream', 'Other', 'Pastry'];
  };
  
  $scope.loadStuff = function () {
    $scope.promise = $timeout(function () {
      // loading
    }, 2000);
  }
  //logs item selection in the hompage datatable and uses the selected product's urlSlug as a unique identifier
  $scope.logItem = function (item) {
    console.log(item.name, 'was selected');
  	if( $scope.compareProduct1 == undefined ){
  		$scope.compareProduct1 = item.urlSlug;
  	} else{
  		$scope.compareProduct2 = item.urlSlug;
  		$state.go("comparepage", {"compareProduct1": $scope.compareProduct1, "compareProduct2": $scope.compareProduct2});
  	}
  };

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