(function(){

  function init(){
    config = getCurrentChoiceProblem();
    bindEvents();
  }

  var config,
      currentDecision = null,
      animating = false,
      sessionId,
      pageOrder,
      pages;
  // all things DOM
  var $optionA = document.getElementById('option-a'),
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
      arrayOfPageKeys = shuffleArray(arrayOfPageKeys);
      console.log(arrayOfPageKeys);
      localStorage.setItem('pageOrder', arrayOfPageKeys);
      pageOrder =  arrayOfPageKeys;
    } else {
      console.log('pageOrder is already set');
      pageOrder = localStorage.getItem('pageOrder');
      pageOrder = JSON.parse(pageOrder);
      // console.log(pageOrder);
    }
  }

  function updateNextProblem(failed){
    if (!failed){
      pageOrder.splice(0,1);
    }
    $nextProblem.href = pageOrder[0];
    localStorage.setItem('pageOrder', JSON.stringify(pageOrder));

    if(pageOrder.length == 0){
      // $nextProblem.href = "/results/";
      $nextProblem.innerHTML = "All Choice Problems Completed";
      nextProblem.classList.add('disabled');
    } else {
      $nextProblem.classList.remove('disabled');
    }


  }

  function getCurrentChoiceProblem(){
    var path = window.location.pathname;
    path = path.replace('/','')
    console.log("path:",path);
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

  function toggleOptionActiveClass ( option, final ) {
    if(option === 'a' && !final){
      $optionA.classList.add('active');
      $optionB.classList.remove('active');
      $optionA.innerHTML = "<h3>" + currentDecision + "</h3>";
      setTimeout(function(){
        $optionA.innerHTML = "<h3>Option A</h3>";
        $optionA.classList.remove('active');
      }, 2000);
    } else if( option === 'b' && !final){
      $optionA.classList.remove('active');
      $optionB.classList.add('active');
      $optionB.innerHTML = "<h3>" + currentDecision + "</h3>";
      setTimeout(function(){
        $optionB.innerHTML = "<h3>Option B</h3>";
        $optionB.classList.remove('active');
      }, 2000);
    }

    if(option === 'a' && final){
      $optionAFinal.classList.add('active');
      $optionBFinal.classList.remove('active');
      $optionAFinal.innerHTML = "<h3>" + currentDecision + "</h3>";
    } else if( option === 'b' && final){
      $optionAFinal.classList.remove('active');
      $optionBFinal.classList.add('active');
      $optionBFinal.innerHTML = "<h3>" + currentDecision + "</h3>";
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
      if (animating) { return; }
      console.log('option A clicked');
      currentDecision = config.option_a_value;
      toggleOptionActiveClass('a');
      sendSampleValue('a',config.option_a_value);
    });

    $optionB.addEventListener('click', function(){
      if (animating) { return; }
      console.log('option B clicked');
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
  setupLocalStorage();

})();
