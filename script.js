// Global Variables
let currentWords = [];
let wrongWords = [];
let correctWords =[];
let canDownload = true;
let savedWrongWords = [];
let previousWords = []; 
let currentAnswer = [];
let currentWord = [];
let totalWords = 0; // 全体の単語数
let currentIndex = 0; // 現在の単語のインデックス
window.onload = function() {
    document.getElementById('answerButton').style.visibility = 'visible';
    document.getElementById('decisionButtons').style.visibility = 'hidden';
};

// この関数を新しく追加
function startTest(wordList) {
    canDownload = true;  //
    console.log(wordList)
    currentWords = wordList.map(item => ({word: item.word, answer: item.answer}));
    totalWords = currentWords.length; // 全体の単語数を設定
    currentIndex = 1; // 現在の単語のインデックスをリセットshuffleWords(); // 単語をシャッフル]
    function shuffleWords();
    showWord(); // 最初の単語を表示
}

// 単語をシャッフルする関数
function shuffleWords() {
    currentWords.sort(() => Math.random() - 0.5);
    showWord();
}

// 正解ボタンが押されたとき
function correct() {
    toggleButtons(true);
    previousWords.push(JSON.parse(JSON.stringify(currentWords[0]))); // 正解とされた単語をpreviousWordsに追加
    correctWords.push(currentWords.shift()); 
    currentIndex++; // currentIndexを更新
    showWord(); 
}

// 間違いボタンが押されたとき
function incorrect() {
    toggleButtons(true);
    wrongWords.push(currentWords.shift());
    console.log(wrongWords)
    currentIndex++; // currentIndexを更新
    showWord();
}

function restart() {
    console.log(wrongWords)
    savedWrongWords = wrongWords.slice(); // 内容を保存
    currentWords = wrongWords.slice(); // 間違えた単語をコピー
    wrongWords = []; // 間違えた単語リストをリセット
    totalWords = currentWords.length; // 全体の単語数を設定
    currentIndex = 1; // 現在の単語のインデックスをリセットshuffleWords(); // 単語をシャッフル
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
    console.log(correctWords)

    // 答えの部分を空白にする
    document.getElementById("answerDisplay").innerText = "　";
    // 以下、単語表示の通常の処理
       document.getElementById("wordDisplay").innerText =  currentWords[0].word  + ": " + currentIndex + "/" + totalWords;
    
}
function showAnswer() {
    document.getElementById("answerDisplay").innerText = currentWords[0].answer;

    toggleButtons()
}

// 一つ前の単語に戻る関数
function goBack() {
    // 一つ前の単語が存在するかチェック
    if (previousWords.length === 0) {
        alert("これが最初の単語です。");
        return;
    }

    // 最後の要素（現在表示されている要素）を削除
    correctWords.pop();

    // 一つ前の単語を取得
    const prev = previousWords.pop();

    // 一つ前の単語を現在の単語として設定
    currentWords.unshift(prev); // 一つ前の単語をcurrentWordsに追加
    currentIndex--; // currentIndexを更新
    // 単語を再表示
    showWord();
}

// ボタンにイベントリスナーを追加

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
    document.getElementById('goBackButton').addEventListener('click', goBack);
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

    if (answerButton.style.visibility === 'visible') {
        answerButton.style.visibility = 'hidden';
        decisionButtons.style.visibility = 'visible';
    
    } else {
        answerButton.style.visibility = 'visible';
        decisionButtons.style.visibility = 'hidden';
    }
}



