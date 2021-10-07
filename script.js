const navbar = document.querySelector(".navbar");
const navbarOffsetTop = navbar.offsetTop;
const sections = document.querySelectorAll("section");
const navbarLinks = document.querySelectorAll(".navbar__link");
const progressBars = document.querySelectorAll(".progress-bars__percent-bar");
const progressTextBars = document.querySelectorAll(".progress-bars__text");
const sectionTwo = 2;
const progressBarContainers = document.querySelectorAll(
  ".progress-bars__progress-bar"
);

const progressSubjects = [
  "HTML",
  "CSS",
  "JS",
  "NodeJS",
  "SASS",
  "PUG",
  "SQL",
  "GIT",
];

const progressPercents = [90, 80, 75, 65, 80, 80, 80, 75];

/*console.log(window.pageYOffset, navbarOffsetTop);*/

window.addEventListener("scroll", () => {
  if (window.pageYOffset >= navbarOffsetTop) {
    /*console.log(window.pageYOffset, navbarOffsetTop);*/
    navbar.classList.add("sticky");
  } else {
    navbar.classList.remove("sticky");
  }

  sections.forEach((section, i) => {
    if (window.pageYOffset >= section.offsetTop - 10) {
      navbarLinks.forEach((link) => {
        link.classList.remove("change");
      });
      navbarLinks[i].classList.add("change");
    }
  });

  progressBars.forEach((item, index) => {
    item.style.width = `${progressPercents[index]}%`;
    progressTextBars[
      index
    ].innerHTML = `${progressSubjects[index]} ${progressPercents[index]}%`;
  });
});
