// gameScriptV2
document.addEventListener("DOMContentLoaded", function (){

    generateSegmentedInput((slotDifficultyNumber));
    startTimer();
    generateAnswer();
    updateGuessCounter();

    findChildFromParentID("groupID" + turnTracker, 0).focus();
    document.getElementById( "groupID" + turnTracker ).scrollIntoView();

    // console.log(answerGenerated);

});
