let currentWords = [];
let wrongWords = [];
let correctWords =[];
let istheFirsttime = true;
let istheSecondtime = false;
let istheThirdtime = false;
let savedWrongWords = [];
let previousWords = []; 
let currentAnswer = [];
let currentWord = [];
let totalWords = 0; // 全体の単語数
let currentIndex = 0; // 現在の単語のインデックス
let savedcorrectWords = [];
let unknownWords = [];
let allWords = [];
let selectedList;
document.getElementById('startTestButton').addEventListener('click', () => {
  selectedList = document.getElementById('listSelector').value;
  const wordList = JSON.parse(localStorage.getItem('wordLists'))[selectedList];
  // ここでwordListを使ってテストを開始
  startTest(wordList);
  document.getElementById('startTestButton').style.display="none";
});
function updateListSelector() {
  const lists = JSON.parse(localStorage.getItem('wordLists')) || {};
  const listSelector = document.getElementById('listSelector');
  listSelector.innerHTML = ''; // 既存の選択肢をクリア

  Object.keys(lists).forEach(listName => {
    const option = document.createElement('option');
    option.value = listName;
    option.textContent = listName;
    listSelector.appendChild(option);
  });
}

// ページ読み込み時にドロップダウンを更新
document.addEventListener('DOMContentLoaded', updateListSelector);



function beforeUnload(event){
  event.preventDefault();
  event.returnValue = 'Check';
}

  


window.onload = function() {
  document.getElementById('answerButton').style.visibility = 'visible';
  document.getElementById('decisionButtons').style.visibility = 'hidden';
};
document.addEventListener('DOMContentLoaded', (event) => {
  // 要素の参照を変数に格納
  let answerButton = document.getElementById('answerButton');
  let decisionButtons = document.getElementById('decisionButtons');
  let card = document.getElementById('card');
  let cardWidth = card.offsetWidth;

  // 初期表示設定
  answerButton.style.visibility = 'visible';
  decisionButtons.style.visibility = 'hidden';

  // キーボード操作に対するイベントリスナー
  window.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowLeft':
        if (answerButton.style.visibility === 'visible') {
          showAnswer();
        } else {
          event.key === 'ArrowRight' ? incorrect() : correct();
        }
        break;
      case 'ArrowUp':
        goBack();
        break;
    }
  });

  // カードクリックに対するイベントリスナー
  card.addEventListener('click', function(event) {
    let clickPosition = event.clientX - card.getBoundingClientRect().left;
    if (clickPosition < cardWidth / 2) {
      answerButton.style.visibility === 'visible' ? showAnswer() : correct();
    } else {
      answerButton.style.visibility === 'visible' ? showAnswer() : incorrect();
    }
  });
});


// この関数を新しく追加
function startTest(wordList) {
  canDownload = true;  //
  console.log(wordList)
  currentWords = wordList.map(item => ({id:item.id, word: item.word, answer: item.answer,LearningLevel:item.LearningLevel}));
  totalWords = currentWords.length; // 全体の単語数を設定
  currentIndex = 1; // 現在の単語のインデックスをリセットshuffleWords(); // 単語をシャッフル
  shuffleWords(); // 単語をシャッフル
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
  updateWordList(currentWords[0].id, istheFirsttime ? 1 : (istheSecondtime ? -1 : -2),currentWords[0]);
  allWords.push(currentWords[0]);
  console.log(currentWords[0]);
  correctWords.push(currentWords.shift()); 

  currentIndex++; // currentIndexを更新
  showWord(); 
}

// 間違いボタンが押されたとき
function incorrect() {
  toggleButtons(true);
  allWords.push(currentWords[0]);
  updateWordList(currentWords[0].id, istheThirdtime? 0 : -1,currentWords[0]);
  wrongWords.push(currentWords.shift());
  console.log(wrongWords)
  currentIndex++; // currentIndexを更新
  showWord();
}

function updateWordList(wordId, result,word) {

    const wordLists = JSON.parse(localStorage.getItem('wordLists')) || {};
    Object.keys(wordLists).forEach(listName => {
        let wordIndex = wordLists[listName].findIndex(word => word.id === wordId);
        console.log();
        if (wordIndex !== -1) {
            let currentLevel = wordLists[listName][wordIndex].LearningLevel || 0;
            wordLists[listName][wordIndex].LearningLevel = currentLevel+result;
            word.LearningLevel=currentLevel+result;
            console.log('保存！',wordLists[listName][wordIndex]);

        }
    });
    localStorage.setItem('wordLists', JSON.stringify(wordLists));
}
function restart() {
  console.log(wrongWords)
  if (istheFirsttime) {
    console.log(istheFirsttime);
    savedWrongWords = wrongWords.slice();
    savedcorrectWords = correctWords.slice();
    istheFirsttime = false;
    istheSecondtime = true;
  } else if (istheSecondtime) {
    istheSecondtime = false;
  } else if(istheThirdtime){
    istheThirdtime = false;
  }  
  console.log(istheFirsttime);


  currentWords = wrongWords.slice(); // 間違えた単語をコピー
  wrongWords = []; // 間違えた単語リストをリセット
  correctWords = [];
  totalWords = currentWords.length; // 全体の単語数を設定
  currentIndex = 1; // 単語をシャッフル
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
  document.getElementById("answerDisplay").innerText =  currentIndex + "/" + totalWords;
  // 以下、単語表示の通常の処理
     document.getElementById("wordDisplay").style.fontSize = "84px";
     document.getElementById("wordDisplay").innerText =  currentWords[0].word;
     document.getElementById("answerDisplay").style.fontSize = "50px";
}
function showAnswer() {
  document.getElementById("answerDisplay").innerText = currentWords[0].answer;
  document.getElementById("wordDisplay").style.fontSize = "50px";
  document.getElementById("answerDisplay").style.fontSize = "70px";
  toggleButtons();
}

// 一つ前の単語に戻る関数
function goBack() {
  // 一つ前の単語が存在するかチェック
  if (previousWords.length === 0) {
      alert("これが最初の単語です。");
      return;
  }
  if(istheFirsttime){
    console.log(previousWords[previousWords.length - 1]);
    updateWordList(previousWords[previousWords.length - 1].id,-1,previousWords[previousWords.length - 1])
  }
  // 最後の要素（現在表示されている要素）を削除
  correctWords.pop();
  // 一つ前の単語を取得
  const prev = previousWords.pop();
  // 一つ前の単語を現在の単語として設定
  currentWords.unshift(prev); // 一つ前の単語をcurrentWordsに追加
  currentIndex--; // currentIndexを更新
  console.log(currentWords[0]);
  // 単語を再表示
  showWord();
}

// ボタンにイベントリスナーを追加

function testCompleted() {
  if (canDownload) {
  // ダウンロードボタンを表示
      document.getElementById("downloadButton").style.display = "block";  // フラグをfalseに設定
      document.getElementById("showcardButton").style.display = "block";  // フラグをfalseに設定
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

function exportToExcel() {
  if(savedWrongWords.length === 0 && savedcorrectWords.length === 0) {
      alert("間違った単語も正解した単語もありません。");
      return;
  }

  var new_workbook = XLSX.utils.book_new();
  if(savedWrongWords.length !== 0) {
      var wrongWorksheet = XLSX.utils.json_to_sheet(savedWrongWords);
      XLSX.utils.book_append_sheet(new_workbook, wrongWorksheet, "Wrong Words");
  }
  if(savedcorrectWords.length !== 0) {
      var correctWorksheet = XLSX.utils.json_to_sheet(savedcorrectWords);
      XLSX.utils.book_append_sheet(new_workbook, correctWorksheet, "Correct Words");
  }
  
  // ここでExcelファイルとして出力
  XLSX.writeFile(new_workbook, 'Result.xlsx');
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
function showcard(){
  const cardContainer = document.getElementById('cardContainer');
  const wordLists = JSON.parse(localStorage.getItem('wordLists')) || {};
  const list= wordLists[selectedList];
  console.log(selectedList,wordLists);
  console.log(list);
  cardContainer.innerHTML = ''; // コンテナをクリア

  // ラーニングレベルに応じてカードをフィルタリング
  const BlueWords = list.filter(word => word.LearningLevel >= 1);
  const WhiteRedWords=list.filter(word => word.LearningLevel <= 0);

  // フィルタリングされたカードを表示

  displayWrongCards(WhiteRedWords, '#ff9090'); // 間違えた単語を赤色で表示
  displayCards(BlueWords, '#81a9ff'); // 正解した単語を青色で表示
  
  document.getElementById("showcardButton").style.display = "none";
}

function displayWrongCards(wordList, bgColor) {
  const cardContainer = document.getElementById('cardContainer');
  let autoPlayInterval;
  let autoPlaying = false;

  // 自動再生ボタンのtextContentを変更する関数を定義する
  const changeAutoPlayButtonText = () => {
    // 全てのカードのautoPlayButtonを取得する
    const autoPlayButtons = document.querySelectorAll(".autoPlayButton");
    // autoPlayButtonのtextContentをautoPlayingの値に応じて変更する
    if (autoPlaying) {
      autoPlayButtons.forEach(button => {
        button.textContent = "■";
      });
    } else {
      autoPlayButtons.forEach(button => {
        button.textContent = "▶";
      });
    }
  };

  // 自動再生ボタンのclickイベントリスナーを定義する
  const autoPlayButtonClickHandler = (e) => { 
    // イベントの伝播を止める
    e.stopPropagation();
    // autoPlayingの値を反転させる
    autoPlaying = !autoPlaying;
    // autoPlayButtonのtextContentを変更する
    changeAutoPlayButtonText();
    // autoPlayingの値に応じて自動再生を開始または停止する
    if (autoPlaying) {
      // 自動再生を開始する
      // クリックされた要素を取得する
      const clickedElement = e.target;
      // クリックされた要素のid属性からカードの番号を取得する
      const cardNumber = clickedElement.id.replace("button", "");
      // カードの番号をautoPlay関数に渡して自動再生を開始する
      autoPlay(cardNumber);
    } else {
      // 自動再生を停止する
      clearTimeout(autoPlayInterval);
    }
  };

  // 自動再生の処理をする関数を定義する
  const autoPlay = (cardIndex) => { 
    const nextCard = document.getElementById('card' + cardIndex);
    if (nextCard) {
      const cardHeight = nextCard.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrollPosition = nextCard.offsetTop - (viewportHeight - cardHeight) / 2;
      window.scrollTo({top: scrollPosition, behavior: "smooth"});
      cardIndex++; 
      autoPlayInterval = setTimeout(() => {
        autoPlay(cardIndex); 
      }, 3000);
    } else {
      autoPlaying = false;
      changeAutoPlayButtonText();
    }
  };

  wordList.forEach((item, index) => {
    const card1 = document.createElement('div');
    card1.className = 'card1';
    card1.style.backgroundColor = item.LearningLevel==0? '#ffffff':'#ff9090';  // Set the background color
    // ここでカードに一意のIDを割り当てる
    card1.dataset.id = item.id.toString();
    const container = document.createElement('div');
    container.className = 'container1';

    const wordDisplay = document.createElement('div');
    wordDisplay.id = 'wordDisplay1';
    wordDisplay.textContent = item.word === undefined ? '' : item.word;

    const answerDisplay = document.createElement('div');
    answerDisplay.id = 'answerDisplay1';
    answerDisplay.textContent = item.answer;
    answerDisplay.addEventListener('click', function() {
      const input = document.createElement('input');
      input.type = 'text';
      input.value = item.answer;
      container.replaceChild(input, answerDisplay); // containerを使用
      
      input.addEventListener('blur', function() {
        const newAnswer = input.value;
        const listName = document.getElementById('listSelector').value;
        answerDisplay.textContent = newAnswer;
        container.replaceChild(answerDisplay, input); // containerを使用して置き換える
        editAnswer(listName, item.id, newAnswer);
      });
    
      input.focus();
    });
    
    wordDisplay.addEventListener('click', function() {
      const input = document.createElement('input');
      input.type = 'text';
      input.value = item.word;
      container.replaceChild(input, wordDisplay); // Use container for replacement
    
      input.addEventListener('blur', function() {
        const newWord = input.value;
        wordDisplay.textContent = newWord; // Update the display with the new word
        container.replaceChild(wordDisplay, input); // Replace the input back with the word display
    
        const listName = document.getElementById('listSelector').value;
        editWord(listName, item.id, newWord); // Pass the unique ID of the word for editing
      });
    
      input.focus(); // Focus on the input field for immediate editing
    });
    
    container.appendChild(wordDisplay);
    container.appendChild(answerDisplay);
    card1.appendChild(container);
    cardContainer.appendChild(card1);

    // カードにIDを追加
    card1.id = 'card' + index;

    // 自動再生ボタンを作成
    const autoPlayButton = document.createElement('button');
    // autoPlayButtonにクラス名を追加
    autoPlayButton.className = "autoPlayButton";
    // autoPlayButtonのtextContentを初期化する
    changeAutoPlayButtonText();
    // ボタンのpositionをabsoluteに変更する
    autoPlayButton.style.position = 'absolute';  // ボタンをカードの右端に固定する
    // ボタンのrightを0にする
    autoPlayButton.style.right = '0';  // ボタンをカードの右端に移動する
    autoPlayButton.style.bottom = '0';
    autoPlayButton.style.backgroundColor = 'transparent';  // 透明な灰色に設定
    // autoPlayButtonにclickイベントリスナーを登録する
    autoPlayButton.addEventListener('click', autoPlayButtonClickHandler);
    card1.appendChild(autoPlayButton);  // ボタンをカードに追加
    autoPlayButton.id= "button"+ index;
    // カードにクリックイベントを追加
    card1.addEventListener('click', (e) => {
      const clickedY = e.clientY;
      const cardRect = card1.getBoundingClientRect();
      const cardHeight = cardRect.height;
      const viewportHeight = window.innerHeight;

      // 自動再生を停止する処理を追加
      if (autoPlaying) {
        // autoPlayingの値をfalseにする
        autoPlaying = false;
        // setTimeoutをキャンセルする
        clearTimeout(autoPlayInterval);
        // ボタンのテキストを▶に変更する
        changeAutoPlayButtonText();
      } else {
        console.log(index);
        
      }
    });
     
  });
}

function displayCards(wordList, bgColor) {
  const cardContainer = document.getElementById('cardContainer');
 

  wordList.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'card2';
    card.style.backgroundColor = bgColor;
    // ここでカードに一意のIDを割り当てる
    card.dataset.id = item.id.toString();
    
    // 単語表示
    const wordDisplay = document.createElement('div');
    wordDisplay.className = 'wordDisplay';
    wordDisplay.textContent = item.word;

    // 解答表示
    const answerDisplay = document.createElement('div');
    answerDisplay.className = 'answerDisplay';
    answerDisplay.textContent = item.answer;

    answerDisplay.addEventListener('click', function() {
      const input = document.createElement('input');
      input.type = 'text';
      input.value = item.answer;
      card.replaceChild(input, answerDisplay);
    
      input.addEventListener('blur', function() {
        const newAnswer = input.value;
        // Ensure this ID matches your HTML
        const listName = document.getElementById('listSelector').value;
    
        // Update display and localStorage
        answerDisplay.textContent = newAnswer;
        card.replaceChild(answerDisplay, input);
        // Use the unique ID for editing the answer in the word list
        editAnswer(listName, item.id, newAnswer);
      });

      input.focus();
    });
    // Listener for editing words
    wordDisplay.addEventListener('click', function() {
      const input = document.createElement('input');
      input.type = 'text';
      input.value = item.word;
      card.replaceChild(input, wordDisplay); 

      input.addEventListener('blur', function() {
        const newWord = input.value;
        const listName = document.getElementById('listSelector').value; // Ensure this ID matches your HTML

        // Update display and localStorage
        wordDisplay.textContent = newWord; 
        card.replaceChild(wordDisplay, input); 
        editWord(listName, item.id, newWord); // Use item.id instead of index
      });

      input.focus();
    });   
    card.appendChild(wordDisplay);
    card.appendChild(answerDisplay);
    cardContainer.appendChild(card);
  });
}



function deleteCard(id, cardElement) {
  // idによるカードの削除ロジックを実装
  console.log('削除', id);
  // LocalStorageおよびUIからカードを削除します
  const lists = JSON.parse(localStorage.getItem('wordLists')) || {};
  const updatedList = lists.filter(item => item.id !== id);
  localStorage.setItem('wordLists', JSON.stringify(updatedList));
  cardElement.remove();
}
function editAnswer(listName, wordId, newAnswer) {
  let lists = JSON.parse(localStorage.getItem('wordLists')) || {};
  if (lists[listName]) {
    const wordIndex = lists[listName].findIndex(word => word.id === wordId); // Find word by ID
    if (wordIndex !== -1) {
      // Update the answer in the specific word object
      lists[listName][wordIndex].answer = newAnswer;
      localStorage.setItem('wordLists', JSON.stringify(lists));
    }
  }
}

// Adjusted editWord function to use unique IDs
function editWord(listName, wordId, newWord) {
  let lists = JSON.parse(localStorage.getItem('wordLists')) || {};
  if (lists[listName]) {
    const wordIndex = lists[listName].findIndex(word => word.id === wordId); // Find word by ID
    console.log(lists[listName]);
    console.log(wordIndex);
    console.log(wordId);
    console.log(newWord);
    if (wordIndex !== -1) {
      lists[listName][wordIndex].word = newWord;
      localStorage.setItem('wordLists', JSON.stringify(lists));
      console.log('編集！');
    }else{
      console.log('失敗');
    }
  }
}
document.addEventListener('DOMContentLoaded', () => {
  const cardContainer = document.getElementById('cardContainer');
  
// カードの右クリックイベントで削除処理を行う
cardContainer.addEventListener('contextmenu', function(e) {
  e.preventDefault();
  const targetCard = e.target.closest('.card2');
  if (!targetCard) return;

  const confirmDelete = confirm('このカードを削除しますか？');
  if (confirmDelete) {
    const cardId = parseInt(targetCard.dataset.id, 10); // ここでparseIntを使用
    const listName = document.getElementById('listSelector').value;
    const lists = JSON.parse(localStorage.getItem('wordLists')) || {};
    if (lists[listName]) {
      lists[listName] = lists[listName].filter(word => word.id !== cardId);
      localStorage.setItem('wordLists', JSON.stringify(lists));

      targetCard.remove();
    }else{
      alert('削除できませんでした');
    }
  }
});
});


