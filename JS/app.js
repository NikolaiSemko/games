$(document).ready(function () {
    theme = $('#theme');
    function getCookie(name) {
        var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    let name = getCookie('name');

    $("#submited").on("click", function () {
        newname = $('#regname').val();
        document.cookie = "name=" + newname + ";max-age=1e7";
        $(".newUser").html("Hello " + newname);
        $(".newUser").addClass('buttons');
    });

    if (name != undefined) {
        $(".newUser").html("Hello " + name);
        $(".newUser").addClass('buttons');
    };

    if (name == undefined) {
        name = 'Nobody';
    }


    let score_game1 = getCookie('score_game1');
    let score_game2 = getCookie('score_game2');
    let score_game3 = getCookie('score_game3');
    let score_game4 = getCookie('score_game4');
    if (score_game1 == undefined) {
        score_game1 = '0';
    }
    if (score_game2 == undefined) {
        score_game2 = '0';
    }
    if (score_game3 == undefined) {
        score_game3 = '0';
    }
    if (score_game4 == undefined) {
        score_game4 = '0';
    }
    let result = { name: name, score_game: [score_game1, score_game2, score_game3, score_game4] };
    let data = JSON.stringify(result);
    console.log(data);
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
    $("#pdf").click(function () {
        console.log("dddddd");
        let doc = new jsPDF('p', 'mm', 'a4', true);
        doc.setFontSize(20);
        doc.text(20, 20, result.name + "'s results");
        doc.setTextColor('#1010A0');
        doc.setFontSize(8);
        let startY = 30;
        for (let i = 0; i < result.score_game.length; i++) {
            doc.setDrawColor('0.3', '0.3', '1.0');
            doc.setFillColor('0.9', '0.9', '1.0');
            doc.roundedRect(20, startY, 60, 20, 3, 3, 'DF');
            doc.text(25, startY + 5, "Rerord of Game " + (i + 1).toString() + ": " + result.score_game[i]);
            startY += 22;
        }
        doc.save('report.pdf');
    });

})