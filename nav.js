// Define the `slide` function
const slide = () => {

  // Get the first element with the class 'nav-menu' from the DOM
  const lines = document.querySelector(".nav-menu");

  // Get the first element with the class 'nav-list' from the DOM
  const list = document.querySelector(".nav-list");

  // Get all 'li' elements that are descendants of an element with the class 'nav-list'
  const links = document.querySelectorAll(".nav-list li");

  // Add a 'click' event listener to the 'lines' element
  lines.addEventListener('click', ()=> {

    // Toggle (add/remove) the 'nav-active' class on the 'list' element
    list.classList.toggle("nav-active");

    // Iterate through each link in the 'links' NodeList
    links.forEach((link, index)=> {

      // If the link currently has an animation, remove it
      if(link.style.animation) {
        link.style.animation = "";
      } else {
        // Otherwise, apply the 'linkFade' animation to the link
        // The delay in animation is calculated based on its index
        // NOTE: This line has a mistake. It should use template literals (`) instead of single quotes (')
        link.style.animation = `linkFade 0.5s ease forwards ${index / 7 + 0.5}s`;
      }
    });

    // Toggle (add/remove) the 'toggle' class on the 'lines' element
    lines.classList.toggle("toggle");
  });

}

// Call the `slide` function
slide();
