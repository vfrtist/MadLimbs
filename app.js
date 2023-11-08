const storyInput = document.querySelector('#inputbox');
const page2 = document.querySelector('#page2')
const finalStory = document.querySelector('#finalStory');
const nextButton = document.querySelector('.next');
const previousButton = document.querySelector('.previous');
const frame = document.querySelector('.upper');
const promptList = ['Title', 'Feeling', 'Short Description', 'Long Description', 'Color', 'Texture', 'Adjective', 'Any 2 Words', 'Any 3 Words', 'Silly Word', 'Number', 'Expletive', 'Verb, Past Tense', 'Verb Ending in "ING"', 'Direction', 'Action', 'Extreme Verb', 'Verb', 'Person in Room', 'Location', 'Object', 'Place', 'Plural Noun', 'Body Part', 'Noun']
const skippedWords = ['a', 'an', 'the', 'of', 'are'];

let story = ''
let removedWords = [];
let addedWords = {};

function clearBox() {
    removedWords = [];
    addedWords = {}
    page2.innerHTML = '';
}

function compareNumbers(a, b) {
    return a - b;
}

function pullOutRandomWords() {
    let wordCountToChange = Math.round(story.length * .1);
    let totalWords = story.length;
    let wordNumber

    for (let step = 0; step < wordCountToChange; step++) {
        do {
            wordNumber = Math.floor(Math.random() * totalWords) + 1;
        }
        while (skippedWords.includes(story[wordNumber]));
        removedWords.push(wordNumber);
    }

    removedWords = [...new Set(removedWords)];
    removedWords.sort(compareNumbers);
}

function makeInputBoxes() {
    for (word of removedWords) {
        addedWords[word] = getPrompt();
        let input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('key', word);
        input.setAttribute('placeholder', addedWords[word]);
        page2.appendChild(input);
    }
}

function getPrompt() {
    let number = Math.floor(Math.random() * promptList.length)
    return promptList[number];
}

function writeStory() {
    let newStory = '';
    let addWord = '';
    let inputs = page2.querySelectorAll('input');
    for (input of inputs) {
        addedWords[input.getAttribute('key')] = input.value
    };
    for ([index, word] of story.entries()) {
        //determine if it's a word or a prompt
        if (removedWords.includes(index)) {
            addWord = `${addedWords[index]}`;
            if (['?', ',', '.', '!', '%', '"'].includes(word.slice(-1))) { addWord += word.slice(-1) }
        } else { addWord = word }

        newStory += `${addWord} `
    }
    finalStory.innerHTML = newStory;
}

nextButton.addEventListener('click', function (e) {
    let pos = Math.round(frame.scrollLeft / frame.offsetWidth) + 1;

    if (pos === 1) {
        clearBox();
        story = storyInput.value.split(' ');
        pullOutRandomWords();
        makeInputBoxes()
    };

    if (pos === 2) {
        writeStory();
    }

    frame.scrollBy({ left: frame.offsetWidth, behavior: 'smooth' });
});

previousButton.addEventListener('click', function () {
    frame.scrollBy({ left: -frame.offsetWidth, behavior: 'smooth' });
});

frame.addEventListener('scrollend', function () {
    let pos = Math.round(frame.scrollLeft / frame.offsetWidth) + 1
    pos > 1 ? previousButton.disabled = false : previousButton.disabled = true;
    pos === 3 ? nextButton.disabled = true : nextButton.disabled = false;
});

storyInput.addEventListener('input', function (e) {
    e.preventDefault();
    storyInput.value != '' ? nextButton.disabled = false : nextButton.disabled = true
});