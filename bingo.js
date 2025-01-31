$(function () {
    "use strict";

    var max = 50,  // デフォルト値（CSVの読み込み後に上書きされる）
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
    function loadCSV(callback) {
        $.get("data.csv", function (data) {
            var lines = data.trim().split("\n"); // 空行を除く
            nameList = {}; // 初期化

            lines.forEach(function (line) {
                var parts = line.split(",");
                if (parts.length >= 2) {
                    var key = parseInt(parts[0], 10);
                    nameList[key] = parts[1].trim();
                }
            });

            max = Object.keys(nameList).length; // 名前の数に応じて max を設定

            if (callback) callback();
        });
    }

    // ゲームを初期化
    function initGame() {
        bingo = []; // 初期化
        $number.empty(); // 既存のリストをクリア

        for (var i = 1; i <= max; i++) {
            bingo.push(i);
            $number.append($("<li>").text(("0" + i).slice(-2)));
        }
    }

    // CSVを読み込んでからゲームを開始
    loadCSV(initGame);

    $("#start-button").on("click", function () {
        $("#start-screen").hide();
        $("#game-screen").show();
    });

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

            // `hit` クラスを正しく適用
            $number.find("li").eq(result - 1).addClass("hit");

            // 番号を配列から削除
            bingo.splice(random, 1);

            $result.text(result);
            $nameDisplay.text(nameList[result] || "該当なし")
                       .toggleClass("empty", !nameList[result]);
        }
    });
});
