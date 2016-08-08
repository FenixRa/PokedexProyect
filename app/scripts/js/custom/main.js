'use strict';
var Poke = angular.module('pokedex',['ngRoute','ngStorage','ui-notification']);


Poke.config(['$routeProvider', function ($routeProvider) {
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
    when('/ListBattle',{
        templateUrl: 'templates/lists.html',
        controller: 'battleController',
        title: 'Battlebox',
        menuAction: true

    }).
    when('/ListCaught',{
        templateUrl: 'templates/lists.html',
        controller: 'battleController',
        title: 'Caught pokemon',
        menuAction: true
    }).
    otherwise({
        redirectTo: '/MainMenu'

    });
}]);


Poke.factory('DownloadData',function ($http,$q,$localStorage) {
    var mainList =[];
    var detailList =[];
    var locationList =[];
    var evolutionList =[];
    var downloadData =[];
        if(!$localStorage.isDataSaved){
            for(var i =1; i<=5; i++){
                var caught= false;
                var battle= false;
                var pokeList = $http.get('http://pokeapi.co/api/v2/pokemon/'+i+'',{cache: false});
                var pokeLocation = $http.get('http://pokeapi.co/api/v2/pokemon/'+i+'/encounters',{cache: false});
                var pokeDetail = $http.get('http://pokeapi.co/api/v2/pokemon-species/'+i+'',{cache:false});
                var pokeEvolution = $http.get('http://pokeapi.co/api/v2/evolution-chain/'+i+'',{cache:false});
                downloadData.push($q.all([pokeList, pokeDetail,pokeLocation,pokeEvolution]).then(Download,Error));

            }
        }
    function Download(response){
        mainList.push({name: response[0].data.name,
            id: response[0].data.id,
            icon: response[0].data.sprites.front_default,
            types: response[0].data.types,
            weight: response[0].data.weight,
            height: response[0].data.height,
            abilities: response[0].data.abilities,
            locations: response[0].data.location_area_encounters,
            caught: caught,
            battle: battle});

        detailList.push(response[1].data);
        locationList.push(response[2].data);
        evolutionList.push(response[3].data);
    }
    function Error(response) {

    }

    return{
        downloadData: downloadData,
        mainList : mainList,
        detailList : detailList,
        locationList : locationList,
        evolutionList : evolutionList

    };



});


Poke.controller('NavBarController',function ($scope,SharedProperties) {
    $scope.$on('$routeChangeSuccess', function (event, data) {
        $scope.pageTitle = data.title;
        $scope.menu = data.menuAction;
    });
    $scope.menu = SharedProperties.getMenu();

});


Poke.controller('MainMenuController', function ($scope,$localStorage,$rootScope,DownloadData,SharedProperties, Notification) {
    SharedProperties.setMenu(true);
    $scope.order = false;
    if(!$scope.$storage){
        $scope.$storage = $localStorage;
        $scope.$storage = $localStorage.$default({
            caughtList: {},
            battleList: {},
        });
    }
    //$localStorage.$reset();
    if (typeof $scope.$storage.main !== 'undefined') {
        Notification.success({message: 'Welcome', positionY: 'bottom', positionX: 'center'});
        bindToView();


    }else{
        Notification.warning({message: 'Downloading data...', positionY: 'bottom', positionX: 'center'});
        passToStorage(DownloadData.mainList, DownloadData.detailList, DownloadData.locationList, DownloadData.evolutionList);
        bindToView();

    }


    function passToStorage(publist,detailList,locationList,evolutionList) {
            $scope.$storage.main = publist;
            $scope.$storage.detail = detailList;
            $scope.$storage.location = locationList;
            $scope.$storage.evolution = evolutionList;

    }
    function bindToView() {
        $scope.publist = $scope.$storage.main;
        $scope.detailList = $scope.$storage.detail;
        $scope.locationList = $scope.$storage.location;
        $scope.evolutionList = $scope.$storage.evolution;

    }

    $scope.changeOrder = function () {
        $scope.order = !$scope.order;
    }

    $scope.addBattleBox = function(item,index){
        SharedProperties.setBattle(item,index);
    }
    $scope.addCaught = function(item,index){
        SharedProperties.setCaught(item,index);

    }
    $scope.selectedPokemon = function (item) {
        SharedProperties.setObject(item);

    }
    $scope.selectedDetail = function (item) {
        SharedProperties.setDetails($scope.detailList[item]);
    }
    $scope.selectedLocation = function (item) {
        SharedProperties.setLocation($scope.locationList[item]);
    }
    $scope.selectedEvolution = function (item) {
        SharedProperties.setEvolution($scope.evolutionList[item]);
    }


});

Poke.controller('DescriptionController',function ($scope, $http,SharedProperties) {
    SharedProperties.setMenu(false);
    $scope.pokemon = SharedProperties.getObject();
    $scope.additionaldettails = SharedProperties.getDetails();
    $scope.locationdata = SharedProperties.getLocation();
    $scope.evolutions = SharedProperties.getEvolution();

    $scope.addCaught = function(item){
        SharedProperties.setCaught(item);

    }
    $scope.addBattleBox = function(item) {
        SharedProperties.setBattle(item);

    }

});

Poke.controller('battleController',function ($scope,SharedProperties) {
    $scope.listBattle = SharedProperties.getBattle();
    $scope.order = false;
    $scope.isCaught = SharedProperties.getType();
    if($scope.isCaught){
        $scope.listToShow = SharedProperties.getCaught();
    }else{
        $scope.listToShow = SharedProperties.getBattle();
    }
    $scope.changeOrder = function () {
        $scope.order = !$scope.order;
    }
});

Poke.service('SharedProperties',function ($localStorage) {
    var objectPoke = null;
    var detailsPoke = null;
    var locationPoke = null;
    var evolutionPoke = null;
    var listCaught = [];
    var listBattleBox = [];
    var isCaught = false;
    var menuIcon = true;
    function remove(index) {
        $localStorage.caughtList.splice(index,1)
        listCaught.splice(index,1);
    }
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
        },
        setEvolution: function (item) {
            evolutionPoke = item;
        },
        getEvolution: function () {
            return evolutionPoke;
        },
        setCaught: function (item,index) {
            listCaught.push(item);
            if (typeof $localStorage.caughtList !== 'undefined') {
                $localStorage.caughtList = listCaught;
            }else{
                $localStorage.caughtList.push(item);
            }

            if(!item.caught){
                item.caught = true;

            }else{
                item.caught = false;
                remove(index)
            }


        },
        getCaught: function () {

            return $localStorage.caughtList;
        },

        setBattle: function (item,index) {
            if (typeof $localStorage.battleList !== 'undefined') {
                $localStorage.battleList.push(item);
            }else{
                listBattleBox.push(item);
                $localStorage.battleList = listBattleBox;
            }

        },
        getBattle: function () {
            return $localStorage.battleList;

        },
        getType: function () {
            return isCaught;
        }
    }
});


Poke.filter('capitalize', function() {
    return function(input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    };
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
    };

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


