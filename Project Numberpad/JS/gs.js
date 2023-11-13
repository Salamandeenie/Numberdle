// gameScriptV2
document.addEventListener("DOMContentLoaded", function (){

    generateSegmentedInput((slotDifficultyNumber));
    startTimer();
    generateAnswer();
    updateGuessCounter();

    console.log(answerGenerated);

});
