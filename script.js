// シャッフル関数をグローバルスコープに定義
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

let unknownWords = [];
let allWords = [];
let displayButton = document.getElementById('displayButton');

document.getElementById('excelFileInput').addEventListener('change', function(e){
  allWords = [];
  const files = e.target.files;
  
  let fileCount = files.length;
  
  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = function(e) {
      const data = new Uint8Array(reader.result);
      const workbook = XLSX.read(data, {type: 'array'});

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const wordList = XLSX.utils.sheet_to_json(worksheet);
      allWords = allWords.concat(wordList);

      fileCount--;
    };

    reader.onloadend = function() {
      if (fileCount === 0) {
        displayButton.disabled = false;
      }
    };
  });
});

displayButton.addEventListener('click', function() {
  shuffle(allWords);
  displayTweets(allWords);
  allWords = [];
});

function displayTweets(wordList) {
  document.getElementById('timeline').innerHTML = '';

  const timeline = document.getElementById('timeline');
  wordList.forEach((item) => {
    const tweet = document.createElement('div');
    tweet.className = 'tweet';

    const icon = document.createElement('div');
    icon.className = 'icon';

    const accountName = document.createElement('span');
    accountName.className = 'account-name';
    accountName.textContent = 'Account Name';

    const content = document.createElement('div');
    content.className = 'content';
    content.innerHTML = `<span class="word">${item.word}</span>:${item.answer}`;

    const heart = document.createElement('span');
    heart.className = 'heart';
    heart.textContent = '♡';
    heart.addEventListener('click', function() {
      if (this.textContent === '♡') {
        this.textContent = '♥️';
        this.style.color = 'red';
        unknownWords.push(item);
      } else {
        this.textContent = '♡';
        this.style.color = 'black';
        const index = unknownWords.indexOf(item);
        if (index > -1) {
          unknownWords.splice(index, 1);
        }
      }
    });

    tweet.appendChild(icon);
    tweet.appendChild(accountName);
    tweet.appendChild(content);
    tweet.appendChild(heart);

    timeline.appendChild(tweet);
  });
  const reviewButton = document.createElement('button');
  reviewButton.textContent = 'さらに表示';
  reviewButton.addEventListener('click', function() {
    appendTweets(unknownWords);
    unknownWords = [];
  });
  timeline.appendChild(reviewButton);

}
function appendTweets(wordList) {
  const timeline = document.getElementById('timeline');
  wordList.forEach((item) => {
    const tweet = document.createElement('div');
    tweet.className = 'tweet';

    const icon = document.createElement('div');
    icon.className = 'icon';

    const accountName = document.createElement('span');
    accountName.className = 'account-name';
    accountName.textContent = 'Account Name';

    const content = document.createElement('div');
    content.className = 'content';
    content.innerHTML = `<span class="word">${item.word}</span>:${item.answer}`;

    const heart = document.createElement('span');
    heart.className = 'heart';
    heart.textContent = '♡';
    heart.addEventListener('click', function() {
      if (this.textContent === '♡') {
        this.textContent = '♥️';
        this.style.color = 'red';
        unknownWords.push(item);
      } else {
        this.textContent = '♡';
        this.style.color = 'black';
        const index = unknownWords.indexOf(item);
        if (index > -1) {
          unknownWords.splice(index, 1);
        }
      }
    });

    tweet.appendChild(icon);
    tweet.appendChild(accountName);
    tweet.appendChild(content);
    tweet.appendChild(heart);

    timeline.appendChild(tweet);
  });

  const reviewButton = document.createElement('button');
  reviewButton.textContent = 'さらに表示';
  reviewButton.addEventListener('click', function() {
    appendTweets(unknownWords);
    unknownWords = [];
  });
  timeline.appendChild(reviewButton);
}

