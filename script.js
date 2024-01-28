const skillsSection = document.querySelector(".about-skills");
const skills = [
    "React",
    "NodeJs",
    "ExpressJs",
    "MongoDB",
    "Mongoose",
    "REST API",
    "Tailwind CSS",
    "Git",
    "HTML",
    "CSS",
    "JAVASCRIPT",
    "GITHUB",
    "LINUX",
    "PYTHON",
    "C",
    "Arduino",
    "Raspberry Pi",
    "Java",
    "webpack",
    "vite",
    "Postman",
    "Redux-Toolkit",
];

skills.forEach(skill=>{
    const skillDiv=document.createElement("div");
    skillDiv.innerText=skill;
    skillDiv.classList.add("skill");
    skillsSection.append(skillDiv);
})

const buttonRight = document.querySelector('.arrow.right');
const buttonLeft = document.querySelector('.arrow.left');

buttonRight.addEventListener("click",function () {
    const container=document.querySelector('.container')
    container.scrollLeft += 400;
});
buttonLeft.addEventListener("click",function () {
    document.querySelector('.container').scrollLeft -= 400;
});

const scrollDown=document.querySelector(".scroll-down")
scrollDown.addEventListener("click",()=>{
    window.scroll(0,1000)
})
