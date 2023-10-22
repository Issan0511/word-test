// Global Variables
let currentWords = [];
let wrongWords = [];
let canDownload = true;
let savedWrongWords = [];
window.onload = function() {
    document.getElementById('answerButton').style.visibility = 'visible';
    document.getElementById('decisionButtons').style.visibility = 'hidden';
};

// この関数を新しく追加
function startTest(wordList) {
    canDownload = true;  //
    console.log(wordList)
    currentWords = wordList.map(item => ({word: item.word, answer: item.answer}));
    shuffleWords(); // 単語をシャッフル
    showWord(); // 最初の単語を表示
}

// 単語をシャッフルする関数
function shuffleWords() {
    currentWords.sort(() => Math.random() - 0.5);
    showWord();
}

// 単語を表示する関数
function showWord() {
    if (currentWords.length === 0) {
        // すべての単語が表示された後
        currentWords = wrongWords;
        wrongWords = [];
    }
    // 単語を画面に表示するロジック（仮）
    document.getElementById("wordDisplay").innerText = currentWords[0].word;
}
// 正解ボタンが押されたとき
function correct() {
    toggleButtons(true);
    currentWords.shift(); 
    showWord(); 
}

// 間違いボタンが押されたとき
function incorrect() {
    toggleButtons(true);
    wrongWords.push(currentWords.shift());
    showWord();
}

function restart() {
    console.log(wrongWords)
    savedWrongWords = wrongWords.slice(); // 内容を保存
    currentWords = wrongWords.slice(); // 間違えた単語をコピー
    wrongWords = []; // 間違えた単語リストをリセット
    showWord(); // 最初の単語を表示
}

function showWord() {
    if (currentWords.length === 0) {
        if (wrongWords.length > 0) {

            testCompleted();
            restart();  // 間違えた単語を再表示
        } else {
            alert('単語テストが終了しました。すべて正解です！');
        }
        return;
    }
    // 答えの部分を空白にする
    document.getElementById("answerDisplay").innerText = "　";
    // 以下、単語表示の通常の処理
    document.getElementById("wordDisplay").innerText = currentWords[0].word;
    
}
function showAnswer() {
    document.getElementById("answerDisplay").innerText = currentWords[0].answer;
    console.log(`aaa`)
    toggleButtons()
}

function testCompleted() {
    if (canDownload) {
    // ダウンロードボタンを表示
        document.getElementById("downloadButton").style.display = "block";  // フラグをfalseに設定
    }
    // メッセージ表示
    alert('単語テストが一通り終わりました。間違えた単語を再表示します');

}
// ボタンがクリックされたらExcelファイルを出力
document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById("downloadButton").addEventListener("click", function() {
        console.log("Button clicked!");
        exportToExcel();
    });
});
// 間違った単語をExcelシートに追加する関数
function exportToExcel() {
    if(savedWrongWords.length === 0) {
        alert("間違った単語がありません。");
        return;
    }

    var new_workbook = XLSX.utils.book_new();
    var newWorksheet = XLSX.utils.json_to_sheet(savedWrongWords);
    XLSX.utils.book_append_sheet(new_workbook, newWorksheet, "Wrong Words");
    
    // ここでExcelファイルとして出力
    XLSX.writeFile(new_workbook, 'WrongWords.xlsx');
    console.log(canDownload);
}

// ボタンの表示を切り替える関数
function toggleButtons() {
    const answerButton = document.getElementById('answerButton');
    const decisionButtons = document.getElementById('decisionButtons');
    console.log(`a`)
    if (answerButton.style.visibility === 'visible') {
        answerButton.style.visibility = 'hidden';
        decisionButtons.style.visibility = 'visible';
        console.log(`aa`)
    } else {
        answerButton.style.visibility = 'visible';
        decisionButtons.style.visibility = 'hidden';
        console.log(`aaaa`)
    }
}



