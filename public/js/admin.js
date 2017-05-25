(function(){


  // all things DOM
  var $newSession = document.getElementById('new-session'),
      $sessionTitles = document.querySelectorAll('.session-title'),
      $sessionContents = document.querySelectorAll('.session-content');


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
         setTimeout(function(){ window.location.reload(); },1000)
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

    for (var i = 0; i < $sessionTitles.length; i++) {
      $sessionTitles[i].addEventListener("click", function(e){
        var $parent = e.target.parentNode;

        if($parent.classList[0] == "session-title") {
          $parent = $parent.parentNode;
        }
        $parent.classList.toggle('show');
      }, false);
    }
  }

  bindEvents();

})()
