module.exports = function () {
    var client = './app/';


    var config = {
        temp: './test',
        dist: './dist',

        //All .js files
        alljs:[client+ 'scripts/js/lib/**/*.js'],


        //All .less files
        less:[client + 'styles/mycss.less']

    };

    return config;

};