document.addEventListener("DOMContentLoaded", function () {

    var answerGenerated = undefined;
    var answerSegmented = [];
    var slotDifficultyNumber = 5;
    // JavaScript code
    let timerInterval; // Variable to store the timer interval
    let startTime; // Variable to store the start time
    let previousTurnNumber = turnNumber; // Initialize the previousTurnNumber variable
    const timerPlaceholder = document.getElementById('timerPlaceholder');
    const guessPlaceholder = document.getElementById('guessPlaceholder');
    const greenTracker = new Array(slotDifficultyNumber).fill(false);
    
    // Function to start the timer
    function startTimer() {
        if (!timerInterval) {
        startTime = new Date().getTime();
        timerInterval = setInterval(updateTimer, 100); // Update every decasecond (100 milliseconds)
        }
    }

    // Function to update the timer
    function updateTimer() {
        const currentTime = new Date().getTime();
        const elapsedTime = new Date(currentTime - startTime);
        const minutes = elapsedTime.getMinutes().toString().padStart(2, '0');
        const seconds = elapsedTime.getSeconds().toString().padStart(2, '0');

        const formattedTime = `${minutes}:${seconds}`;
        timerPlaceholder.textContent = formattedTime;
    }

    function updateGuessCounter() {
        if (previousTurnNumber !== turnNumber) {
          guessPlaceholder.textContent = turnNumber;
          previousTurnNumber = turnNumber; // Update the previous value
        }
      
        requestAnimationFrame(updateGuessCounter); // Schedule the next update
    } 
    
    // Function to stop the timer
    function stopTimer() {
        if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        }
    }

    // Generate a random answer number
    function generateAnswer() {
        // Generate a new answer
        answerSegmented = generateArray();
    }

    function generateArray(numElements = 5, digitAmount = 2, minNumber = 0, maxNumber = 99) {
        const generatedArray = [];
        for (let i = 0; i < numElements; i++) {
            const randomElement = Math.floor(Math.random() * (maxNumber - minNumber + 1) + minNumber);
            const formattedElement = randomElement.toString().padStart(digitAmount, '0');
            generatedArray.push(formattedElement);
        }
        return generatedArray;
    }
    


    // Segmentize function with exceptions
    function segmentize(input, output = [], segmentSize = 2) {
        const inputStr = input.toString();
    
        if (inputStr.length % segmentSize !== 0) {
            console.log("Error: Input is invalid");
        }
    
        // Clear the output array
        output.length = 0;
    
        for (let i = 0; i < inputStr.length; i += 2) {
            output.push(inputStr.slice(i, i + 2));
        }
    
        return output;
    }
    

    function desegmentize(input = [], output) {
      const sanitizedInput = input.map(element => {
          // Remove negative sign if present
          element = element.replace(/-/g, '');
  
          // Ensure each element is at least 2 digits
          if (element.length === 1) {
              element = '0' + element;
          } else if (element.length > 2) {
              element = element.slice(-2);
          }
  
          // Check for undefined or NaN elements
          if (!element || isNaN(parseInt(element))) {
              element = '00';
          }
  
          return element;
      });
  
      output = parseInt(sanitizedInput.join(''), 10);
      return output;
  }

  function isWin(input, answer) {
    if (input.length !== answer.length) {
      return false; // If the arrays have different lengths, they can't be the same.
    }
  
    for (let i = 0; i < input.length; i++) {
      if (input[i] !== answer[i]) {
        return false; // If any elements don't match, the arrays are not the same.
      }
    }
    turnNumber++;
    alert("You WIN!!!!");
    stopTimer();
    return true; // If the arrays have the same length and all elements match, you win.
  }
  
  

  function findObjectInArray(number, array) {
    for (let i = 0; i < array.length; i++) {
      if (array[i] === number) {
        return i; // Return the index of the first occurrence of the number
      }
    }
    return -1; // If the number is not found in the array, return -1
  }

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

    
function colorGrade(input, answer) {
    const colorGrades = [];
    const yellowTracker = new Array(answer.length).fill(false); // Initialize the tracker array with 'false'

    for (let i = 0; i < input.length; i++) {
        const inputElement = input[i];
        const answerElement = answer[i];

        if (inputElement === answerElement) {
            colorGrades.push('Green');
            yellowTracker[i] = true; // Mark this answer element as matched
            greenTracker[i] = inputElement; // Mark this as filled in the green tracker
        } 
            else if (answer.includes(inputElement)) {
            colorGrades.push('pending');
            } else {
                if(!inputElement.isNaN)
                {
                    const diff = Math.abs(answerElement - inputElement);
                    if (diff <= 2) {
                        colorGrades.push('Purple');
                    } else if (answerElement % inputElement === 0) {
                        colorGrades.push('Blue');
                    } else if (inputElement % answerElement === 0 && inputElement != 0) {
                        colorGrades.push('Red');
                    } else {
                        colorGrades.push('Grey');
                    }
                }
                else colorGrades.push('Grey');
            }
    }

    for (let i = 0; i < input.length; i++){
        if(colorGrades[i] == 'pending') // All the maybe yellows
        {
            if(yellowTracker[findObjectInArray(input[i], answer)] == false) // Check the yellow tracker, if it is not true, make it yellow, and add it to the tracker.
            {
                yellowTracker[findObjectInArray(input[i], answer)] = true;
                colorGrades[i] = 'Yellow';
            }

            else{
                colorGrades[i] = 'Grey';
            }

        }
    }

    return colorGrades;
}


      function updateUIWithColorGrades(segmentGroupId, colorGrades) {
        const group = document.getElementById(segmentGroupId);

        if (group) {
            const inputs = group.querySelectorAll('input');
            inputs.forEach((input, index) => {
                // Update the background color of each input based on colorGrades
                input.style.backgroundColor = getColorCode(colorGrades[index]);
            });
        }
    }

    function getColorCode(colorGrade) {
      switch (colorGrade) {
          case 'Green':
              return '#6ca965';
          case 'Yellow':
              return '#c8b653';
          case 'Purple':
              return '#b04bd3';
          case 'Blue':
              return '#4f4ba3';
          case 'Red':
              return '#a34b52';
          default:
              return '#787c7f';
      }
  }

    var turnNumber = -1;
    // Function to create segmented input fields with a specified number of slots and a unique group ID
    function createSegmentedInput(slots) {
      turnNumber++; // Increment turnNumber
      const segmentedInputsContainer = document.getElementById('segmentedInputsContainer');

      const groupDiv = document.createElement('div');
      groupDiv.className = 'segment-group';
      groupDiv.id = "groupID" + turnNumber;

      for (let i = 0; i < slots; i++) {
          const input = document.createElement('input');
          input.maxLength = 2;
          if(greenTracker[i] != false)
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

      segmentedInputsContainer.appendChild(groupDiv);

      // Add the event listener for Right Control key after creating the input fields
      if (turnNumber > 1) {
          document.body.addEventListener('keydown', handleEnterKey);
      }

      return "groupID" + turnNumber;
  }


    // Function to read data from a specific group of segments
    function readInput(segmentGroupId) {
      const group = document.getElementById(segmentGroupId);
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
              if (isNaN(parsedValue) || parsedValue <= 0) {
                  formattedValue = "pending"; // Handle NaN or negative values as "00"
              } else {
                  formattedValue = parsedValue.toString().padStart(2, '0');
              }
          }
  
          inputData.push(formattedValue);
      });
      return inputData;
  }

  function autoGreen(segmentGroupId, inputData)
  {
    input = readInput(segmentGroupId);

    for (let i = 0; i < input.length; i++)
    {
        if(input[i] == "pending"){
            input[i] = greenTracker[i];

            if(greenTracker[i] != false){
                findChildFromParentID(segmentGroupId, i).placeholder = greenTracker[i];
            }
        }

        else{
            input[i] = inputData[i];
        }
    }

    return input;
  }
  
    // Function to handle a key press (trigger createSegmentedInput on Enter)
    function handleEnterKey(e) {
        if (e.key === 'Enter') {
          let data = readInput("groupID" + turnNumber);
          data = autoGreen("groupID" + (turnNumber), data);
          const colorGrades = colorGrade(data, answerSegmented);
          updateUIWithColorGrades("groupID" + turnNumber, colorGrades);
          disableInputsInDiv("groupID" + turnNumber);
          if(!isWin(data, answerSegmented))
          {
            createSegmentedInput(slotDifficultyNumber, "groupID" + turnNumber);
            document.getElementById( "groupID" + turnNumber ).scrollIntoView(); 
          }

          if(turnNumber > 50){
            console.log("Failsafe activated: " + answerSegmented)
          }

          findChildFromParentID("groupID" + turnNumber, 0).focus();
        }
    }

    function disableInputsInDiv(groupID) {
      const div = document.getElementById(groupID);
      if (div) {
          const inputs = div.querySelectorAll('input');
          inputs.forEach(input => {
              input.disabled = true;
          });
      }
  }

    // Function to handle input events (move to the next input)
    function handleInput(e) {
        const value = e.target.value;

        if (value.length === 2) {
            const nextInput = e.target.nextElementSibling;
            if (nextInput) {
                nextInput.focus();
            }
        }
    }

    // Function to handle backspace (move to the previous input)
    function handleBackspace(e) {
        if (e.key === 'Backspace' && e.target.selectionStart === 0) {
            const prevInput = e.target.previousElementSibling;
            if (prevInput) {
                prevInput.focus();
            }
        }
    }

    createSegmentedInput((slotDifficultyNumber));

    // Add event listener to handle Enter key press
    document.body.addEventListener('keydown', handleEnterKey);

    //Generate Answer
    generateAnswer();
    // Start the timer when the page loads
    startTimer();
    // Start the update loop
    updateGuessCounter();

});