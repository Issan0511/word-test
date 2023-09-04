// Global Variables
let currentWords = [];
let wrongWords = [];

// この関数を新しく追加
function startTest(wordList) {
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
// 答えを表示する関数
function showAnswer() {
    document.getElementById("answerDisplay").innerText = currentWords[0].answer;

    // 答えを見るボタンを非表示にし、正解・不正解ボタンを表示
    document.getElementById('answerButton').style.display = "none";
    document.getElementById('decisionButtons').style.display = "block";
}
// 正解ボタンが押されたとき
function correct() {
    currentWords.shift(); // 最初の要素を削除
    document.getElementById("answerDisplay").innerText = ""; // 答えをクリア
    showWord(); // 次の単語を表示
    // ボタンの表示切り替え
    document.getElementById('answerButton').style.display = "block";
    document.getElementById('decisionButtons').style.display = "none";
}

// 間違いボタンが押されたとき
function incorrect() {
    wrongWords.push(currentWords.shift()); // 間違った単語をwrongWordsに追加
    document.getElementById("answerDisplay").innerText = ""; // 答えをクリア
    showWord(); // 次の単語を表示
    // ボタンの表示切り替え
    document.getElementById('answerButton').style.display = "block";
    document.getElementById('decisionButtons').style.display = "none";
}
// 再度表示するボタンが押されたときの関数
function restart() {
    currentWords = wrongWords.slice(); // 間違えた単語をコピー
    wrongWords = []; // 間違えた単語リストをリセット
    showWord(); // 最初の単語を表示
}

function showWord() {
    if (currentWords.length === 0) {
        if (wrongWords.length > 0) {
            alert('単語テストが一通り終わりました。間違えた単語を再表示します');
            exportToExcel(); // 間違った単語をExcelに出力
            restart();  // 間違えた単語を再表示
        } else {
            alert('単語テストが終了しました。すべて正解です！');
        }
        return;
    }
    // 以下、単語表示の通常の処理
    document.getElementById("wordDisplay").innerText = currentWords[0].word;
}

// 間違った単語をExcelシートに追加する関数
function exportToExcel() {
    var new_workbook = XLSX.utils.book_new();
    var newWorksheet = XLSX.utils.json_to_sheet(wrongWords);
    XLSX.utils.book_append_sheet(new_workbook, newWorksheet, "Wrong Words");
    
    // ここでExcelファイルとして出力
    XLSX.writeFile(new_workbook, 'WrongWords.xlsx');
}

// ボタンの表示を切り替える関数
function toggleButtons() {
    document.getElementById('answerButton').style.display = "block";
    document.getElementById('decisionButtons').style.display = "none";
}



