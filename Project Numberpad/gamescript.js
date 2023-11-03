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
        let error = false; // Variable to track if an error occurred
        // Generate a new answer
        answerSegmented = generateArray();
        desegmentize(answerSegmented, answerGenerated);
        console.log(answerGenerated);
        console.log(answerSegmented);
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
            console.log("Error: Answer generated is invalid... Retrying");
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
  
    console.log('You Win');
    alert("You WIN!!!!");
    stopTimer();
    return true; // If the arrays have the same length and all elements match, you win.
  }
  
  

  function findNumberInArray(number, array) {
    for (let i = 0; i < array.length; i++) {
      if (array[i] === number) {
        return i; // Return the index of the first occurrence of the number
      }
    }
    return -1; // If the number is not found in the array, return -1
  }

    const greenTracker = new Array(slotDifficultyNumber).fill(false);
function colorGrade(input, answer) {
    const colorGrades = [];
    const yellowTracker = new Array(answer.length).fill(false); // Initialize the tracker array with 'false'

    for (let i = 0; i < input.length; i++) {
        const inputElement = input[i];
        const answerElement = answer[i];

        if (inputElement === answerElement) {
            colorGrades.push('Green');
            yellowTracker[i] = true; // Mark this answer element as matched
            greenTracker[i] = true; // Mark this as filled in the green tracker
        } 
            else if (answer.includes(inputElement)) {
            colorGrades.push('pending');
            } else {
                const diff = Math.abs(inputElement - answerElement);
                if (diff <= 2) {
                    colorGrades.push('Purple');
                } else if (answerElement % inputElement === 0) {
                    colorGrades.push('Blue');
                } else if (inputElement % answerElement === 0) {
                    colorGrades.push('Red');
                } else {
                    colorGrades.push('Grey');
                }
            }
    }

    for (let i = 0; i < input.length; i++){
        if(colorGrades[i] == 'pending') // All the maybe yellows
        {
            if(yellowTracker[findNumberInArray(input[i], answer)] == false) // Check the yellow tracker, if it is not true, make it yellow, and add it to the tracker.
            {
                yellowTracker[findNumberInArray(input[i], answer)] = true;
                colorGrades[i] = 'Yellow';
            }

            else{
                colorGrades[i] = 'Grey';
            }

        }
        else console.log("not pending, continuing");
    }

    console.log('Color Grades:', colorGrades);
    console.log(yellowTracker);

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
      console.log("Turn count has been incremented!!! " + turnNumber );

      const segmentedInputsContainer = document.getElementById('segmentedInputsContainer');

      const groupDiv = document.createElement('div');
      groupDiv.className = 'segment-group';
      groupDiv.id = "groupID" + turnNumber;

      for (let i = 0; i < slots; i++) {
          const input = document.createElement('input');
          input.maxLength = 2;
          input.placeholder = '00';
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
  
          if (value === "") {
              formattedValue = "00"; // Handle empty input as "00"
          } else {
              const parsedValue = parseInt(value, 10);
              if (isNaN(parsedValue) || parsedValue < 0) {
                  formattedValue = "00"; // Handle NaN or negative values as "00"
              } else {
                  formattedValue = parsedValue.toString().padStart(2, '0');
              }
          }
  
          inputData.push(formattedValue);
      });
  
      return inputData;
  }
  

    // Function to handle a key press (trigger createSegmentedInput on Enter)
    function handleEnterKey(e) {
        if (e.key === 'Enter') {
          const data = readInput("groupID" + turnNumber);
          const colorGrades = colorGrade(data, answerSegmented);
          updateUIWithColorGrades("groupID" + turnNumber, colorGrades);
          disableInputsInDiv("groupID" + turnNumber);
          if(!isWin(data, answerSegmented))
          {
            createSegmentedInput(slotDifficultyNumber, "groupID" + turnNumber);
            console.log("groupID" + turnNumber);
            document.getElementById( "groupID" + turnNumber ).scrollIntoView(); 
          }
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