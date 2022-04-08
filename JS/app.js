$(document).ready(function () {
    theme = $('#theme');
    function getCookie(name) {
        var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }
    let name = getCookie('name');
    $("#submited").on("click", function () {
        console.log("Hello");
        newname = $('#regname').val();
        document.cookie = "name=" +newname + ";max-age=1e7";
        $(".newUser").html("Hello " +newname);
        $(".newUser").addClass('buttons');
    });

    if (name != undefined) {
        $(".newUser").html("Hello " +name);
        $(".newUser").addClass('buttons');
    };
    theme.click(function () {
        if (theme.text() == "Theme: dark") {
            theme.text("Theme: light");
            $("body").css("background", "#CCCCCC");
            $(".grid>header, footer").css("background-color", "#AAAAAA");
            $(".grid2>div>a").css("color", "#000000BB");
            $(".grid2>div>a").hover(function () {
                $(this).css("color", "rgb(63, 113, 250)");
            }, function () {
                $(this).css("color", "#000000BB");
            });
            $("#theme").css("color", "#000");
            $(".buttons").css("color", "#000");
            $(".newUser input").css("background", "#EEEEEE");
            $("#regname").css("color", "rgb(0, 0, 0)");   
            $('#regname').addClass('reg');
        } else {
            theme.text("Theme: dark");
            $("body").css("background", "#222222FF");
            $(".grid>header, footer").css("background-color", "#353535");
            $(".grid2>div>a").css("color", "#FFFFFF90");
            $(".grid2>div>a").hover(function () {
                $(this).css("color", "rgb(33, 60, 125)");
            }, function () {
                $(this).css("color", "#FFFFFF90");
            });
            $("#theme").css("color", "rgb(63, 113, 250)");
            $(".buttons").css("color", "rgb(63, 113, 250)");
            $(".newUser input").css("background", "#696969");   
            $("#regname").css("color", "rgb(255, 255, 255)"); 
            $('#regname').removeClass('reg');        
    

        }
    });


})