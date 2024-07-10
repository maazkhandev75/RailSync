
// Simulate a delay of 2 seconds (for mimicring the loading of elements when goes online)  //code to execute after the delay(basically hiding the loader after 2s)
setTimeout(function() {
    document.getElementById("preloader").style.display = 'none';  // hide prelaoder 
    document.getElementById("content").style.opacity = '1'; // Fade in content
}, 2000);

//JS for preloder hiding on load of all elements. 
//(the orignal functionality when we host the website on remote server instead of local server)
// window.onload = function()
// {
// document.getElementById("preloader").style.display='none';
// document.getElementById("content").style.opacity = '1'; // Fade in content

// };
