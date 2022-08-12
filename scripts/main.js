// ask for the username as long as
// an empty string is being passed
let getUsername = (currentScore) => {
    let username;
    do {
        // get the username via a prompt
        username = prompt("Your score is " + currentScore + ".\n"
            + "Please type in your username");

        // if the "cancel" button was pressed break from the loop
        if (username === null) break;

        // remove any possible leading/trailing whitespaces
        username = username.trim();

    } while (username.length == 0);


    // if a username was submitted
    if (username !== null) {
        let tempUsername = "";

        // clean it of possible spaces by converting them to camelCase
        for (let i = 0; i < username.length; i++) {

            // if the current char is a space
            if (username.charAt(i) === ' ') {

                // check if the following char is not a space
                // and that you're not checking an out of bounds index
                if (username.charAt(i + 1) !== ' ' && i + 1 !== username.length) {

                    // if it's not, add it to the tempUsername
                    let tmpLetter = username.charAt(i + 1).toUpperCase();
                    tempUsername += tmpLetter;

                    // skip the next character because it's already added
                    i++;
                }

            } else {

                // if it's not, just add it to the tempUsername
                tempUsername += username.charAt(i);
            }
        }
        // return the modified username
        username = tempUsername;
    }

    return username;
}


// check if the username is unique to the LS
let isUniqueUsername = (username) => {
    for (let i = 0; i < localStorage.length; i++) {

        // if there's already an entry with the same key in LS
        if (localStorage.key(i) == username)
            return false;
    }
    return true;
}



let updateHighScores = () => {

    let allScores = [];

    // fill the temporary array with the scores from localStorage
    for (let i = 0; i < localStorage.length; i++)
        allScores.push(parseInt(localStorage.getItem(localStorage.key(i))));

    // sort the array (desc)
    allScores.sort(function (a, b) { return b - a });

    let listOfNames = [];
    // for each high score in the top 3
    for (let j = 0; j < 3; j++) {

        // find the corresponding username
        // gets the first one if multiple users have the same score
        for (let i = 0; i < localStorage.length; i++)
            if (allScores[j] == parseInt(localStorage.getItem(localStorage.key(i)))
                &&
                !listOfNames.includes(localStorage.key(i))) // skip if the name is already in the list
                listOfNames.push(localStorage.key(i));
    }
    // find how many scores are visible in the highscore list
    let highscoreList = document.querySelectorAll("li");

    // if there's room to add more scores
    if (highscoreList.length < 3) {

        // fetch the template and add a score
        let template = document.querySelector("#scoreTemplate");
        let liItem = template.content.cloneNode(true);

        // append to list
        document.getElementById("scoreTable").appendChild(liItem);
    }

    // check again to see if the list has changed
    highscoreList = document.querySelectorAll("li");

    // update the list
    for (let i = 0; i < highscoreList.length; i++) {

        // children[0] = username
        highscoreList[i].children[0].textContent = listOfNames[i];

        // children[3] = score
        highscoreList[i].children[3].textContent = allScores[i];

        // children[1] = <br>, children[2] = <i>
    }
}


// add a K-V pair to the localstorage
let add = (username, currentScore) => {
    localStorage.setItem(username, currentScore);
    updateHighScores();
};


let startButton = document.getElementById("startButton");

// start the game on button click
startButton.addEventListener('click', () => {

    // disable the button while the game is running
    startButton.disabled = true;

    // allow the cookie image to be clickable
    let cookie = document.getElementById("cookie")
    cookie.setAttribute("data-clickable", "true");

    // fetch the score element
    let scoreElement = document.getElementById("score");

    let currentScore = 0;

    // defining a function in order to remove the listener
    // after the game is finished
    let updateScore = () => {
        currentScore++;

        // update the text in the element
        scoreElement.textContent = currentScore;
    };

    cookie.addEventListener('click', updateScore);

    // get the remaining time
    let secondsLeftText = document.getElementById("seconds");

    // parse the string
    let secondsLeft = parseInt(secondsLeftText.textContent);

    // save the starting counter for a later restart
    let startingCounter = secondsLeft;

    // define the interval function and call it
    // so you can stop the function via clearInterval()
    // when the time runs out
    const countDown = setInterval(() => {

        let gameCompleted = false;

        // if there's no time left
        if (--secondsLeft == 0) {

            gameCompleted = true;

            // stop the count
            clearInterval(countDown);

            // factor in the 0-th second
            secondsLeftText.textContent = secondsLeft;

            // re-enable the start button
            startButton.disabled = false;

            // remove the clicking listener
            cookie.removeEventListener('click', updateScore);

            // disable the ability to click the image
            cookie.setAttribute("data-clickable", "false");

            // reset the score
            scoreElement.textContent = 0;

            // get the username
            let username = getUsername(currentScore);

            // disallow using a username over 15 characters in length
            while (username !== null && username.length > 15) {
                alert("Your username must be between 1 and 15 characters long.");

                // ask for a new name
                username = getUsername(currentScore);
            }

            // as long as the user is submitting existing names
            while (!isUniqueUsername(username) && username !== null) {
                alert("The username you submitted is already taken!\n"
                    + "Please select a different username or cancel the process.");

                // ask for a new name
                username = getUsername(currentScore);
            }

            // if a username was actually submitted add it to the list
            if (username !== null)
                add(username, currentScore);

        }

        // update the text for time-left
        secondsLeftText.textContent = (gameCompleted) ? startingCounter : secondsLeft;

        // call the function every second (1000ms)
    }, 1000);

});


// on page load (ready state change goes through multiple states so it calls the function twice)

// call 3 times for top 3 list items
window.onload = () => {
    for (let i = 0; i < localStorage.length || i == 3; i++)
        updateHighScores();
}