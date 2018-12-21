window.onload = function () {

  //postmessage
  function receiveMessage(event){
    console.log('task completed from iframe yay!');
    // Do we trust the sender of this message? Check origin
    //if (event.origin !== "http://example.com")
    //  return;

    // event.source is popup/iframe
    // event.data is "the text of the actual message"
    document.querySelector('#submitButton').style.display = 'block';
  }
  window.addEventListener("message", receiveMessage, false);

};//end window.onload