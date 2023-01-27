const $ = (id) => {
    return document.getElementById(id);
}

let guessButton = $("guess-button");
let idiomElement = $("idiom");
let inputElement = $("letter-input");
let livesElement = $("lives");

let lives = 6;

let isLoaded = false;

fetch("https://raw.githubusercontent.com/jbrew/idiomash/master/text/idioms.txt")
    .then((response) => response.text().then(idioms).then(newPhrase));

let idiomList = [];
let currentIdiom = "";
let guessArray = [];
let correctArray = [];

const idioms = (responseText) => {
    let rawIdioms = responseText.trim().toUpperCase().split("\n");
    idiomList = rawIdioms.filter(idiom => {
        let safeIdiom = true;
        if (idiom.includes("(") || idiom.includes(":") || idiom.includes("_") || idiom.includes("–") || idiom.length > 30 || !idiom) {
            safeIdiom = false;
        }
        return safeIdiom;
    })
    isLoaded = true;
}

const newPhrase = () => {
    currentIdiom = idiomList[Math.floor(Math.random() * idiomList.length)];
    lives = 6;
    guessArray.length = 0;
    correctArray.length = 0;
    livesElement.innerText = `Lives: ${lives}`;
    idiomElement.innerText = "";
    let idiomCharArray = currentIdiom.split("");
    let idiomText = "";
    for (char of idiomCharArray) {
        if (/\w/.test(char)) {
            idiomText += `<span class="underline">&nbsp;</span><span class="space">&nbsp;</span>`;
        }
        else if (char === " ") {
            idiomText += `<span class="space"><br /></span>`;
        }
        else {
            idiomText += char + "&nbsp;";
        }
    }
    idiomElement.innerHTML = idiomText;
    console.log(currentIdiom);
    guessButton.innerText = "Guess";
}

guessButton.addEventListener("click", (e) => {
    let guess = inputElement.value.toUpperCase();
    if (!guessArray.includes(guess)) {
        guessArray.push(guess);
        if (currentIdiom.includes(guess)) {
            idiomElement.innerText = "";
            let idiomCharArray = currentIdiom.split("");
            let idiomText = "";
            for (char of idiomCharArray) {
                if (guess === char) {
                    correctArray.push(guess);
                }
                if (guessArray.includes(char)) {
                    idiomText += `<span class="space">${char}&nbsp;</span>`
                }
                else if (/\w/.test(char)) {
                    idiomText += `<span class="underline">&nbsp;</span><span class="space">&nbsp;</span>`;
                }
                else if (char === " ") {
                    idiomText += `<span class="space"><br /></span>`;
                }
                else {
                    idiomText += char + "&nbsp;";
                }
            }
            idiomElement.innerHTML = idiomText;
        }
        else {
            lives--;
            livesElement.innerText = `Lives: ${lives}`;
        }
    }
    else {
        alert("u already guessd that...");
    }
    if (lives === 0) {
        alert(`you lose bitch. answer was: ${currentIdiom}`);
        newPhrase();
    }
    if (correctArray.length === currentIdiom.replace(/\W/g, "").length) {
        //alert("u winnn slayyyyyyy!!!")
        newPhrase();
    }
    inputElement.value = "";
    inputElement.focus();
})