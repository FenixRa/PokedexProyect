'use strict';
var Poke = angular.module('pokedex',['ngRoute','ngStorage']);

Poke.config(['$routeProvider',
    function ($routeProvider) {
    $routeProvider.
    when('/MainMenu',{
        templateUrl: 'templates/main.html',
        controller: 'MainMenuController',
        title: 'All pokemon',
        menuAction: true
    }).
    when('/Description/',{
        templateUrl: 'templates/description.html',
        controller: 'DescriptionController',
        title: 'Description',
        menuAction: false
    }).
    otherwise({
        redirectTo: '/MainMenu'

    });
}]);

Poke.service('SharedProperties',function () {
    var objectPoke = null;
    var detailsPoke = null;
    var locationPoke = null;
    var menuIcon = true;
    return{
        setObject: function (item) {
            objectPoke = item;
        },
        getObject: function () {
            return objectPoke;
        },
        setDetails: function (item) {
            detailsPoke = item;
        },
        getDetails: function () {
            return detailsPoke;
        },
        setLocation: function (item) {
            locationPoke = item;
        },
        getLocation: function () {
            return locationPoke;
        },
        setMenu: function (item) {
          menuIcon = item;
        },
        getMenu: function () {
          return menuIcon;
        }
    }
});

Poke.controller('NavBarController',function ($scope,SharedProperties) {
    $scope.$on('$routeChangeSuccess', function (event, data) {
        $scope.pageTitle = data.title;
        $scope.menu = data.menuAction;
    });
    $scope.menu = SharedProperties.getMenu();

});

Poke.controller('MainMenuController',function ($scope, $http, $localStorage,$q,SharedProperties) {
    SharedProperties.setMenu(true);
    $scope.$storage = $localStorage;
    $scope.publist = [];
    $scope.detailList = [];
    $scope.locationList = [];
    $scope.order = false;

    if(!$scope.$storage.isDataSaved){
        for(var i=1; i<=15; i++)
        {
            newFetching(i);
        }
        $scope.$storage.main = $scope.publist;
        $scope.$storage.detail = $scope.detailList;
        $scope.$storage.location = $scope.locationList;
        $scope.$storage.isDataSaved = true;

    }else{
        $scope.publist = $scope.$storage.main;
        $scope.detailList = $scope.$storage.detail;
        $scope.locationList = $scope.$storage.location;
    }



    function newFetching(i) {
        $scope.pokeList = $http.get('http://pokeapi.co/api/v2/pokemon/'+i+'',{cache: false});
        $scope.pokeLocation = $http.get('http://pokeapi.co/api/v2/pokemon/'+i+'/encounters',{cache: false});
        $scope.pokeDetail = $http.get('http://pokeapi.co/api/v2/pokemon-species/'+i+'',{cache:false});

        $q.all([$scope.pokeList, $scope.pokeDetail,$scope.pokeLocation]).then(function (response) {
            $scope.publist.push({name: response[0].data.name,
                id: response[0].data.id,
                icon: response[0].data.sprites.front_default,
                types: response[0].data.types,
                weight: response[0].data.weight,
                height: response[0].data.height,
                abilities: response[0].data.abilities,
                locations: response[0].data.location_area_encounters});

            $scope.detailList.push(response[1].data);
            $scope.locationList.push(response[2].data);



        });
    }


    $scope.changeOrder = function () {
        $scope.order = !$scope.order;
    };

    $scope.selectedPokemon = function (item) {
        SharedProperties.setObject(item);

    };
    $scope.selectedDetail = function (item) {
        SharedProperties.setDetails($scope.detailList[item]);
    }
    $scope.selectedLocation = function (item) {
        SharedProperties.setLocation($scope.locationList[item]);
    }

});

Poke.controller('DescriptionController',function ($scope, $http,SharedProperties) {
    SharedProperties.setMenu(false);
    $scope.pokemon = SharedProperties.getObject();
    $scope.additionaldettails = SharedProperties.getDetails();
    $scope.locationdata = SharedProperties.getLocation();


});

Poke.filter('capitalize', function() {
    return function(input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});

Poke.filter('searchName',function () {
    return function (arr, searchString) {

        if(!searchString){
            return arr;
        }

        var result = [];

        searchString = searchString.toLowerCase();
        
        angular.forEach(arr, function (item) {
            if(item.name.toLowerCase().indexOf(searchString)!== -1){
                result.push(item);
            }
        });
        return result;
    }

});

Poke.filter('listZeroes',function () {
    return function (n, len) {
        var num = parseInt(n, 10);
        len = parseInt(len, 10);
        if (isNaN(num) || isNaN(len)) {
            return n;
        }
        num = ''+num;
        while (num.length < len) {
            num = '0'+num;
        }
        return num;
    };
});

Poke.filter('removeUnderScores',function () {
    return function (input) {
        input = input || '-';

        return input.replace(/-/g, ' ');
    };
});


