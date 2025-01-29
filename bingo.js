$(function () {
    "use strict";

    var max = 50,
        bingo = [],
        status = true,
        roulette,
        random,
        number,
        result,
        nameList = {}, // CSVから取得した名前リスト
        $number = $("#number"),
        $result = $("#result"),
        $nameDisplay = $("#name-display"),
        $sound_play = $("#sound-play"),
        $sound_pause = $("#sound-pause");

    // CSVデータを読み込む
    function loadCSV() {
        $.get("names.csv", function (data) {
            var lines = data.split("\n");
            lines.forEach(function (line) {
                var parts = line.split(",");
                if (parts.length === 2) {
                    nameList[parseInt(parts[0], 10)] = parts[1].trim();
                }
            });
        });
    }

    loadCSV();

    for (var i = 1; i <= max; i++) {
        bingo.push(i);
        $number.append($("<li>").text(("0" + i).slice(-2)));
    }

    $("#button").on("click", function () {
        if (status) {
            status = false;
            $(this).text("STOP");
            $sound_play.trigger("play");
            $sound_pause.trigger("pause");
            $sound_pause[0].currentTime = 0;

            roulette = setInterval(function () {
                random = Math.floor(Math.random() * bingo.length);
                number = bingo[random];
                $result.text(number);
                $nameDisplay.text(nameList[number] || "該当なし")
                           .toggleClass("empty", !nameList[number]);
            }, 10);
        } else {
            status = true;
            $(this).text("START");
            $sound_pause.trigger("play");
            $sound_play.trigger("pause");
            $sound_play[0].currentTime = 0;

            clearInterval(roulette);

            result = bingo[random];
            bingo.splice(random, 1);

            $result.text(result);
            $nameDisplay.text(nameList[result] || "該当なし")
                       .toggleClass("empty", !nameList[result]);
            $number.find("li").eq(parseInt(result, 10) - 1).addClass("hit");
        }
    });
});
