// gameScriptV2Variables

    // The answer array. Can't really say much else.
    var answerGenerated = [];

    // This temporarly stores the value from readInput. Is this useful? Kinda I guess. I dunno, man.
    var prevRead = undefined;

    // If this is false, the player has not won. If it is true, the player has won, and inputs, timers, and counters should all be disabled.
    var isWinGame = false;

    // If this is true, we know that the player has given up, and to ignore isWinGame
    var isFailGame = false;

    // This changes how many segments there are. Default is 5.
    var slotDifficultyNumber = 5;

    // This keeps track of the green values for the autoGreen function
    var greenTracker = new Array(slotDifficultyNumber).fill(false);

    // Tracks the turn number... Mind melting stuff right here.
    var turnTracker = -1;

    // The interval of how often the timer is redrawn. Default is "= setInterval(updateTimer, 100)"
    var timerInterval; // Update every decasecond / 100 miliseconds

    // The clock time when the page is loaded. Used by the timer functions
    var startTime = new Date().getTime();

    // These functions just nab refrences for the two placeholders
    const timerPlaceholder = document.getElementById('timerPlaceholder');
    const guessPlaceholder = document.getElementById('guessPlaceholder'); 