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

  function getPageJSONData(){
    fetch("/js/pages.json", {
      method: "GET"
    }).then(function(response){
      return response.json();
    }).then(function(data) {
      pages = data;
      console.log('successful get JSON File: ',data)
      init();
    })
    .catch(err => {
        throw err;
    });
  }

  function getTotalAmount(){
    fetch("/get-total/?id="+sessionId, {
      method: "GET"
    }).then(function(response){
      return response.json();
    }).then(function(data) {
      $totalAmount.innerHTML = data.toFixed(2);
       console.log('total amount set')
    })
    .catch(err => {
        throw err;
    });
  }

  function getOptionBValue(array){
      var optionBvalues = array;
      var randomNumber = Math.floor(Math.random() * 10);
      return optionBvalues[randomNumber];

  }

  //Set up localstorage session
  function setupLocalStorage(){
    if ( localStorage.getItem('sessionId') === null
      || localStorage.getItem('pageOrder') === null) {
      window.confirm("Please see instructions before beginning. Redirecting now.");
      window.location.href = window.location.origin;
    } else {
      console.log('sessionId already exists:', localStorage.getItem('sessionId'));
      sessionId = localStorage.getItem('sessionId');
      getTotalAmount();
    }

    // Randomizing order of pages
    if ( localStorage.getItem('pageOrder') !== null ) {
      console.log('pageOrder is already set');
      pageOrder = localStorage.getItem('pageOrder');
      pageOrder = JSON.parse(pageOrder);
      config = getCurrentChoiceProblem();
    }
  }

  function updateNextProblem(failed){
    console.log('updateNextProblem');
    if (!failed){
      pageOrder.splice(0,1);
    }
    console.log("problems remaining: ", pageOrder.length);
    if(pageOrder.length == 0){
      // $nextProblem.href = "/results/";
      console.log('Now on last choice problem');
      $nextProblem.innerHTML = "All Choice Problems Completed";
      $nextProblem.classList.remove('btn-success');
      $nextProblem.classList.add('btn-warning');
      $nextProblem.href = "/results";
      $nextProblem.classList.remove('disabled');
      markCompleted();

      localStorage.removeItem('pageOrder');
      localStorage.removeItem('sessionId');
      window.confirm('Thank you for completing this exercise.');
    } else {
      $nextProblem.href = pageOrder[0].url;
      $nextProblem.classList.remove('disabled');

      localStorage.setItem('pageOrder', JSON.stringify(pageOrder));
    }

  }

  function getCurrentChoiceProblem(){
    var path = window.location.pathname;
    path = path.replace('/','')
    $pageTitle.innerHTML = "Choice Problem " + path.substr(path.length - 1);

    for(var i = 0; i <pageOrder.length; i++){
      if( pageOrder[i].url == path){
        console.log("working on: " + pageOrder[i].problem);
        bindEvents();
        return pages[pageOrder[i].problem];
      }
    }
  }

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
        throw err;
    });
  }

  function markCompleted(){
    var postURL = '/mark-completed/?id=' + sessionId;
    fetch(postURL, {
      method: "PUT"
    }).then(function(response){
      console.log('successful mark session completed');
      return response.json();
    }).catch(err => {
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
      return response.json();
    }).then(function(data) {
       console.log('successful final decision submit: ',data);
       if (data.status == 401){
         updateNextProblem();
       } else {
         $totalAmount.innerHTML = data.results.total_amount.toFixed(2);
         updateNextProblem();
       }
    })
    .catch(err => {
        updateNextProblem(true);
        console.log(err)
        throw err;
    });
  }

  function bindEvents(){

    $optionA.addEventListener('click', function(){
      if (isActive) { return; }
      console.log('option A clicked');
      currentDecision = config.option_a_value;
      toggleOptionActiveClass('a');
      sendSampleValue('a',config.option_a_value);
    });

    $optionB.addEventListener('click', function(){
      if (isActive) { return; }
      console.log('option B clicked');
      var optionBValue = getOptionBValue(config.option_b_value);
      currentDecision = optionBValue;
      toggleOptionActiveClass('b');
      sendSampleValue('b',optionBValue)
    });

    $optionAFinal.addEventListener('click', function(){
      if (isActive) { return; }
      console.log('option A Final clicked');
      currentDecision = config.option_a_value;
      toggleOptionActiveClass('a', true);
      sendFinalDecisionValue(currentDecision);
      $finalChoices.classList.add('disabled');
    });

    $optionBFinal.addEventListener('click', function(){
      if (isActive) { return; }
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
