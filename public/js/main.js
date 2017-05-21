(function(){
  // "choice-problem-1" will be replaced with hashed page name
  var pages = {
    "choiceProblem1": {
      problemNumber: 1,
      option_a_value: 0.25
    },
    "choiceProblem2": {
      problemNumber: 2
    },
  }

  function randomWithProbability() {
    var optionBvalues = [0,0,0,0,0,0,1,1,1,1];
    var randomNumber = Math.floor(Math.random() * 10);
    return optionBvalues[randomNumber];
  }

  //Set up localstorage session
  //create session if one does not exist
  if (localStorage.getItem("infiniteScrollEnabled") === null && localStorage.getItem('sessionId') === null ) {
  	// Yippee! We can use localStorage awesomeness
    fetch("/create-session/", {
      method: "GET"
    }).then(function(response){
      console.log('successful sessions');
      return response.json();
    }).then(function(data) {
       console.log(data);
       localStorage.setItem('sessionId',data._id);
       console.log('localStorage sessionId set')
    })
    .catch(err => {
        //do something smarter here

        throw err;
    });

    //(setItem, getItem, removeItem, key, length)
  }
  else {
  	// Too bad, no localStorage for us
    alert('Please update or use a newer version broswer.');
  }

  var config = pages.choiceProblem1,
      currentDecision = null,
      animating = false;
  // all things DOM
  var $optionA = document.getElementById('option-a'),
      $optionB = document.getElementById('option-b'),
      $confirmDecision = document.getElementById('confirm-decision'),
      $finalDecision = document.getElementById('final-decision').getElementsByClassName('value')[0];

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

  function bindEvents(){

    $optionA.addEventListener('click', function(){
      if (animating) { return; }
      console.log('option A clicked');

      toggleOptionActiveClass('a');
      animateSample();

      $finalDecision.innerHTML = config.option_a_value;
      currentDecision = config.option_a_value;
      //send to option a end point for choice problem x
    });

    $optionB.addEventListener('click', function(){
      if (animating) { return; }
      console.log('option B clicked');

      toggleOptionActiveClass('b');
      animateSample();

      var optionBValue = randomWithProbability();
      $finalDecision.innerHTML = optionBValue;
      currentDecision = optionBValue;
      //send to option a end point for choice problem x
    });

    $confirmDecision.addEventListener('click', function(){
      if( currentDecision !== null){
        console.log('Confirm Decision clicked');
        $finalDecision.innerHTML = currentDecision + '<br>Submitted';
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
