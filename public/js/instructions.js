(function(){
  let pages, sessionId;

  function getPageJSONData(){
    fetch("/js/pages.json", {
      method: "GET"
    }).then(function(response){
      console.log('successful get JSON File');
      return response.json();
    }).then(function(data) {
      pages = data;
       console.log(data);
       initialize();
    })
    .catch(err => {
      throw err;
    });
  }

  // Randomizing order of pages
  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  function sendOrder(values){
    console.log('sendOrder', JSON.stringify(values));
    var valuesString = JSON.stringify(values);
    var postURL = '/send-order/?id=' + sessionId + '&order=' + valuesString;
    fetch(postURL, {
      method: "PUT"
    }).then(function(response){
      console.log('successful send order completed');
      //return response.json();
    }).catch(err => {
      throw err;
    });
  }

  function setupPageOrder(){
    console.log('setupPageOrder');
    var arrayOfPageKeys = [];
    for (key in pages){
      arrayOfPageKeys.push(key);
    }

    var newArrayOfPageKeys = shuffleArray(arrayOfPageKeys);
    var pageOrder = [];
    var numbersOnly = [];
    for(var i = 0; i <=7; i++){
      var urlString = "choice-problem-" + (i+1);
      pageOrder[i] = {
        url: urlString,
        problem: newArrayOfPageKeys[i]
      }
      numbersOnly[i] = newArrayOfPageKeys[i][newArrayOfPageKeys[i].length -1];
    }
    console.log('New page order created, numbersOnly:', numbersOnly);
    sendOrder(numbersOnly);
    localStorage.setItem('pageOrder', JSON.stringify(pageOrder));
    var $nextProblem = document.getElementById('next-problem');
    // $nextProblem.href = "choice-problem-1";
  }

  function createNewSession(){
      fetch("/create-session/", {
        method: "GET"
      }).then(function(response){
        return response.json();
      }).then(function(data) {
        const newSessionId = data._id;
        localStorage.setItem('sessionId', newSessionId);
        sessionId = newSessionId;
        console.log('New session create id: ', newSessionId);
        setupPageOrder();

        // Some clean up with new logic check. Reload Google Form with new session ID
        var googleFormSrc =
          "https://docs.google.com/forms/d/e/1FAIpQLSeCtuwfD04lKMH6IJlYEbXMLPa6r9vVUCkGS6zQ3EuCEyFAHw/viewform?usp=pp_url&entry.1588747463=" + 
            localStorage.getItem('sessionId') +
            "&embedded=true";
        document.getElementById('google-form').src = googleFormSrc;
      })
      .catch(err => {
        throw err;
      });
  }

  function checkSessionExists(){
    console.log('get session:', sessionId);
    var getURL = '/get-session/?id=' + sessionId;
    fetch(getURL, {
      method: "GET"
    }).then(function(response){
      console.log('get session resp', response);
      if(response.status === 401){
        createNewSession();
      } else {
        setupPageOrder();
        return response.json();
      }
    }).catch(err => {
      throw err;
    });
  }

  function initialize(){
    if ( localStorage.getItem('sessionId') === null ) {
      console.log('sessionId does not exist yet');
      createNewSession();
    } else {
      console.log('sessionId already exists:', localStorage.getItem('sessionId'));
      sessionId = localStorage.getItem('sessionId');
      checkSessionExists();
    }
  }
  // Execute code
  getPageJSONData();

})();
