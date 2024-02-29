const skillsSection = document.querySelector(".about-skills");

import { skills } from "./data.js";

(function createSkills() {
    skills.forEach((skill) => {
        const skillDiv = document.createElement("div");
        skillDiv.innerText = skill;
        skillDiv.classList.add("skill");
        skillsSection.append(skillDiv);
    });
})();

(function createButtonsForProjectShowcase() {
    const buttonRight = document.querySelector(".arrow.right");
    const buttonLeft = document.querySelector(".arrow.left");

    buttonRight.addEventListener("click", function () {
        const container = document.querySelector(".container");
        container.scrollLeft += 400;
    });
    buttonLeft.addEventListener("click", function () {
        document.querySelector(".container").scrollLeft -= 400;
    });
})();

// const scrollDown = document.querySelector(".scroll-down");
// scrollDown.addEventListener("click", () => {
//     window.scroll(0, 1000);
// });

/**
 *              <div class="site10">
                    <a
                        href="https://ronakraj00.github.io/meme/"
                        target="_blank"
                        rel="noopener noreferrer"
                        ><img src="assets/images/giphy_gif.png" alt="" />
                        <p>GIPHY GIF <img class="redirect" src="./assets/images/redirect.png"></p>
                    </a>
                    <div class="skill-used">
                    </div>
                </div>
 */

const fetchSitesData = async () => {
    const fetchedData = await fetch("https://portfolio-api-1.adaptable.app/");
    const data = await fetchedData.json();
    return data.sites;
};

fetchSitesData();

// {
//     description: "GIPHY GIF";
//     id: 1;
//     img: "assets/images/giphy_gif.png";
//     name: "GIPHY GIF";
//     url: "https://ronakraj00.github.io/meme/";
// }

const apiSite = "https://portfolio-api-1.adaptable.app/";

const createSite = ({ id, name, img, url }) => {
    const wrapper = document.createElement("div");
    const linkTag = document.createElement("a");
    const imgTag = document.createElement("img");
    const redirectImg = document.createElement("img");
    const nameTag = document.createElement("p");
    const skillsUsed = document.createElement("div");
    skillsUsed.classList.add("skill-used");
    imgTag.src = apiSite + img;
    nameTag.innerText = name;
    redirectImg.classList.add("redirect");
    redirectImg.src = "./assets/images/redirect.png";
    nameTag.append(redirectImg);
    linkTag.href = url;
    linkTag.target = "_blank";
    linkTag.rel = "noopener noreferrer";
    linkTag.append(imgTag, nameTag);
    wrapper.append(linkTag, skillsUsed);
    return wrapper;
};

(async function createAllSites() {
    const sites = await fetchSitesData();
    const container = document.querySelector(".container");
    sites.forEach((site) => {
        const siteCreated = createSite(site);
        container.append(siteCreated);
    });
})();
