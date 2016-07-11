var INSTA_API_BASE_URL = "https://api.instagram.com/v1";
var app = angular.module('Instamood',[]);

app.controller('MainCtrl', function($scope, $http) {
	$scope.hasToken = true;
	var token = window.location.hash;
	console.log(token);
  if (!token) {
    $scope.hasToken = false;
  }
  token = token.split("=")[1];

  $scope.getInstaPics = function() {
	  var path = "/users/self/media/recent";
	  var mediaUrl = INSTA_API_BASE_URL + path;
	  $http({
	    method: "JSONP",
	    url: mediaUrl,
	    params: {
	    	callback: "JSON_CALLBACK",
	    	access_token: token
	  		 
	    }
	  }).then(function(response) {
	    console.log(response);
      $scope.picArray = response.data.data;
      console.log($scope.picArray);
      
      // ego calculator
      var ego = 0;
      for (var i = 0; i < $scope.picArray.length; i++) {
       	if ($scope.picArray[i].user_has_liked === true) { 
       		ego++;
       	}
       $scope.egoScore = (ego / $scope.picArray.length) * 100;
      }

      // popularity avg
      var pop = 0; 
      for (var i = 0; i < $scope.picArray.length; i++) {
       	pop += $scope.picArray[i].likes.count;
       		
      }
      $scope.popScore = pop / $scope.picArray.length;

      // avg caption length
      var len = 0;
      for (var i = 0; i < $scope.picArray.length; i++) {
       	if ($scope.picArray[i].caption != null) {
       		len += $scope.picArray[i].caption.text.length;
       	}
      }
      $scope.capLength = len / $scope.picArray.length;

      // hash average 	
      var hashCount = 0;
        for (var i = 0; i < $scope.picArray.length; i++) {
       		for (var k = 0; i < $scope.picArray.length; i++) {
       			if ($scope.picArray[i].caption != null) {
	       			if ($scope.picArray[i].caption.text[k] === "#") {
	       				hashCount++;

	       			}
	       		}	
       		}
       	}
      $scope.hashAvg = hashCount / $scope.picArray.length;
      console.log($scope.hashAvg);

      for(var i = 0; i<$scope.picArray.length; i++) {
        if ($scope.picArray[i].caption != null) {
          analyzeSentiments(i);
        } 
      }
      // now analyze the sentiments and do some other analysis
      // on your images 
	  })
	};


	var analyzeSentiments = function(imgIdx) {
    $http({
      method: 'GET', 
      url: 'https://twinword-sentiment-analysis.p.mashape.com/analyze/',
      headers: { 
        'X-Mashape-Key': 'tSRYMPdzjhmshV3dNAFWDnoSbOIJp1XPohtjsn7Gd3HbXxfIsb',
      },
      params: { 
        text: $scope.picArray[imgIdx].caption.text,

      }


    }).then(function(response) {
      $scope.picArray[imgIdx]['score'] = response.data.score;
      console.log(response);
      

    })
    
	}




});
