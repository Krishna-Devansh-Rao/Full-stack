function startGame() {

    const max = Number(prompt("Enter the Max number"));

    const random = Math.floor(Math.random() * max) + 1;

    // Show correct number on website
    document.querySelector("#correctNumber").innerText = random;

    let guess = prompt("Guess the no.");

    while (true) {

        if (guess === "quit") {
            console.log("Never Give up");
            break;
        }

        if (Number(guess) === random) {

            console.log(
                "You are right! Congrats! The number was:",
                random
            );

            break;

        } else if (Number(guess) < random) {

            guess = prompt(
                "Hint: Your guess was too small, Please try Again"
            );

        } else {

            guess = prompt(
                "Hint: Your guess was too Big, Please try Again"
            );
        }
    }
}