(function(){
  // "choice-problem-1" will be replaced with hashed page name
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

  var sessionId;

  // function randomWithProbability() {
  //   var optionBvalues = [0,0,0,0,0,0,1,1,1,1];
  //   var randomNumber = Math.floor(Math.random() * 10);
  //   return optionBvalues[randomNumber];
  // }

  //Set up localstorage session
  //create session if one does not exist
  if ( localStorage.getItem('sessionId') === null ) {
    fetch("/create-session/", {
      method: "GET"
    }).then(function(response){
      console.log('successful sessions');
      return response.json();
    }).then(function(data) {
      //  console.log(data);
       localStorage.setItem('sessionId',data._id);
       sessionId = data._id;
       console.log('localStorage sessionId set')
    })
    .catch(err => {
        //do something smarter here

        throw err;
    });
  } else {
    console.log('sessionId already exists:', localStorage.getItem('sessionId'));
    sessionId = localStorage.getItem('sessionId');

    fetch("/get-total/?id="+sessionId, {
      method: "GET"
    }).then(function(response){
      console.log('successful get total');
      return response.json();
    }).then(function(data) {
      //  console.log(data);
      $totalAmount.innerHTML = data;
       console.log('total amount set')
    })
    .catch(err => {
        //do something smarter here

        throw err;
    });

  }

  var config = getCurrentChoiceProblem(),
      currentDecision = null,
      animating = false;
  // all things DOM
  var $optionA = document.getElementById('option-a'),
      $optionB = document.getElementById('option-b'),
      $totalAmount = document.getElementById('total-amount'),
      $confirmDecision = document.getElementById('confirm-decision'),
      $finalDecision = document.getElementById('final-decision').getElementsByClassName('value')[0];

  function getCurrentChoiceProblem(){
    var path = window.location.pathname;
    path = path.replace('/','')
    console.log(path);
    return pages[path];
  }

  function animateSample(){
    $finalDecision.classList.add('animate');
    animating = true;
    setTimeout(function(){
      $finalDecision.classList.remove('animate');
      animating = false;
    }, 1000);
  }

  function toggleOptionActiveClass ( option ) {
    if(option === 'a'){
      $optionA.classList.add('active');
      $optionB.classList.remove('active');
    } else if( option === 'b'){
      $optionA.classList.remove('active');
      $optionB.classList.add('active');
    }

  }

  function sendSampleValue(option, value){
    var postURL =  '/send-option/?id=' + sessionId +
                           '&problem=' + config.problem +
                            '&option=' + option +
                             '&value=' + value;
    fetch(postURL, {
      method: "PUT"
    }).then(function(response){
      console.log('successful sample put');
      return response.json();
    }).catch(err => {
        //do something smarter here

        throw err;
    });
  }

  function sendFinalDecisionValue(value){
    var postURL =  '/send-final-decision/?id=' + sessionId +
                                   '&problem=' + config.problem +
                                     '&value=' + value;
    fetch(postURL, {
      method: "PUT"
    }).then(function(response){
      console.log('successful final decision submit');
      return response.json();
    }).then(function(data) {
       console.log("Set button state");
       console.log(data);
       $totalAmount.innerHTML = data.results.total_amount;
       $confirmDecision.classList.add('disabled');
    })
    .catch(err => {
        //do something smarter here

        throw err;
    });
  }

  function bindEvents(){

    $optionA.addEventListener('click', function(){
      if (animating) { return; }
      console.log('option A clicked');

      toggleOptionActiveClass('a');
      animateSample();

      $finalDecision.innerHTML = config.option_a_value;
      currentDecision = config.option_a_value;

      sendSampleValue('a',config.option_a_value);

      //send to option a end point for choice problem x
    });

    $optionB.addEventListener('click', function(){
      if (animating) { return; }
      console.log('option B clicked');

      toggleOptionActiveClass('b');
      animateSample();

      var optionBValue = config.option_b_value();
      $finalDecision.innerHTML = optionBValue;
      currentDecision = optionBValue;
      //send to option a end point for choice problem x
      sendSampleValue('b',optionBValue)
    });

    $confirmDecision.addEventListener('click', function(e){
      e.preventDefault();
      if( currentDecision !== null){
        console.log('Confirm Decision clicked');
        sendFinalDecisionValue(currentDecision)
        //send to option a end point for choice problem x
      }

    });
  }

  bindEvents();

})()

//results should be tracked per person
//write to database a user
// var user = {
//   id: "asdkaoekas",
//   results: {
//     "choice-problem-1": {
//       samples : [
//         {option:'a', value: 1},
//         {option:'b', value: 0.25},
//         {option:'b', value: 0.25},
//         {option:'b', value: 0.25},
//         {option:'a', value: 0.25}
//       ],
//       final_decision: 1
//     },
//
//     "choice-problem-3": [
//       {option:'a', final_value: 1},
//       {option:'b', final_value: 0.25},
//       {option:'b', final_value: 0.25},
//       {option:'b', final_value: 0.25},
//       {option:'a', final_value: 0.25}
//
//     ]
//   }
// }


// var numberOfSamples = results.length;
