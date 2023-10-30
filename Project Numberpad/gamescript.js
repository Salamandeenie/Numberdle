document.addEventListener("DOMContentLoaded", function () {

    var answerGenerated = undefined;
    var answerSegmented = [];
    var slotDifficultyNumber = 5;

    // Generate a random answer number
    function generateAnswer() {
        // Implement your random number generation logic here
        answerGenerated = Math.floor(Math.random() * Math.pow(10, 2 * slotDifficultyNumber));
        segmentize(answerGenerated, answerSegmented);
        console.log(answerGenerated);
        console.log(answerSegmented);
    }

    // SEGMENTIZE FUNCTIONS
    function segmentize(input, output = []) {
        // Convert the input number to a string
        const inputStr = input.toString();

        // Check if the input has an even number of digits
        if (inputStr.length % 2 !== 0) {
            return "Input must have an even number of digits (2x digits).";
        }

        // Use a loop to split the string into 2-digit segments and add them to the output array
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
  

  function compareArrays(arr1, arr2) {
    const results = [];

    for (let i = 0; i < arr1.length; i++) {
        let found = false;

        for (let j = 0; j < arr2.length; j++) {
            if (arr1[i] === arr2[j]) {
                found = true;
                break; // If found, no need to continue searching
            }
        }

        results.push(found ? 1 : 0);
    }

    return results;
}

function colorGrade(input, answer) {
  // Initialize an array to store the color grades
  const colorGrades = [];

  // Iterate through the elements of input and answer arrays to find yellow grades
  for (let i = 0; i < input.length; i++) {
      const inputElement = parseInt(input[i]);
      const answerElement = parseInt(answer[i]);

      if (isNaN(inputElement) || isNaN(answerElement)) {
          // Grey - If any element is not a number, the entire input is grey
          colorGrades.push('Grey');
      } else if (inputElement === answerElement) {
          // Green - Same value and same position
          colorGrades.push('Green');
      } else if (answer.includes(inputElement)) {
          // Yellow - Element exists in the answer array
          colorGrades.push('Yellow');
      } else {
          // Push a placeholder value (e.g., 'Pending') for non-yellow elements
          colorGrades.push('Pending');
      }
  }

  // Now, process the remaining color grades (Purple, Blue, Red, and Grey)
  for (let i = 0; i < input.length; i++) {
      if (colorGrades[i] === 'Pending') {
          const inputElement = parseInt(input[i]);
          const answerElement = parseInt(answer[i]);

          // Check for Purple, Blue, and Red conditions
          const diff = Math.abs(inputElement - answerElement);
          if (diff <= 2) {
              // Purple - Same position and value within 2
              colorGrades[i] = 'Purple';
          } else if (answerElement % inputElement === 0) {
              // Blue - Same position and input is a multiple of answer
              colorGrades[i] = 'Blue';
          } else if (inputElement % answerElement === 0) {
              // Red - Same position and input is divisible by answer
              colorGrades[i] = 'Red';
          } else {
              // Grey - None of the conditions are met
              colorGrades[i] = 'Grey';
          }
      }
  }

  // Log the color grades into the console
  console.log('Color Grades:', colorGrades);

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

    var turnNumber = 0;
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
          createSegmentedInput(slotDifficultyNumber, "groupID" + turnNumber);
          document.getElementById( "groupID" + turnNumber ).scrollIntoView();
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

});