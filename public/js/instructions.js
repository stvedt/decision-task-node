(function(){
  // Randomizing order of pages
  var pages = {
    "choice-problem-1": {
      problem: "choice_problem_1",
      option_a_value: 0.25,
      option_b_value: function() {
        var optionBvalues = [0,0,0,0,0,0,1,1,1,1];
        var randomNumber = Math.floor(Math.random() * 10);
        return optionBvalues[randomNumber];
      }
    },
    "choice-problem-2": {
      problem: "choice_problem_2",
      option_a_value: 0.15,
      option_b_value: function() {
        var optionBvalues = [0,0,0,0,0.5,0.5,0.5,0.5,0.5,0.5];
        var randomNumber = Math.floor(Math.random() * 10);
        return optionBvalues[randomNumber];
      }
    },
    "choice-problem-3": {
      problem: "choice_problem_3",
      option_a_value: 0.2,
      option_b_value: function() {
        var optionBvalues = [0,0,0,0,0,0,0,0,1.5,1.5];
        var randomNumber = Math.floor(Math.random() * 10);
        return optionBvalues[randomNumber];
      }
    },
    "choice-problem-4": {
      problem: "choice_problem_4",
      option_a_value: 0.1,
      option_b_value: function() {
        var optionBvalues = [0,0,0,0,0,0,0,0,0,2];
        var randomNumber = Math.floor(Math.random() * 10);
        return optionBvalues[randomNumber];
      }
    },
    "choice-problem-5": {
      problem: "choice_problem_5",
      option_a_value: -0.25,
      option_b_value: function() {
        var optionBvalues = [0,0,0,0,0,0,-1,-1,-1,-1];
        var randomNumber = Math.floor(Math.random() * 10);
        return optionBvalues[randomNumber];
      }
    },
    "choice-problem-6": {
      problem: "choice_problem_6",
      option_a_value: -0.15,
      option_b_value: function() {
        var optionBvalues = [0,0,0,0,0,0,-1,-1,-1,-1];
        var randomNumber = Math.floor(Math.random() * 10);
        return optionBvalues[randomNumber];
      }
    },
    "choice-problem-7": {
      problem: "choice_problem_7",
      option_a_value: -0.2,
      option_b_value: function() {
        var optionBvalues = [0,0,0,0,0,0,0,0,-1.5,-1.5];
        var randomNumber = Math.floor(Math.random() * 10);
        return optionBvalues[randomNumber];
      }
    },
    "choice-problem-8": {
      problem: "choice_problem_8",
      option_a_value: -0.1,
      option_b_value: function() {
        var optionBvalues = [0,0,0,0,0,0,0,0,0,-2];
        var randomNumber = Math.floor(Math.random() * 10);
        return optionBvalues[randomNumber];
      }
    },
  };

  function shuffleArray(array) {
      for (var i = array.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var temp = array[i];
          array[i] = array[j];
          array[j] = temp;
      }
      return array;
  }

  if ( localStorage.getItem('pageOrder') === null ) {
    var arrayOfPageKeys = [];
    for (key in pages){
      arrayOfPageKeys.push(key);
    }
    console.log('first:',arrayOfPageKeys);
    var newArrayOfPageKeys = shuffleArray(arrayOfPageKeys);
    console.log('new:', newArrayOfPageKeys);
    localStorage.setItem('pageOrder', JSON.stringify(newArrayOfPageKeys));
    pageOrder =  newArrayOfPageKeys;
  } else {
    console.log('pageOrder is already set');
    pageOrder = JSON.parse(localStorage.getItem('pageOrder'));
  }

  var $nextProblem = document.getElementById('next-problem');
  $nextProblem.href = pageOrder[0];
})();
