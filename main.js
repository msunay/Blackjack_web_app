// Functions
calcHandScore = hand => {

    let handScore = 0;
    let aces = 0;
    for (let i = 0; i < hand.length; i++) {
        
        // Check hand for face cards, add value
        if (/[JQK]/.test(hand[i][0])) {
            handScore += 10;
        
        // Check hand for Ace, add appropriate value
        } else if (/A/.test(hand[i][0])) { 
            handScore += 11;
            aces++;
        
        // Else add card value
        } else {
            handScore += parseInt(hand[i][0]);
        }
    }

    for (let i = 0; i < aces; i++) {
        if (handScore > 21) {
            handScore -= 10;
        }
    }

    return handScore;
}

shuffleDecks = n => {

    // Shuffled deck
    let shuffled = [];
    for (let j = 0; j < n; j++) {

        let currentDeck = []
        while (currentDeck.length < 52) {
    
            // Random suit and val
            let randVal = Math.random() * value.length;
            let randSuit = Math.random() * suit.length;
    
            // Create card
            let card = [value.slice(randVal, randVal + 1)];
            card[1] = suit.slice(randSuit, randSuit + 1);
            
            // If the card isn't already in the deck add to deck
            if (currentDeck.includes(card) === false) {
                currentDeck.push(card);
            }
        }
        // Push tech to queue
        shuffled.push(currentDeck);
    }
    // Flatten queue array
    shuffled = shuffled.flat(1);
    return shuffled;
}

dealCard = currentTurnPlayer => {
     
    // Get first card from deck queue
    let card = deck.shift();

    // Push card to hand array for score calcs
    currentTurnPlayer.push(card);
    
    // Display shoe count
    $('#shoe-count').text(deck.length);
    
    return card;
}

reset = () => {
    
    // Reset
    $('li').remove();
    playerHand = [];
    dealerHand = [];
    $('.result').text('').css('opacity', '0');
    $('.scores').text('');
    $('.blackjack').text('');
    $('.game').removeClass('greyed-out');
    $('#start').prop('disabled', true);
    $('#start').removeClass('hover');

    // Generate queue of randomly shuffled cards with 1 decks
    deck = shuffleDecks(1);

    return;
}


startGame = () => {
    
    // Display shoe count
    $('#shoe-count').text(deck.length);

    // Deal 2 cards to player and dealer with delay
    setTimeout(() => { 
        let card = dealCard(playerHand);
        $('<li>').html(card).addClass('card').appendTo($('#player-hand .hand'));
        $('audio#deal')[0].play();
    }, time);

    setTimeout(() => { 
        card = dealCard(dealerHand);
        $('<li>').html(card).addClass('card hide').appendTo($('#dealer-hand .hand'));
        $('audio#deal')[0].play();
    }, (time * 2));

    setTimeout(() => { 
        card = dealCard(playerHand);
        $('<li>').html(card).addClass('card').appendTo($('#player-hand .hand'));
        $('audio#deal')[0].play();
    }, (time * 3));

    setTimeout(() => { 
        card = dealCard(dealerHand);
        $('<li>').html(card).addClass('card').appendTo($('#dealer-hand .hand'));
        $('audio#deal')[0].play();
    }, (time * 4));

    return;
} 

calculateScores = () => {

    // Calculate scores
    setTimeout(() => { 
        let playerScore = calcHandScore(playerHand);
        // Don't count flipped dealers card
        let dealerScore = calcHandScore([dealerHand[1]]);
    
        // Show player score
        $('#player-score').text(playerScore);
        $('#dealer-score').text(dealerScore);

        // Enable buttons
        $('.action-buttons').prop('disabled', false);
        $('.action-buttons').addClass('hover');

        if (playerScore === 21) {
            $('#player-blackjack').text('Blackjack!!');
            $stick.trigger('click');
        }
    }, time * 4.5);
    
    return;
} 

dealToDealer = () => {

    // Deal
    let deal = setInterval(() => { 
                
        $('audio#deal')[0].play();
        let card = dealCard(dealerHand);
        $('<li>').html(card).addClass('card').appendTo($('#dealer-hand .hand'));
        
        dealerScore = calcHandScore(dealerHand);
        $('#dealer-score').text(dealerScore);
        
        // When dealer reaches limit stop dealing and calcwinner
        if (dealerScore >= 17) {

            // Stop interval
            clearInterval(deal);
        }
    }, time);

    return;
}

calcWinner = () => {
    
    // Highest score wins
    setTimeout(() => {

        // Blackjacks
        if ($('#dealer-blackjack').text() === 'Dealer Blackjack!!' && $('#player-blackjack').text() !== 'Blackjack!!') {

            $('.result').text('Dealer Blackjack!! You Lose!!').css('opacity', '50');
            $('.game').addClass('greyed-out');

        } else if ($('#player-blackjack').text() === 'Blackjack!!') {

            $('.result').text('Blackjack!! You Win!!').css('opacity', '50');
            $('.game').addClass('greyed-out');
            $('audio#win')[0].play();

        // Dealer bust
        } else if (dealerScore > 21) {
            
            $('.result').text('Dealer Bust!! You Win!!').css('opacity', '50');
            $('.game').addClass('greyed-out');
            $('audio#win')[0].play();

        // Dealer win
        } else if (dealerScore > playerScore) {

            $('.result').text('Dealer Wins!!').css('opacity', '50');
            $('.game').addClass('greyed-out');

        // Draw
        } else if (dealerScore === playerScore) {
            
            $('.result').text('Draw!!').css('opacity', '50');
            $('.game').addClass('greyed-out');

        // Player win
        } else {

            $('.result').text('You Win!!').css('opacity', '50');
            $('.game').addClass('greyed-out');
            $('audio#win')[0].play();
        }

        // Enable start button
        setTimeout(() => {
            $('#start').prop('disabled', false);
            $('#start').addClass('hover');
        }, (time * 2));
    }, (time * 2));

    return;
}





// Main //

// Starting animation
$('.game').hide();
$('#start').hide();
$('h1').hide();

setTimeout(() => {
    $('h1').show();
    $('audio#shuffle')[0].play();
}, 1500);

setTimeout(() => {
    $('h1').animate({
    marginTop: '20px'
    }, 1500);
}, 3300)

setTimeout(() => $('.game').fadeIn(1200), 4000);

setTimeout(() => {
    $('#start').show();
    window.addEventListener("keydown", function (event) {
        if ($('#start').is(':enabled') && event.key === 'Enter') {
            $('#start').trigger('click');
        } else if ($('.action-buttons').is(':enabled') && event.key === '.') {
            $hit.trigger('click');
        } else if ($('.action-buttons').is(':enabled') && event.key === ',') {
            $stick.trigger('click')
        }
    });
}, 6000);


// Card values
const value = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// Card suits
const suit = ['&hearts;', '&diams;', '&spades;', '&clubs;'];

// Time delay
const time = 500;

// Start button
let $startButton = $('#start');

// Disable buttons
$('.action-buttons').prop('disabled', true);

// Empty deck
let deck = [];

// Create hands
let playerHand = [];
let dealerHand = [];

// Start Game
$startButton.on('click', reset)
            .on('click', startGame)
            .on('click', calculateScores);

// If player hits deal next card in deck
let $hit = $('#hit');
$hit.on('click', () => {
    
    // Deal card and calculate score
    setTimeout(() => { 

        $('audio#deal')[0].play();
        let card = dealCard(playerHand);
        $('<li>').html(card).addClass('card').appendTo($('#player-hand .hand'));
        playerScore = calcHandScore(playerHand);
        $('#player-score').text(playerScore);

        // If score over 21 player busts
        if (playerScore > 21) {
            
            // Deactivate buttons
            $('.action-buttons').prop('disabled', true);
            $('.action-buttons').removeClass('hover');
            
            setTimeout(() => {
                // Unhide dealer card
                $('.card.hide').removeClass('hide');
                dealerScore = calcHandScore(dealerHand);
                $('#dealer-score').text(dealerScore);
                
                
                // Player loses
                $('.result').text('Bust!! You Lose!!').css('opacity', '50');
                $('.game').addClass('greyed-out');

                // Dealer
                dealToDealer();

                // Enable start button
                // setTimeout(() => {
                //     $('#start').prop('disabled', false);
                //     $('#start').addClass('hover');
                // }, (time * 2));
            }, time)
        }
    }, time);
})

// If player sticks dealers turn
let $stick = $('#stick');
$stick.on('click', () => {
    
    // Unhide dealer card
    $('.card.hide').removeClass('hide');
    dealerScore = calcHandScore(dealerHand);
    playerScore = calcHandScore(playerHand)
    $('#dealer-score').text(dealerScore);
    
    // Deactivate buttons
    $('.action-buttons').prop('disabled', true);
    $('.action-buttons').removeClass('hover');

    if (dealerScore === 21) {
        $('#dealer-blackjack').text('Dealer Blackjack!!');
    }
    // If dealers hand is under 17 deal another card
    if (dealerScore < 17) {
       
        // Deal to dealer and calc result
        dealToDealer();
        calcWinner();

    } else {
        
        // Calc result
        calcWinner();
    }
});