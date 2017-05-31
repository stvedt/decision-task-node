(function(){

  function init(){
    setupLocalStorage();
  }

  var config,
      currentDecision = null,
      isActive = false,
      sessionId,
      pageOrder,
      pages;
  // all things DOM
  var $pageTitle = document.getElementById('page-title'),
      $optionA = document.getElementById('option-a'),
      $optionB = document.getElementById('option-b'),
      $optionAFinal = document.getElementById('option-a-final'),
      $optionBFinal = document.getElementById('option-b-final'),
      $totalAmount = document.getElementById('total-amount'),
      $nextProblem = document.getElementById('next-problem'),
      $finalChoices = document.getElementById('final-choices');
      // $finalDecision = document.getElementById('final-decision').getElementsByClassName('value')[0];


  function getPageJSONData(){
    fetch("/js/pages.json", {
      method: "GET"
    }).then(function(response){
      console.log('successful get JSON File');
      return response.json();
    }).then(function(data) {
      pages = data;
       console.log(data)
       init();
    })
    .catch(err => {
        //do something smarter here

        throw err;
    });
  }

  function createNewSession(){
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
  }

  function getTotalAmount(){
    fetch("/get-total/?id="+sessionId, {
      method: "GET"
    }).then(function(response){
      console.log('successful get total');
      return response.json();
    }).then(function(data) {
      //  console.log(data);
      $totalAmount.innerHTML = data.toFixed(2);
       console.log('total amount set')
    })
    .catch(err => {
        //do something smarter here

        throw err;
    });
  }

  function getOptionBValue(array){
      var optionBvalues = array;
      var randomNumber = Math.floor(Math.random() * 10);
      return optionBvalues[randomNumber];

  }

  function shuffleArray(array) {
      for (var i = array.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var temp = array[i];
          array[i] = array[j];
          array[j] = temp;
      }
      return array;
  }

  //Set up localstorage session
  //create session if one does not exist
  function setupLocalStorage(){
    if ( localStorage.getItem('sessionId') === null ) {
      createNewSession();
    } else {
      console.log('sessionId already exists:', localStorage.getItem('sessionId'));
      sessionId = localStorage.getItem('sessionId');
      getTotalAmount();
    }

    // Randomizing order of pages
    if ( localStorage.getItem('pageOrder') === null ) {
      var arrayOfPageKeys = [];
      for (key in pages){
        arrayOfPageKeys.push(key);
      }
      console.log('first:',arrayOfPageKeys);
      var newArrayOfPageKeys = shuffleArray(arrayOfPageKeys);
      pageOrder = [];
      for(var i = 0; i <=7; i++){
        var urlString = "choice-problem-" + (i+1);
        pageOrder[i] = {
          url: urlString,
          problem: newArrayOfPageKeys[i]
        }
      }
    } else {
      console.log('pageOrder is already set');
      pageOrder = localStorage.getItem('pageOrder');
      pageOrder = JSON.parse(pageOrder);
      config = getCurrentChoiceProblem();
      // console.log(pageOrder);
    }
  }

  function updateNextProblem(failed){
    if (!failed){
      pageOrder.splice(0,1);
    }
    $nextProblem.href = pageOrder[0].url;
    localStorage.setItem('pageOrder', JSON.stringify(pageOrder));

    if(pageOrder.length == 1){
      // $nextProblem.href = "/results/";
      console.log('last choice problem');
      $nextProblem.innerHTML = "All Choice Problems Completed";
      $nextProblem.classList.add('disabled');
      window.confirm('Thank you for completing this exercise.');
    } else {
      $nextProblem.classList.remove('disabled');
    }

  }

  function getCurrentChoiceProblem(){
    var path = window.location.pathname;
    path = path.replace('/','')
    $pageTitle.innerHTML = "Choice Problem " + path.substr(path.length - 1);
    console.log("path:",path);
    for(var i = 0; i <pageOrder.length; i++){
      if( pageOrder[i].url == path){
        console.log("working on: " + pageOrder[i].problem);
        bindEvents();
        return pages[pageOrder[i].problem];
      }
    }
  }

  // function animateSample(){
  //   $finalDecision.classList.add('animate');
  //   animating = true;
  //   setTimeout(function(){
  //     $finalDecision.classList.remove('animate');
  //     animating = false;
  //   }, 1500);
  // }

  function toggleOptionActiveClass ( option, final ) {
    if(option === 'a' && !final){
      isActive = true;
      $optionA.classList.add('active');
      $optionB.classList.remove('active');
      $optionA.innerHTML = currentDecision.toFixed(2);
      setTimeout(function(){
        $optionA.innerHTML = "Option A";
        $optionA.classList.remove('active');
        isActive = false;
      }, 1500);
    } else if( option === 'b' && !final){
      isActive = true;
      $optionA.classList.remove('active');
      $optionB.classList.add('active');
      $optionB.innerHTML = currentDecision.toFixed(2);
      setTimeout(function(){
        $optionB.innerHTML = "Option B";
        $optionB.classList.remove('active');
        isActive = false;
      }, 1500);
    }

    if(option === 'a' && final){
      $optionAFinal.classList.add('active');
      $optionBFinal.classList.remove('active');
      $optionAFinal.innerHTML = currentDecision.toFixed(2);
    } else if( option === 'b' && final){
      $optionAFinal.classList.remove('active');
      $optionBFinal.classList.add('active');
      $optionBFinal.innerHTML = currentDecision.toFixed(2);
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
      //  console.log("Set button state");
       console.log(data);
       if (data.status == 401){
         updateNextProblem(true);
       } else {
         $totalAmount.innerHTML = data.results.total_amount.toFixed(2);
         updateNextProblem();
       }
    })
    .catch(err => {
        //do something smarter here
        console.log(err)
        throw err;
    });
  }

  function bindEvents(){

    $optionA.addEventListener('click', function(){
      if (isActive) { console.log('already active'); return; }
      console.log('option A clicked');
      currentDecision = config.option_a_value;
      toggleOptionActiveClass('a');
      sendSampleValue('a',config.option_a_value);
    });

    $optionB.addEventListener('click', function(){
      if (isActive) { console.log('already active'); return; }
      console.log('option B clicked');
      console.log(config);
      var optionBValue = getOptionBValue(config.option_b_value);
      currentDecision = optionBValue;
      toggleOptionActiveClass('b');
      sendSampleValue('b',optionBValue)
    });

    $optionAFinal.addEventListener('click', function(){
      if (animating) { return; }
      console.log('option A Final clicked');
      currentDecision = config.option_a_value;
      toggleOptionActiveClass('a', true);
      sendFinalDecisionValue(currentDecision);
      $finalChoices.classList.add('disabled');
    });

    $optionBFinal.addEventListener('click', function(){
      if (animating) { return; }
      console.log('option B Final clicked');
      var optionBValue = getOptionBValue(config.option_b_value);
      currentDecision = optionBValue;
      toggleOptionActiveClass('b',true);
      sendFinalDecisionValue(currentDecision);
      $finalChoices.classList.add('disabled');
    });

  }

  getPageJSONData();

})();
