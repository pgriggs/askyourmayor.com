angular.module('shared', ['ngMaterial', 'md.data.table'])

.controller('sharedController', ['$mdEditDialog', '$q', '$scope', '$timeout', '$stateParams', '$state', '$rootScope', 'MetaService', '$http', '$filter', '$compile', '$window',
	function ($mdEditDialog, $q, $scope, $timeout, $stateParams, $state, $rootScope, MetaService, $http, $filter, $compile, $window) {
  'use strict';

  window.MYSCOPE = $scope

/*  */
     $rootScope.metaservice = MetaService;
/*  */


/* user data */

      $scope.userCity = "";
      $scope.userState = "";
      $scope.userEmail = "";
      $scope.userName = "";
      $scope.emailExample = "";
      $scope.emailIntro = "";
      $scope.emailOutro = "";
      $scope.makeEmailPublic = "";
      $scope.emailBody = "Acting as a sanctuary city improves the lives of all city residents. By encouraging all members of our communities to work with police without fear of deportation, authorities can do a better job of keeping our communities peaceful. Additionally, two out of every three unauthorized immigrants residing in the U.S. have been building lives here for over 10 years, and are soundly integrated into our local communities.";


      $scope.inputText = '';

      $scope.openLetters = [];

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
    

      // expose data from for loop within getCivicData function
      $scope.mayorEmail = "";
      $scope.SheriffEmail = "";
      $scope.mayorPhone = "";
      $scope.sheriffPhone = "";
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
                      // loop through list of elected offices google civic API response
                       for (var index = 0; index < response.data.offices.length; index++) {
                        console.log(response.data.offices[index]);
                        // check if mayor data exists in google civic API response 
                        if (response.data.offices[index].name == 'Mayor'){
                          $scope.theMayor = 'here';
                          var mayorIndex = response.data.offices[index].officialIndices[0];
                            // loop through array of officials from API reposonse to expose mayor's email to $scope
                            for (var index = 0; index < response.data.officials.length; index++) {
                              $scope.mayorEmail = response.data.officials[mayorIndex].emails[0];
                              $scope.mayorPhone = response.data.officials[mayorIndex].phones[0];
                            }
                            // loop through array of officials from API reposonse

                        } else {}
                      }
                        // loop through list of elected offices google civic API response
                         for (var index = 0; index < response.data.offices.length; index++) {
                          // check if mayor data exists in google civic API response 
                          if (response.data.offices[index].name == 'Sheriff'){
                            $scope.theSheriff = 'here';
                            var sheriffIndex = response.data.offices[index].officialIndices[0];
                              // loop through array of officials from API reposonse to expose mayor's email to $scope
                              for (var index = 0; index < response.data.officials.length; index++) {
                                $scope.sheriffEmail = response.data.officials[sheriffIndex].emails[0];
                                $scope.sheriffPhone = response.data.officials[sheriffIndex].phones[0];
                                debugger
                              }
                              // loop through array of officials from API reposonse

                          } else {}
                        }                      
                      // catch for Washington D.C. mayor's contact data - it's not associated with an office called "mayor" in the google civic database for some reason THANKS OBAMA
                      // for (var index = 0; index < response.data.officials.length; index++) {
                       
                      //  if (response.data.officials[index].name == 'Muriel Bowser'){
                      //    $scope.dcMayor = "here";
                      //    $scope.dcMayorEmail = response.data.officials[index].emails[0];
                      //  } else {}
                      //}
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

    $scope.emailSheriff = function () {
      $scope.successEmailSheriff = 'show';
      $scope.postEmail()
      $window.location = "mailto:" + $scope.sheriffEmail + "?cc=team@askyourmayor.com&subject=My%20thoughts%20on%20becoming%20a%20sanctuary%20city%20for%20immigrants&body=" + "Dear mayor and city officials,%0D%0A%0D%0AMy name is " + $scope.userName + " and I live in " + $scope.userCity + ", " + $scope.userState + ".%0D%0A%0D%0A" + $scope.emailBody + "%0D%0A%0D%0ASincerely,%0D%0A" + $scope.userName;
    }

    $scope.callSheriff = function () {
      $scope.successCallSheriff = 'show';
      $scope.postEmail()
      $window.location = "tel:" + $scope.sheriffPhone;
    }
    $scope.callMayor = function () {
      $scope.successCallMayor = 'show';
      $scope.postEmail()
      $window.location = "tel:" + $scope.mayorPhone;
    }

    $scope.emailMayor = function () {
      $scope.successEmailMayor = 'show';
      $scope.postEmail()
            $window.location = "mailto:" + $scope.mayorEmail + "?cc=team@askyourmayor.com&subject=My%20thoughts%20on%20becoming%20a%20sanctuary%20city%20for%20immigrants&body=" + "Dear mayor and city officials,%0D%0A%0D%0AMy name is " + $scope.userName + " and I live in " + $scope.userCity + ", " + $scope.userState + ".%0D%0A%0D%0A" + $scope.emailBody + "%0D%0A%0D%0ASincerely,%0D%0A" + $scope.userName;
    }
    $scope.postToAym = function () {
      $scope.postToAym = 'show';
      $scope.makeEmailPublic = 'true';
      $scope.postInhibitor = '';
      $scope.postEmail()
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
