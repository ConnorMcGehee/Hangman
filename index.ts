const $ = (id: string): HTMLElement | null => {
    return document.getElementById(id);
}

let idiomElement = $("idiom") || document.createElement("div");
let livesElement = $("lives") || document.createElement("div");
let lettersElement = $("letters") || document.createElement("div");
let resetButton = $("reset") || document.createElement("button");
let guessInput: HTMLInputElement;
let guessButton: HTMLButtonElement;

let alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u",
    "v", "w", "x", "y", "z"];

let lives = 6;

let isLoaded = false;

fetch("https://raw.githubusercontent.com/jbrew/idiomash/master/text/idioms.txt")
    .then((response) => response.text().then(idioms).then(newPhrase));

let idiomList: string[] = [];
let currentIdiom = "";
let guessArray: string[] = [];
let correctArray: string[] = [];

const idioms = (responseText: string) => {
    let rawIdioms = responseText.trim().toUpperCase().split("\n");
    idiomList = rawIdioms.filter(idiom => {
        let safeIdiom = true;
        if (idiom.includes("(") || idiom.includes(":") || idiom.includes("/") || idiom.includes("OF") || idiom.includes("_") || idiom.includes("–") || idiom.length > 30 || !idiom) {
            safeIdiom = false;
        }
        return safeIdiom;
    })
    isLoaded = true;
}

const newPhrase = () => {
    alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u",
        "v", "w", "x", "y", "z"];
    idiomElement.style.background = "initial";
    lettersElement.style.display = "block";
    lettersElement.innerHTML = "";
    livesElement.style.display = "block";
    guessInput = document.createElement("input");
    guessInput.type = "text";
    guessInput.id = "guess";
    guessInput.placeholder = "Guess the phrase"
    guessButton = document.createElement("button");
    guessButton.innerText = "Guess"
    guessButton.addEventListener("click", guessButtonClick);
    guessInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            guessButton.click();
        }
    });
    lettersElement.innerHTML += `<div id="guess-container">`
    let containerElement = document.createElement("div");
    containerElement.id = "guess-container";
    lettersElement.appendChild(containerElement);
    containerElement.appendChild(guessInput);
    containerElement.appendChild(guessButton);
    for (let char of alphabet) {
        let letterButton = document.createElement("button");
        letterButton.innerText = char.toUpperCase();
        letterButton.id = char;
        letterButton.classList.add("letter");
        letterButton.addEventListener("click", letterButtonClick);
        lettersElement.appendChild(letterButton);
    }
    currentIdiom = idiomList[Math.floor(Math.random() * idiomList.length)];
    lives = 6;
    guessArray.length = 0;
    correctArray.length = 0;
    livesElement.innerText = `Lives: ${lives}`;
    idiomElement.innerText = "";
    let idiomCharArray = currentIdiom.split("");
    let idiomText = "";
    let arrLength = idiomCharArray.length;
    for (let i = 0; i < arrLength; i++) {
        let char = idiomCharArray[i];
        if (/\w/.test(char)) {
            idiomText += `<span class="underline">A</span>` + ((i !== arrLength - 1) ? `<span class="space">A</span>` : "");
        }
        else if (char === " ") {
            idiomText += `<span class="space">&#32;&#32;&#32;<</span>`;
        }
        else {
            idiomText += `<span class="space show">${char}</span>` + ((i !== arrLength - 1) ? "A" : "");
        }
    }
    idiomElement.innerHTML = idiomText;
    guessButton.innerText = "Guess";
}

const guessButtonClick = (e: any) => {
    let guess = guessInput.value.replace(/[^\w\s]|_/, "").toUpperCase().trim();
    guessInput.value = "";
    if (guess !== "") {
        if (guess === currentIdiom.replace(/[^\w\s]|_/, "")) {
            win();
        }
        else {
            decreaseLives();
        }
        if (lives === 0) {
            lose();
        }
    }
}

const letterButtonClick = (e: any) => {
    let guess = e.target.id.toUpperCase();
    e.target.disabled = "true";
    guessArray.push(guess);
    if (currentIdiom.includes(guess)) {
        idiomElement.innerText = "";
        let idiomCharArray = currentIdiom.split("");
        let idiomText = "";
        let arrLength = idiomCharArray.length;
        for (let i = 0; i < arrLength; i++) {
            let char = idiomCharArray[i];
            if (guess === char) {
                correctArray.push(guess);
            }
            if (guessArray.includes(char)) {
                idiomText += `<span class="space show">${char}</span>` + ((i !== arrLength - 1) ? `<span class="space">A</span>` : "</span>");
            }
            else if (/\w/.test(char)) {
                idiomText += `<span class="underline">A</span>` + ((i !== arrLength - 1) ? `<span class="space">A</span>` : "");
            }
            else if (char === " ") {
                idiomText += `<span class="space">&#32;&#32;&#32;</span>`;
            }
            else {
                idiomText += `<span class="space show">${char}</span>` + ((i !== arrLength - 1) ? "A" : "");
            }
        }
        idiomElement.innerHTML = idiomText;
    }
    else {
        decreaseLives();
    }
    if (lives === 0) {
        lose();
    }
    if (correctArray.length === currentIdiom.replace(/\W/g, "").length) {
        win();
    }
}

resetButton.addEventListener("click", (e) => {
    newPhrase();
});

const decreaseLives = () => {
    lives--;
    livesElement.innerText = `Lives: ${lives}`;
    var blink_speed = 800;
    livesElement.style.background = "red";
    setTimeout(function () {
        livesElement.style.background = "rgb(5, 0, 81)";
    }, blink_speed);
}

const win = () => {
    lettersElement.style.display = "none";
    livesElement.style.display = "none";
    idiomElement.style.background = "yellow";
    idiomElement.innerHTML = `<span class="show" style="color:black;">You win!<br />The phrase was: "${currentIdiom}"</span>`;
}
const lose = () => {
    lettersElement.style.display = "none";
    livesElement.style.display = "none";
    idiomElement.style.background = "lightgrey";
    idiomElement.style.color = "black";
    idiomElement.innerHTML = `<span class="show" style="color:black;">You lose!<br />The phrase was: "${currentIdiom}"</span>`;
}