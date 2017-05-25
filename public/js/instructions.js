(function(){
  // Randomizing order of pages
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
  }
})();
