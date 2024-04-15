// Simulate a delay of 2 seconds (for mimicring the loading of elements when goes online)
setTimeout(function() {
    document.getElementById("preloader").style.display = 'none';  //code to execute after the delay(basically hiding the loader after 2s)
}, 2000);

//JS for preloder hiding on load of all elements. 
//(the orignal functionality when we host the website on remote server instead of local server)
// window.onload = function()
// {
// document.getElementById("preloader").style.display='none';
// };

  