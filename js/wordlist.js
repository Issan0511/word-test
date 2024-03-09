document.addEventListener('DOMContentLoaded', function() {
  updateListDisplay();

  document.getElementById('listSelector').addEventListener('contextmenu', function(e) {
      e.preventDefault();
      const listName = e.target.value;
      if (confirm(`Are you sure you want to delete the list: ${listName}?`)) {
       // Retrieve the existing wordLists object from localStorage
let wordLists = JSON.parse(localStorage.getItem('wordLists'));

// Check if the list exists, then delete it
if (wordLists && wordLists.hasOwnProperty(listName)) {
    delete wordLists[listName];
    
    // Save the updated object back to localStorage
    localStorage.setItem('wordLists', JSON.stringify(wordLists));
    console.log(listName + " has been successfully deleted.");
    updateListSelector();
} else {
    console.log(listName + " does not exist.");
}
      }
  });
});

function updateListDisplay() {
  const listDisplay = document.getElementById('listSelector');
  listDisplay.innerHTML = ''; // Clear existing options
  const lists = JSON.parse(localStorage.getItem('wordLists')) || {};
  Object.keys(lists).forEach((listName) => {
      const option = document.createElement('option');
      option.value = listName;
      option.textContent = listName;
      listDisplay.appendChild(option);
  });
}

document.getElementById('search-button').addEventListener('click', function() {
  // ドロップダウンから選択されたリスト名を取得
  const searchName = document.getElementById('listSelector').value;
  const lists = JSON.parse(localStorage.getItem('wordLists')) || {};
  const list = lists[searchName];

  console.log('保存された単語リスト:', searchName, list);
  document.getElementById('card').style.visibility="visible"
  if (list) {
    displayCards(list, '#ffffff'); // listが配列の場合直接渡す。オブジェクトの場合はlist.wordsなど適切なプロパティを渡す
  } else {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = ''; 
    resultsContainer.textContent = '指定された名前のリストは見つかりませんでした。';
  }
});

// ドロップダウンメニューを更新する関数
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

document.getElementById('word-form').addEventListener('submit', function(e) {
  e.preventDefault();

  // リスト名、単語、答えを取得
  const listName = document.getElementById('listSelector').value;
  const word = document.getElementById('word-input').value;
  const answer = document.getElementById('answer-input').value;

  // LocalStorageからリストを取得
  let lists = JSON.parse(localStorage.getItem('wordLists')) || {};

  // リストが存在しない場合は新しいリストを作成
  if (!lists[listName]) {
      lists[listName] = [];
  }

  // 新しいIDを生成（ここではシンプルにlengthを使用）
  const newId = Date.now();

  // 単語をリストに追加
  lists[listName].push({id: newId,word: word,answer: answer,LearningLevel:0});

  // 更新されたリストをLocalStorageに保存
  localStorage.setItem('wordLists', JSON.stringify(lists));

  // 入力フィールドをクリア
  document.getElementById('word-input').value = '';
  document.getElementById('answer-input').value = '';
  displayCards(lists[listName], '#ffffff'); // 変更されたリストを表示
});

// Assume each item in wordList now includes an 'id' property
function displayCards(wordList, bgColor) {
  const cardContainer = document.getElementById('search-results');
  cardContainer.innerHTML = '';
  wordList.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'card2';
    card.style.backgroundColor = bgColor;
    // ここでカードに一意のIDを割り当てる
    card.dataset.id = item.id.toString();

    const wordDisplay = document.createElement('div');
    wordDisplay.className = 'wordDisplay1';
    wordDisplay.textContent = item.word;

    const answerDisplay = document.createElement('div');
    answerDisplay.className = 'answerDisplay1';
    answerDisplay.textContent = item.answer;
    // Inside the displayCards function, add this below the wordDisplay event listener
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
    cardContainer.appendChild(card);
    card.appendChild(wordDisplay);
    card.appendChild(answerDisplay);
  });
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
    if (wordIndex !== -1) {
      lists[listName][wordIndex].word = newWord;
      localStorage.setItem('wordLists', JSON.stringify(lists));
    }
  }
}
document.addEventListener('DOMContentLoaded', () => {
  const cardContainer = document.getElementById('search-results');
  
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


