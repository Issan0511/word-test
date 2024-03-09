document.getElementById('create-list-button').addEventListener('click', function() {
  const listName = document.getElementById('new-list-name-input').value;
  const lists = JSON.parse(localStorage.getItem('wordLists')) || {};
  if (listName) {
    if (lists[listName]) {
      alert('この単語リスト名は既に使用されています。別の名前を選ぶか単語リスト編集ページに移動してください。');
    } else {
      // リスト名が新しい場合、新規リスト作成の処理をここに記述
       // リスト名が入力されている場合に単語と答えの入力フィールドを表示
       document.getElementById('word-entries').style.display = 'block';
       document.getElementById('new-list-name-input').disabled = true; // リスト名の入力を無効化
       document.getElementById('create-list-button').style.display = 'none';
    }
  } else {
      alert('リスト名を入力してください。');
  }
});

document.getElementById('wordlist-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const listName = document.getElementById('new-list-name-input').value;
  const word = document.getElementById('word-input').value;
  const answer = document.getElementById('answer-input').value;

  let lists = JSON.parse(localStorage.getItem('wordLists')) || {};
  if (!lists[listName]|| !Array.isArray(lists[listName])) {
    lists[listName] = [];
  }

  const newId =Date.now();
  lists[listName].push({ id: newId, word: word, answer: answer ,LearningLevel:0});


  localStorage.setItem('wordLists', JSON.stringify(lists));
  console.log(lists[listName]);
  displayCards(lists[listName], '#ffffff'); // `list.words` を渡す
  document.getElementById('word-input').value = '';
  document.getElementById('answer-input').value = '';

});


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
    const listName = document.getElementById('list-name-search').value;

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
        const listName = document.getElementById('new-list-name-input').value; // Ensure this ID matches your HTML

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
    const listName = document.getElementById('list-name-search').value;
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

