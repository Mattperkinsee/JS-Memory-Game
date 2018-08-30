/*
 * Create a list that holds all of your cards
 */

var cards = ["diamond", "diamond", "paper-plane", "paper-plane", "anchor", "anchor", "bolt", "bolt", "cube", "cube", "leaf", "leaf", "bicycle", "bicycle", "bomb", "bomb"];
const wobble = ["animated", "wobble"];
const bounce = ["animated", "bounce"];
var openCardsList = [];
var lockedCards = [];
var targetsList = [];
var delayInMilliseconds = 2000;
var movement = 0;
var stars = 3;
var scorePanel = document.querySelector('.score-panel');
var header = document.querySelector('header');
var checkMark = document.querySelector('.checkmark');
var timer = new Timer();
//
//var cardList = $('.deck > .card > i');

//
//console.log(cardList);

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
timer.start();
timer.addEventListener('secondsUpdated', function (e) {
    $('#basicUsage').html(timer.getTimeValues().toString());
});
shuffle(cards);
buildCardsHTML();

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}




var resetButton = document.getElementsByClassName('restart');
resetButton[0].addEventListener('click', reset);

function buildCardsHTML() {
    
    for (let i = 0; i < cards.length; i++) {
        let deck = document.querySelector(".deck");
        let liElement = document.createElement('li');
        deck.appendChild(liElement);
        let cardName = cards[i];
        liElement.className = 'card fa fa-' + cardName + ' hide';
        liElement.addEventListener('click', displayCard);
    }
}


function displayCard(e) {
    if (targetsList.length < 2) {
        e.target.classList.add('open');
        e.target.classList.add("show");
        e.target.removeEventListener('click', displayCard);
        console.log('click');

        matchCheck(e);
        console.log(targetsList);
    }

}


function matchCheck(e) {
//    e.target.classList.add("show");
    targetsList.push(e.target);
    if (openCardsList.length < 2) {
        openCardsList.push(e.target.className);
        if (openCardsList.length === 2) {
            if (openCardsList[0] === openCardsList[1]) {
                console.log('match!');
                incMovement();
                targetsList.push((e.target));
                lockCards(e);
            } else {
                console.log('no match');
                incMovement();

                hideCards(e);

            }
        }
    }
}

function clearArrays() {
    openCardsList = [];
    targetsList = [];
}

function lockCards(e) {
    console.log('lock cards');
    lockedCards.push(targetsList[0]);
    lockedCards.push(targetsList[1]);
    console.log(lockedCards);
    targetsList[0].classList.add('match');
    targetsList[1].classList.add('match');
    targetsList[0].classList.add(...bounce);
    targetsList[1].classList.add(...bounce);
    targetsList[0].classList.remove("hide");
    targetsList[1].classList.remove("hide");


    clearArrays();
    //test for win by determining 16 locked cards in array
    if (lockedCards.length === cards.length) {
        displayWin(movement, stars);
    }

}

function hideCards(e) {
    //add styling and animation for mismatch//
    targetsList[0].classList.add("mismatch");
    targetsList[1].classList.add("mismatch");
    targetsList[0].classList.add(...wobble);
    targetsList[1].classList.add(...wobble);

    //set delay for mismatch//
    setTimeout(function() {
        //hides and removes styling after mismatch//
        targetsList[0].classList.add("hide");
        targetsList[1].classList.add("hide");

        targetsList[0].classList.remove("mismatch");
        targetsList[1].classList.remove("mismatch");
        targetsList[0].classList.remove(...wobble);
        targetsList[1].classList.remove(...wobble);
        targetsList[0].classList.remove("show");
        targetsList[1].classList.remove("show");
        targetsList[0].classList.remove("open");
        targetsList[1].classList.remove("open");
        console.log('hide cards');

        //add back event listeners afer mismatch//
        targetsList[0].addEventListener('click', displayCard);
        targetsList[1].addEventListener('click', displayCard);
        clearArrays();
    }, delayInMilliseconds);

}

function incMovement(e) {
    movement++;
    var moves = document.querySelector(".moves");
    moves.innerHTML = (movement);
    determineStars();

}

function determineStars() {
    if (movement === 18) {
        var $firstStar = $('.stars > li:eq(0) > i');
        $firstStar.removeClass('fa fa-star').addClass('fa fa-star-o');
        stars--;
        console.log('remove star');

    } else if (movement === 15) {
        var $secondStar = $('.stars > li:eq(1) > i');
        $secondStar.removeClass('fa fa-star').addClass('fa fa-star-o');
        stars--
        console.log('remove star');
    } else if (movement === 12) {
        var $thirdStar = $('.stars > li:eq(2) > i');
        $thirdStar.removeClass('fa fa-star').addClass('fa fa-star-o');
        stars--;
        console.log('remove star');

    }
}
function displayWin(movement, stars) {
    /*remove cards and hide header*/
    scorePanel.classList.add('hide');
    header.classList.add('hide');
    destroyCards();

    let deck = document.querySelector(".deck");
    deck.style.alignContent = "center";
    deck.classList.add('win');
    var checkMark = document.querySelector(".checkmark");

    var div = document.createElement('div');

    div.classList.add('winText');
    div.classList.add(...bounce);
    deck.appendChild(div);
    checkMark.classList.remove('hideCheck');
    var title = document.createElement('h1');
    var subtitle = document.createElement('h4');
    var button = document.createElement('button');
    title.classList.add('title');
    subtitle.classList.add('subtitle');
    button.classList.add('button');
    div.appendChild(title);
    div.appendChild(subtitle);
    div.appendChild(button);
    title.innerHTML = "Congrats! You Won!";
    subtitle.innerHTML = "With " + movement + " moves and " + stars + " stars! Wooo!";
    button.innerHTML = "Play again!";
    button.addEventListener('click', removeWinScreen);
    
    
   
   timer.stop();


}

function removeWinScreen() {
    var deck = document.querySelector(".deck");
    deck.style.alignContent = null;
    var winScreen = $('.winText');
    winScreen.remove('.winText');
    var deck = document.querySelector(".deck");
    deck.classList.remove('win');
    scorePanel.classList.remove('hide');
    header.classList.remove('hide');
    checkMark.classList.add('hideCheck');
    reset();
}

function reset() {
    movement = 0;
    stars = 3;
    shuffle(cards);
    targetsList = [];
    openCardsList = [];
    destroyCards();
    lockedCards = [];

    var $resetStars = $('.stars > li > i');
    $resetStars.removeClass('fa fa-star-o').addClass('fa fa-star');
    timer.reset();
    buildCardsHTML();
    console.log('reset');

}

function destroyCards() {
    var cards = $('.deck > li');
    cards.remove('.card');
    var moves = document.querySelector(".moves");
    moves.innerHTML = (movement);


}







/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */