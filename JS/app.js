$(document).ready(function () {
    theme = $('#theme');
    theme.click(function () {
        if (theme.text() == "Theme: dark") {
            theme.text("Theme: light");
        } else {
            theme.text("Theme: dark");
        }
    });


})