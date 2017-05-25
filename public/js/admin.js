(function(){


  // all things DOM
  var $newSession = document.getElementById('new-session');

  function createNewSession(){
      fetch("/create-session/", {
        method: "GET"
      }).then(function(response){
        console.log('successfully created new session');
        return response.json();
      }).then(function(data) {
        //  console.log(data);
        localStorage.setItem('sessionId',data._id);
        localStorage.removeItem('pageOrder');

         console.log('localStorage sessionId set: ', data._id)
         alert('New session created with ID: ' + data._id);
      })
      .catch(err => {
          //do something smarter here

          throw err;
      });
  }

  function bindEvents(){
    $newSession.addEventListener('click', function(e){
      e.preventDefault();
        console.log('Create New Session clicked');
        createNewSession();
    });
  }

  bindEvents();

})()
