let gameSeq = [];
let userSeq = [];

let btns = ["yellow", "red", "purple", "green"];

let started = false;
let level = 0;

let h2 = document.querySelector("h2");


// Start game
document.addEventListener("keypress", function () {

    if (started == false) {

        console.log("Game Started");

        started = true;

        levelUp();
    }

});


// Game flash
function gameFlash(btn) {

    btn.classList.add("flash");

    setTimeout(function () {

        btn.classList.remove("flash");

    }, 250);
}


// User flash
function userFlash(btn) {

    btn.classList.add("userflash");

    setTimeout(function () {

        btn.classList.remove("userflash");

    }, 250);
}


// Next level
function levelUp() {

    userSeq = [];

    level++;

    h2.innerText = `Level ${level}`;


    // Random color
    let randIdx = Math.floor(Math.random() * 4);

    let randColor = btns[randIdx];


    // Find button
    let randBtn = document.querySelector(`.${randColor}`);


    // Add color to game sequence
    gameSeq.push(randColor);

    console.log(gameSeq);


    // Flash button
    gameFlash(randBtn);
}


// Check user's answer
function checkAns(idx) {

    if (userSeq[idx] === gameSeq[idx]) {

        if (userSeq.length == gameSeq.length) {

            setTimeout(levelUp, 1000);

        }

    } else {

        h2.innerHTML =
            `Game Over! Your score was <b>${level}</b>
            <br>
            Press any key to start.`;


        document.querySelector("body").style.backgroundColor =
            "#ff6b6b";


        setTimeout(function () {

            document.querySelector("body").style.backgroundColor =
                "#f4f7ff";

        }, 150);


        reset();
    }
}


// User clicks button
function btnPress() {

    let btn = this;

    userFlash(btn);


    let userColor = btn.getAttribute("id");

    userSeq.push(userColor);


    checkAns(userSeq.length - 1);
}


// Select all buttons
let allBtns = document.querySelectorAll(".btn");


// Add click event
for (let btn of allBtns) {

    btn.addEventListener("click", btnPress);

}


// Reset game
function reset() {

    started = false;

    gameSeq = [];

    userSeq = [];

    level = 0;
}