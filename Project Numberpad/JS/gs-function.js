// gameScriptV2Functions 

    // Timer functions
    {
        // This function starts the updateTimer function by giving it the starting time
        function startTimer(){
            timerInterval = setInterval(updateTimer, 1000);
        }

        // The afermentioned updateTimer function. This keeps track of the time elapsed, and draws it to the timerPlaceholder so the player can see it
        function updateTimer(){
            const currentTime = new Date().getTime();
            const elapsedTime = new Date(currentTime - startTime);

            const minutes = elapsedTime.getMinutes().toString().padStart(2, '0');
            const seconds = elapsedTime.getSeconds().toString().padStart(2, '0');

            const formattedTime = `${minutes}:${seconds}`;
            timerPlaceholder.textContent = formattedTime;
        }
    
        // This function stops the updateTimer function when called. Doesn't do anything else
        function stopTimer(){
            if(timerInterval){
                clearInterval(timerInterval);
                timerInterval = null;
            }
        }
    }

    // Guess functions
    {
        // This function draws the current turnTracker onto the screen
        function updateGuessCounter(){
            guessPlaceholder.textContent = turnTracker;
            previousturnTracker = turnTracker; // Updates the previousturnTracker
        }

        // This function just adds/subtracts to/from the turnTracker [AS = Add/Subtract]
        function turnTrackerAS(AS = 1){
            if(!isWinGame)
            {
                turnTracker += AS;
                updateGuessCounter();
            }
        }
    }

    // Generation functions
    {
        // This function generates an array
        // numElements: The number of elements in the generated array
        // digitAmount: the number of digits in each element
        // minNumber: What the minimum generated number can be for each element
        // maxNumber: What the maximum generated number can be for each element
        function generateArray(numElements, digitAmount, minNumber, maxNumber){
            var generatedArray = [];

            // Loop for the number of elements
            for ( let i = 0; i < numElements; i++ ) {
                // Generate a random number
                var randomElement = Math.floor(Math.random() * (maxNumber - minNumber + 1) + minNumber);
                // Add the extra 0s to make sure that it is digitAmount digits long
                const formattedElement = randomElement.toString().padStart(digitAmount, '0');
                generatedArray.push(formattedElement);
            }

            return generatedArray;
        }

        // Generates an input field with slots number of segments
        function generateSegmentedInput(slots){
            if (!isWinGame){
            turnTrackerAS(); // Increment turnTracker

            const segmentedInputsContainer = document.getElementById('segmentedInputsContainer');

            const groupDiv = document.createElement('div');
            groupDiv.className = 'segment-group';
            groupDiv.id = "groupID" + turnTracker;
            
            for ( let i = 0; i < slots; i++ )
            {
                const input = document.createElement('input');
                input.maxLength = 2;

                if(greenTracker[i] != undefined && greenTracker[i] != false)
                {
                    input.placeholder = greenTracker[i];
                }
                else
                {
                    input.placeholder = '--';
                }

                input.addEventListener('input', handleInput);
                input.addEventListener('keydown', handleBackspace);
                groupDiv.appendChild(input);
            }
                segmentedInputsContainer.appendChild(groupDiv)

                // Add the event listener for the enter key
                document.body.addEventListener('keydown', handleEnterKey);

                return "groupID" + turnTracker;
            }
        }

        // When called, this just generates the answer array using the generateArray function.
        function generateAnswer(numElements = 5, digitAmount = 2, minNumber = 0, maxNumber = 99){
            answerGenerated = generateArray(numElements, digitAmount, minNumber, maxNumber);
        }
    }

    // Finder functions
    {
        // Finds the location of an object in an array
        function findObjectInArray(object, array) {
            for (let i = 0; i < array.length; i++) {
              if (array[i] === object) {
                return i; // Return the index of the first occurrence of the object
              }
            }
            return -1; // If the number is not found in the array, return -1
          }

        // Find a child object by using its parent's ID
        function findChildFromParentID(parentId, childNumber) {
            // Get the parent element by its ID
            const parent = document.getElementById(parentId);
          
            if (parent) {
              // Get all child elements of the parent
              const children = parent.children;
          
              // Check if the requested child number is within a valid range
              if (childNumber >= 0 && childNumber < children.length) {
                // Get the nth child
                const child = children[childNumber];
          
                // Add an ID to the child element using the specified format
                child.id = `${parentId}_C${childNumber}`;
          
                return child;
              } else {
                // Return null if the childNumber is out of range
                return null;
              }
            } else {
              // Return null if the parent element with the given ID is not found
              return null;
            }
          }

        // Reads the current input of the screen. This function is here because it is technically finding something I guess. I dunno. I don't get paid enough for this. In fact, I don't get paid at all. :)
        function readInput(segmentGroupID){

            const group = document.getElementById(segmentGroupID);
            if (!group) {
                return null; // Group not found
            }
        
            const inputs = group.querySelectorAll('input');
            const inputData = [];
        
            inputs.forEach(input => {
                // Convert the input value to a number and format it
                const value = input.value;
                let formattedValue = "";
               {
                    const parsedValue = parseInt(value, 10);
                    if (parsedValue == undefined || isNaN(parsedValue)) {
                        formattedValue = "pending";
                    } else {
                        formattedValue = parsedValue.toString().padStart(2, '0');
                    }
                }
        
                inputData.push(formattedValue);
            });
            data = inputData;
            return inputData;
        }

        // returns a hex code based on whatever is generated by colorGrade and autoGreen
        function getColorCode(colorGrade){
            switch (colorGrade) {
                case 'Green':
                    return '6ca965';
                case 'Yellow':
                    return 'c8b653';
                case 'Purple':
                    return 'b04bd3';
                case 'Blue':
                    return '4f4ba3';
                case 'Red':
                    return 'a34b52';
                default:
                    return '787c7f';
            }  
        }
    }

    // Color grading functions
    {
        // This is the heart of the color grading functions. It uses math to determine the colors that should be returned to the later functions
        // This function expects arrays as inputs
        function colorGrade(input, answer){
            const colorGrades = []; // The array that holds all of the color grades
            const yellowTracker = new Array(answer.length).fill(false); // Tracks yellows
            
            for ( let i = 0; i < input.length; i++ ) {
                var inputElement = input[i];
                var answerElement = answer[i];

                if (inputElement === answerElement) {
                    colorGrades.push('Green');
                    yellowTracker[i] = true; // Mark slot as used for yellow tracker
                    greenTracker[i] = inputElement; // Marks down  the value of inputElement in the greenTracker for the autoGreen funciton
                }
                    else if (answer.includes(inputElement)) {
                        colorGrades.push('pending');
                    } else {
                        if (!inputElement.isNaN /* && inputElement != "" && inputElement != undefined*/)
                        {
                            const diff = Math.abs(answerElement - inputElement);
                            if (diff <= 2) {
                                colorGrades.push('Purple'); // If the input is within 2, return purple
                            } else if (answerElement % inputElement === 0) {
                                colorGrades.push('Blue'); // If the answer is divisible by the input, return blue
                            } else if (inputElement % answerElement === 0 && inputElement != 0) {
                                colorGrades.push('Red'); // If the input is divisible by the answer, return red
                            } else {
                                colorGrades.push('Grey'); // If all else fails, return grey
                            }
                        }
                        else colorGrades.push('Grey'); // If all else fails, return grey
                    }
            }

            for ( let i = 0; i < input.length; i++ ) {
                if(colorGrades[i] == 'pending')
                {
                    if(yellowTracker[findObjectInArray(input[i], answer)] == false) // Check the yellow tracker. If the input is not in the answer, add it to the tracker and make it yellow.
                    {
                        yellowTracker[findObjectInArray(input[i], answer)] = true;
                        colorGrades[i] = 'Yellow';
                    }

                    else {
                        colorGrades[i] = 'Grey';
                    }
                }
            }

            return colorGrades;

        }

        // This function takes all the pending values and the greenTracker to determine if the input should be equal to greenTracker (If input = "" and greenTracker != false to be clear)
        function autoGreen(segmentGroupID, inputData){
            for ( let i = 0; i < data.length; i++ )
            {
                if(data[i] == "pending"){
                    data[i] = greenTracker[i];

                    if(greenTracker[i] != false && greenTracker[i] != undefined){
                        findChildFromParentID(segmentGroupID, i).placeholder = greenTracker[i]; // Nab the greenTracker value, and redraw it to the screen. Slam Bam.
                    }
                }

                else{
                    data[i] = inputData[i];
                }
            }

            return data;
        }

        // This takes whatever has been returned by the previous two functions and darkens it for shadows
        function darkenColor(hex, darkness){
            const color = parseInt(hex, 16);
            const darkenedColor = Math.max(0, Math.min(0xFFFFFF, color - darkness)); // Make sure that it is clamped within the bounds of color (0 and 0xFFFFFF)

            return darkenedColor.toString(16).padStart(6, '0'); // Return the processed value (while also making sure that it is 6 digits)
        }

        // This draws the color grades onto the screen
        function updateColorGrade(segmentGroupID, colorGrades){
            const group = document.getElementById(segmentGroupID);

            if (group) {
                const inputs = group.querySelectorAll('input');
                inputs.forEach((input, index) => {
                    const colorCode = getColorCode(colorGrades[index]);
                    input.style.backgroundColor = '#' + colorCode;

                    // Use darkenColor to create a shadow
                    const shadowColor = darkenColor(colorCode, 9010); // Def value: 9010

                    // Set the boxShadow property on the input element
                    input.style.boxShadow = '0 5px 0 0px #' + shadowColor;
                }); 
            }
        }


        // [[[ ALSO SEE "getColorCode" in Finder functions ]]]
    }


    // Handler functions
    {
        // Handles the segmenented input field so that the user can actually play the game
        function handleInput(e){
            const value = e.target.value;

            if (value.length === 2) {
                const nextInput = e.target.nextElementSibling
                if (nextInput) {
                    nextInput.focus();
                }
            }
        }

        // Handles the backspace action, so when backspace is pressed, it moves the focus to the previous segment if it exists.
        function handleBackspace(e){
            if (e.key === 'Backspace' && e.target.selectionStart === 0) {
                const prevInput = e.target.previousElementSibling;
                if (prevInput) {
                    prevInput.focus();
                }
            }
        }

        // Handles the enterkey. When enter is pressed, it tells the readInput function to do its thing.
        function handleEnterKey(e){
            if (e.key === 'Enter' && !isWinGame) {
                let data = readInput("groupID" + turnTracker);
                data = autoGreen("groupID" + (turnTracker), data);
                const colorGrades = colorGrade(data, answerGenerated);
                updateColorGrade("groupID" + turnTracker, colorGrades);
                disableInputsById("groupID" + turnTracker);
                isWin(data, answerGenerated);
                generateSegmentedInput(slotDifficultyNumber, "groupID" + turnTracker);
                if (!isWinGame){
                    findChildFromParentID("groupID" + turnTracker, 0).focus();
                    document.getElementById( "groupID" + turnTracker ).scrollIntoView();

                }
            }
        }
    }

    // Button functions 
    {
        function githubGO() {
            window.location.href = 'https://github.com/Salamandeenie/'; 
        }

        function randGuess(){
            let randomGuess = generateArray(slotDifficultyNumber, 2, 0, 99);
            console.log();
            forceEnter(randomGuess);
            findChildFromParentID("groupID" + turnTracker, 0).focus();
            document.getElementById( "groupID" + turnTracker ).scrollIntoView();

        }

        function giveUp(){
            isFailGame = true;
            alert("The answer is: " + answerGenerated);
            alert("Also, you lose");
            forceEnter(answerGenerated)
            isWin(answerGenerated, answerGenerated);
        }

        function resetti(){
            location.reload(true);
        }
    }

    // Misc. functions 
    {
        // Checks if the player has won. If they have, celebrate. If they have not, boo hoo I guess.
        function isWin(input, answer){
            for ( let i = 0; i < input.length; i++ )
            {
                if (input[i] !== answer[i]) {
                    return false;
                }
            }

            turnTrackerAS();
            stopTimer();
            isWinGame = true;

            if(!isFailGame){
                var inputElements = document.querySelectorAll('input');
                document.getElementById('title').textContent = "YOU WIN";
    
    
                inputElements.forEach(function (input, index) {
                    setTimeout(function () {
                        input.classList.add('rainbow-background');
                    }, index * 10); // Delay each input by 10ms
                });     
            }    

            else {
                var inputElements = document.querySelectorAll('input');
                document.getElementById('title').textContent = "YOU LOSE";
    
    
                inputElements.forEach(function (input, index) {
                    setTimeout(function () {
                        input.classList.add('redbow-background');
                    }, index * 10); // Delay each input by 10ms
                });     
            }

            return true;
        }

        // Does what the enter handler does, just without pressing the enter key, and doesn't actually look at the input of the user, hence the "force". Is to be used only by the isWin()
        function forceEnter(forceInput = undefined, forceAnswer = undefined)
        {
            var data = forceInput;
            if (!isWinGame) {
                if (!forceInput)
                {
                    data = readInput("groupID" + turnTracker);
                    data = autoGreen("groupID" + (turnTracker), data);
                }
                const colorGrades = colorGrade(data, answerGenerated);
                updateColorGrade("groupID" + turnTracker, colorGrades);
                disableInputsById("groupID" + turnTracker);
                isWin(data, answerGenerated);
                generateSegmentedInput(slotDifficultyNumber, "groupID" + turnTracker);

                for ( let i = 0; i < data.length; i++ )
                {
                    findChildFromParentID("groupID" + (turnTracker -1), i).placeholder = forceInput[i]; // Nab the answer value, and redraw it to the screen. Slam Bam.
                }
            }
        }

        // Disables the use of a specific segmented group using the groups ID
        function disableInputsById(groupID){
            const div = document.getElementById(groupID);
            if (div) {
                const inputs = div.querySelectorAll('input');
                inputs.forEach(input => {
                    input.disabled = true;
                });
            }
        }
    }
