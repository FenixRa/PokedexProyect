'use strict';
var Poke = angular.module('pokedex',['ngRoute']);

Poke.config(['$routeProvider',
    function ($routeProvider) {
    $routeProvider.
    when('/MainMenu',{
        templateUrl: 'templates/main.html',
        controller: 'MainMenuController',
        title: 'All pokemon'
    }).
    when('/Description/',{
        templateUrl: 'templates/description.html',
        controller: 'DescriptionController',
        title: 'Description'
    }).
    otherwise({
        redirectTo: '/MainMenu'

    });
}]);

Poke.service('SharedProperties',function () {
    var objectPoke = null;
    var stateButton = 0;
    return{
        setObject: function (item) {
            objectPoke = item;
        },
        getObject: function () {
            return objectPoke;
        },
        setBtn: function (id) {
            stateButton = id;
        },
        getBtn: function () {
            return stateButton;
        }
    }
});

Poke.controller('NavBarController',function ($scope,SharedProperties) {
    SharedProperties.setBtn(0);
    $scope.$on('$routeChangeSuccess', function (event, data) {
        $scope.pageTitle = data.title;
    });

    $scope.btnIcon=["glyphicon glyphicon-align-justify", "glyphicon glyphicon-remove"];

    $scope.getIcon = function () {
        $scope.btn = SharedProperties.getBtn();
        return $scope.btnIcon[$scope.btn];
    }
});

Poke.controller('MainMenuController',function ($scope, $http, SharedProperties) {
    $scope.publist = [];
    $scope.order = false;
    for(var i=1; i<=10; i++)
    {
        fetching(i);
    }


    function fetching(i){
        $http({
            method: 'GET',
            url: 'http://pokeapi.co/api/v2/pokemon/'+i+''

        }).then(function successCallback(response) {
            $scope.listpokemons = response.data;
            $scope.publist.push({name: $scope.listpokemons.name,
                             id: $scope.listpokemons.id,
                             icon: $scope.listpokemons.sprites.front_default,
                             types: $scope.listpokemons.types,
                             weight: $scope.listpokemons.weight,
                             height: $scope.listpokemons.height});
        }, function errorCallback(response) {

        });

    }
    $scope.changeOrder = function () {
        $scope.order = !$scope.order;
    };

    $scope.selectedPokemon = function (item) {
        SharedProperties.setObject(item);
    };

});

Poke.controller('DescriptionController',function ($scope, $http,SharedProperties) {
    SharedProperties.setBtn(1);
    $scope.pokemon = SharedProperties.getObject();

    fetchadditional($scope.pokemon.id);
    function fetchadditional(i) {
        $http({
            method: 'GET',
            url: 'http://pokeapi.co/api/v2/pokemon-species/'+i+''

        }).then(function successCallback(response) {
            $scope.additionaldettails = response.data;

        }, function errorCallback(response) {

        });
    }

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


