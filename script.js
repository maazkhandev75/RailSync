document.addEventListener('DOMContentLoaded', function() {
    // Get the theme toggle switch element
    const themeToggle = document.getElementById('theme-toggle');
    const logoImage = document.querySelector('.logo');

    // Add event listener to the theme toggle switch
    themeToggle.addEventListener('change', function() {
        // Check if the switch is checked
        if (this.checked) {
            // If checked, set the theme to dark mode
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
            // Change the logo image source for dark mode
            logoImage.src = 'darkpic.png'; // Replace with your dark mode image path
        } else {
            // If unchecked, set the theme to light mode
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
            // Change the logo image source for light mode
            logoImage.src = 'lightpic.png'; // Replace with your light mode image path
        }
    });

    // Set initial theme based on the toggle state
    if (themeToggle.checked) {
        document.body.classList.add('dark-mode');
        logoImage.src = 'darkpic.png'; // Replace with your dark mode image path
    } else {
        document.body.classList.add('light-mode');
        logoImage.src = 'lightpic.png'; // Replace with your light mode image path
    }
});
