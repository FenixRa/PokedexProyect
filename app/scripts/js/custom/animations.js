$(document).ready(function() {
    $(function () {
        $('#myNavbar').on('shown.bs.collapse', function () {
            $(".glyphicon").removeClass("glyphicon glyphicon-align-justify").addClass("glyphicon glyphicon-remove");
        });

        $('#myNavbar').on('hidden.bs.collapse', function () {
            $(".glyphicon").removeClass("glyphicon glyphicon-remove").addClass("glyphicon glyphicon-align-justify");
        });

    });
    $("#myNavbar li").on("click", function() {
        $("#myNavbar li").removeClass("active");
        $(this).addClass("active");
    });
});