(function(){
  function getPageJSONData(){
    fetch("/js/pages.json", {
      method: "GET"
    }).then(function(response){
      console.log('successful get JSON File');
      return response.json();
    }).then(function(data) {
      pages = data;
       console.log(data);
       setupLocalStorage();
    })
    .catch(err => {
        //do something smarter here

        throw err;
    });
  }
  getPageJSONData();

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

  function setupLocalStorage(){

    if ( localStorage.getItem('sessionId') === null ) {
      console.log('sessionId does not exist yet');
      createNewSession();
    } else {
      console.log('sessionId already exists:', localStorage.getItem('sessionId'));
      sessionId = localStorage.getItem('sessionId');
    }

    if ( localStorage.getItem('pageOrder') === null ) {
      console.log('pageOrder not set');
      var arrayOfPageKeys = [];
      for (key in pages){
        arrayOfPageKeys.push(key);
      }

      var newArrayOfPageKeys = shuffleArray(arrayOfPageKeys);
      var pageOrder = [];
      for(var i = 0; i <=7; i++){
        var urlString = "choice-problem-" + (i+1);
        pageOrder[i] = {
          url: urlString,
          problem: newArrayOfPageKeys[i]
        }
      }
      console.log("New page order created: ",pageOrder)
      localStorage.setItem('pageOrder', JSON.stringify(pageOrder));
    } else {
      console.log('pageOrder is already set');
      pageOrder = JSON.parse(localStorage.getItem('pageOrder'));
    }
    var $nextProblem = document.getElementById('next-problem');
    $nextProblem.href = pageOrder[0].url;
  }

  function createNewSession(){
      fetch("/create-session/", {
        method: "GET"
      }).then(function(response){

        return response.json();
      }).then(function(data) {
        localStorage.setItem('sessionId',data._id);
        console.log('New session create id: ', data._id)
      })
      .catch(err => {
        //do something smarter here

        throw err;
      });
  }
})();