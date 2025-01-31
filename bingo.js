$(function () {
    "use strict";

    var max = 50,  // デフォルト値（選択したクラスで上書きされる）
        bingo = [],
        status = true,
        roulette,
        random,
        number,
        result,
        allClasses = {}, // クラスごとの生徒データ
        nameList = {},   // 選択中のクラスの生徒リスト
        currentClass = "", // 現在選択中のクラス
        $startScreen = $("#start-screen"),
        $classButtons = $("#class-buttons"),
        $number = $("#number"),
        $result = $("#result"),
        $nameDisplay = $("#name-display"),
        $sound_play = $("#sound-play"),
        $sound_pause = $("#sound-pause");

    // CSVデータを読み込む
    function loadCSV(callback) {
        $.get("data.csv", function (data) {
            var lines = data.trim().split("\n"); // 空行を除く
            allClasses = {}; // 初期化

            lines.forEach(function (line) {
                var parts = line.split(",");
                if (parts.length >= 3) {
                    var className = parts[0].trim();
                    var number = parseInt(parts[1], 10);
                    var studentName = parts[2].trim();

                    if (!allClasses[className]) {
                        allClasses[className] = {};
                    }
                    allClasses[className][number] = studentName;
                }
            });

            if (callback) callback();
        });
    }

    // クラスボタンを作成
    function createClassButtons() {
        $classButtons.empty();
        Object.keys(allClasses).forEach(function (className) {
            var $button = $("<button>")
                .addClass("class-button")
                .text(className)
                .on("click", function () {
                    selectClass(className);
                });
            $classButtons.append($button);
        });
    }

    // クラスを選択
    function selectClass(className) {
        currentClass = className;
        nameList = allClasses[className] || {};
        max = Object.keys(nameList).length; // 選択したクラスの生徒数を max に設定
        initGame();
        $startScreen.hide();
        $("#game-screen").show();
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

    // ビンゴのスタート・ストップ
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

    // CSVを読み込んでからクラスボタンを作成
    loadCSV(createClassButtons);
});
