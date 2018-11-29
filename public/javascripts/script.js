function myFunction() {
  var x = document.getElementById("nav-menu");
  if (x.className === "topnav") {
      x.className += " responsive";
  } else {
      x.className = "topnav";
  }
}

document.addEventListener('DOMContentLoaded', () => {

  
  console.log('IronGenerator JS imported successfully!');

}, false);
