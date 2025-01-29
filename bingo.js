$(function () {
    "use strict";

    var max = 50,
        bingo = [],
        status = true,
        roulette,
        random,
        number,
        result,
        nameData = {},
        $number = $("#number"),
        $result = $("#result"),
        $nameDisplay = $("#name-display"),
        $sound_play = $("#sound-play"),
        $sound_pause = $("#sound-pause");

    // CSVデータの読み込み（修正）
    function loadCSV() {
        return $.ajax({
            url: "data.csv",
            dataType: "text"
        }).done(function (data) {
            console.log("CSVロード成功"); // デバッグログ
            let lines = data.split("\n");
            for (let line of lines) {
                let [num, name] = line.split(",");
                if (num && name) {
                    num = parseInt(num.trim(), 10);
                    nameData[num] = name.trim();
                }
            }
            console.log("読み込んだデータ:", nameData); // デバッグログ
        }).fail(function () {
            console.error("CSVの読み込みに失敗しました"); // エラーハンドリング
        });
    }

    // スタート画面の処理
    $("#start-button").on("click", function () {
        $("#start-screen").hide();
        $("#game-screen").show();
        
        // CSVのロードが終わるまで待つ
        loadCSV().then(function () {
            console.log("ゲーム開始可能"); // デバッグログ
        });
    });

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
                $nameDisplay.text(nameData[number] || "該当なし");
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
