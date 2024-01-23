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