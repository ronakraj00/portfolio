const skills = [
    {
        name: "React",
        description: "A JavaScript library for building user interfaces.",
        image: "https://reactjs.org/logo-og.png",
        links: {
            website: "https://reactjs.org/",
            wikipedia: "https://en.wikipedia.org/wiki/React_(JavaScript_library)",
            resources: [
                "https://reactjs.org/docs/getting-started.html",
                "https://www.udemy.com/course/react-the-complete-guide-incl-redux/",
                "https://www.freecodecamp.org/news/learn-react-beginners-tutorial/"
            ]
        },
        interestingFact: "React was developed by Facebook and is maintained by Facebook and a community of developers.",
        skillLevel: "Intermediate",
        usefulness: "High",
        other: "Used extensively in web development for creating dynamic user interfaces."
    },
    {
        name: "NodeJs",
        description: "JavaScript runtime built on Chrome's V8 engine.",
        image: "https://nodejs.org/static/images/logo.svg",
        links: {
            website: "https://nodejs.org/",
            wikipedia: "https://en.wikipedia.org/wiki/Node.js",
            resources: [
                "https://nodejs.dev/learn",
                "https://www.udemy.com/course/the-complete-nodejs-developer-course-2/",
                "https://www.freecodecamp.org/news/learn-node-js-full-course/"
            ]
        },
        interestingFact: "Node.js is widely used for building server-side applications and APIs.",
        skillLevel: "Intermediate",
        usefulness: "High",
        other: "Enables JavaScript to be used for server-side scripting."
    },
    {
        name: "ExpressJs",
        description: "Fast, unopinionated, minimalist web framework for Node.js.",
        image: "https://expressjs.com/images/express-facebook-share.png",
        links: {
            website: "https://expressjs.com/",
            wikipedia: "https://en.wikipedia.org/wiki/Express.js",
            resources: [
                "https://expressjs.com/en/starter/installing.html",
                "https://www.udemy.com/course/expressjs/",
                "https://www.freecodecamp.org/news/learn-express-js-full-course/"
            ]
        },
        interestingFact: "Express.js is the backend part of the MEAN stack (MongoDB, Express.js, Angular, Node.js).",
        skillLevel: "Intermediate",
        usefulness: "High",
        other: "Commonly used to build web applications and RESTful APIs."
    },
    {
        name: "MongoDB",
        description: "A NoSQL database for modern applications.",
        image: "https://www.mongodb.com/assets/images/global/leaf.svg",
        links: {
            website: "https://www.mongodb.com/",
            wikipedia: "https://en.wikipedia.org/wiki/MongoDB",
            resources: [
                "https://university.mongodb.com/",
                "https://www.udemy.com/course/mongodb-the-complete-developers-guide/",
                "https://www.freecodecamp.org/news/learn-mongodb-a4e117ba7a4b/"
            ]
        },
        interestingFact: "MongoDB stores data in flexible, JSON-like documents.",
        skillLevel: "Intermediate",
        usefulness: "High",
        other: "Popular in modern web development, especially for handling large volumes of data."
    },
    {
        name: "Mongoose",
        description: "Elegant MongoDB object modeling for Node.js.",
        image: "https://mongoosejs.com/docs/images/mongoose5_62x30_transparent.png",
        links: {
            website: "https://mongoosejs.com/",
            wikipedia: "https://en.wikipedia.org/wiki/Mongoose_(software)",
            resources: [
                "https://mongoosejs.com/docs/index.html",
                "https://www.udemy.com/course/learning-mongoose/",
                "https://www.freecodecamp.org/news/introduction-to-mongoose-for-mongodb-d2a7aa593c57/"
            ]
        },
        interestingFact: "Mongoose provides a straight-forward, schema-based solution to model your application data.",
        skillLevel: "Intermediate",
        usefulness: "High",
        other: "Helps to enforce data validation and business logic at the database level."
    },
    {
        name: "REST API",
        description: "Architectural style for designing networked applications.",
        image: "https://miro.medium.com/max/1200/1*vyVSUHttoeq2UhN7X8KfiQ.png",
        links: {
            website: "https://restfulapi.net/",
            wikipedia: "https://en.wikipedia.org/wiki/Representational_state_transfer",
            resources: [
                "https://restfulapi.net/resources/",
                "https://www.udemy.com/course/rest-api/",
                "https://www.freecodecamp.org/news/rest-api-tutorial/"
            ]
        },
        interestingFact: "REST APIs are stateless, allowing for scalability and simplicity.",
        skillLevel: "Intermediate",
        usefulness: "High",
        other: "Widely used in web services and microservices architectures."
    },
    {
        name: "Tailwind CSS",
        description: "Utility-first CSS framework for rapid UI development.",
        image: "https://tailwindcss.com/_next/static/media/tailwindcss-mark.b608c1a0e84e6dc4bfb3b4e11c96319c.svg",
        links: {
            website: "https://tailwindcss.com/",
            wikipedia: "https://en.wikipedia.org/wiki/Tailwind_CSS",
            resources: [
                "https://tailwindcss.com/docs/installation",
                "https://www.udemy.com/course/tailwind-css-from-scratch/",
                "https://www.freecodecamp.org/news/tailwind-css-course/"
            ]
        },
        interestingFact: "Tailwind CSS allows developers to rapidly build custom designs without leaving their HTML.",
        skillLevel: "Beginner",
        usefulness: "High",
        other: "Popular for creating responsive and modern web designs."
    },
    {
        name: "Git",
        description: "Distributed version control system.",
        image: "https://git-scm.com/images/logos/downloads/Git-Logo-2Color.png",
        links: {
            website: "https://git-scm.com/",
            wikipedia: "https://en.wikipedia.org/wiki/Git",
            resources: [
                "https://git-scm.com/book/en/v2",
                "https://www.udemy.com/course/git-complete/",
                "https://www.freecodecamp.org/news/learn-the-basics-of-git/"
            ]
        },
        interestingFact: "Git was created by Linus Torvalds, the creator of Linux.",
        skillLevel: "Beginner",
        usefulness: "High",
        other: "Essential for version control and collaborative development."
    },
    {
        name: "HTML",
        description: "Standard markup language for creating web pages.",
        image: "https://www.w3.org/html/logo/downloads/HTML5_Badge_512.png",
        links: {
            website: "https://developer.mozilla.org/en-US/docs/Web/HTML",
            wikipedia: "https://en.wikipedia.org/wiki/HTML",
            resources: [
                "https://developer.mozilla.org/en-US/docs/Web/HTML",
                "https://www.udemy.com/course/html5-and-css3-build-responsive-websites/",
                "https://www.freecodecamp.org/learn/responsive-web-design/#basic-html-and-html5"
            ]
        },
        interestingFact: "HTML stands for HyperText Markup Language.",
        skillLevel: "Beginner",
        usefulness: "High",
        other: "Foundation for all web development."
    },
    {
        name: "CSS",
        description: "Style sheet language used for describing the presentation of a document.",
        image: "https://upload.wikimedia.org/wikipedia/commons/6/62/CSS3_logo.svg",
        links: {
            website: "https://developer.mozilla.org/en-US/docs/Web/CSS",
            wikipedia: "https://en.wikipedia.org/wiki/CSS",
            resources: [
                "https://developer.mozilla.org/en-US/docs/Web/CSS",
                "https://www.udemy.com/course/css-the-complete-guide-incl-flexbox-grid-sass/",
                "https://www.freecodecamp.org/learn/responsive-web-design/#basic-css"
            ]
        },
        interestingFact: "CSS stands for Cascading Style Sheets.",
        skillLevel: "Beginner",
        usefulness: "High",
        other: "Crucial for web design and layout."
    },
    {
        name: "JavaScript",
        description: "Programming language that conforms to the ECMAScript specification.",
        image: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
        links: {
            website: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
            wikipedia: "https://en.wikipedia.org/wiki/JavaScript",
            resources: [
                "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
                "https://www.udemy.com/course/the-complete-javascript-course/",
                "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/"
            ]
        },
        interestingFact: "JavaScript was created in just 10 days by Brendan Eich in 1995.",
        skillLevel: "Beginner to Advanced",
        usefulness: "High",
        other: "Used for both client-side and server-side development."
    },
    {
        name: "GitHub",
        description: "Web-based interface for version control using Git.",
        image: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
        links: {
            website: "https://github.com/",
            wikipedia: "https://en.wikipedia.org/wiki/GitHub",
            resources: [
                "https://guides.github.com/",
                "https://www.udemy.com/course/github-tutorial/",
                "https://www.freecodecamp.org/news/learn-git-and-github/"
            ]
        },
        interestingFact: "GitHub is the largest host of source code in the world.",
        skillLevel: "Beginner",
        usefulness: "High",
        other: "Essential for collaborative software development and version control."
    },
    {
        name: "Linux",
        description: "Open-source Unix-like operating system kernel.",
        image: "https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg",
        links: {
            website: "https://www.kernel.org/",
            wikipedia: "https://en.wikipedia.org/wiki/Linux",
            resources: [
                "https://www.linux.org/lessons/",
                "https://www.udemy.com/course/linux-for-beginners/",
                "https://www.freecodecamp.org/news/learn-linux-beginners-course/"
            ]
        },
        interestingFact: "Linux is used in everything from smartphones to supercomputers.",
        skillLevel: "Intermediate",
        usefulness: "High",
        other: "Widely used in servers, embedded systems, and as a development environment."
    },
    {
        name: "Python",
        description: "High-level, general-purpose programming language.",
        image: "https://www.python.org/static/community_logos/python-logo-master-v3-TM.png",
        links: {
            website: "https://www.python.org/",
            wikipedia: "https://en.wikipedia.org/wiki/Python_(programming_language)",
            resources: [
                "https://docs.python.org/3/tutorial/",
                "https://www.udemy.com/course/complete-python-bootcamp/",
                "https://www.freecodecamp.org/news/learn-python-full-course/"
            ]
        },
        interestingFact: "Python was named after Monty Python's Flying Circus.",
        skillLevel: "Beginner to Advanced",
        usefulness: "High",
        other: "Versatile language used in web development, data science, automation, and more."
    },
    {
        name: "C",
        description: "General-purpose programming language.",
        image: "https://upload.wikimedia.org/wikipedia/commons/1/19/C_Logo.png",
        links: {
            website: "https://en.cppreference.com/w/c",
            wikipedia: "https://en.wikipedia.org/wiki/C_(programming_language)",
            resources: [
                "https://www.learn-c.org/",
                "https://www.udemy.com/course/c-programming-for-beginners-/",
                "https://www.freecodecamp.org/news/learn-c-tutorial/"
            ]
        },
        interestingFact: "C is one of the oldest programming languages still in widespread use.",
        skillLevel: "Intermediate",
        usefulness: "High",
        other: "Foundation for many other programming languages and system software."
    },
    {
        name: "Arduino",
        description: "Open-source electronics platform based on easy-to-use hardware and software.",
        image: "https://upload.wikimedia.org/wikipedia/commons/8/87/Arduino_Logo.svg",
        links: {
            website: "https://www.arduino.cc/",
            wikipedia: "https://en.wikipedia.org/wiki/Arduino",
            resources: [
                "https://www.arduino.cc/en/Tutorial/HomePage",
                "https://www.udemy.com/course/arduino-step-by-step/",
                "https://www.freecodecamp.org/news/learn-arduino-beginners-guide/"
            ]
        },
        interestingFact: "Arduino was originally developed for students at the Interaction Design Institute Ivrea in Italy.",
        skillLevel: "Beginner",
        usefulness: "High",
        other: "Popular for DIY electronics projects and prototyping."
    },
    {
        name: "Raspberry Pi",
        description: "Small, affordable computer used for learning programming and building hardware projects.",
        image: "https://upload.wikimedia.org/wikipedia/en/c/cb/Raspberry_Pi_Logo.svg",
        links: {
            website: "https://www.raspberrypi.org/",
            wikipedia: "https://en.wikipedia.org/wiki/Raspberry_Pi",
            resources: [
                "https://projects.raspberrypi.org/en",
                "https://www.udemy.com/course/raspberry-pi-bootcamp/",
                "https://www.freecodecamp.org/news/learn-raspberry-pi-beginners-guide/"
            ]
        },
        interestingFact: "The Raspberry Pi Foundation is a UK-based charity that aims to promote the study of basic computer science.",
        skillLevel: "Beginner",
        usefulness: "High",
        other: "Great for educational purposes and small-scale DIY projects."
    },
    {
        name: "Java",
        description: "Class-based, object-oriented programming language.",
        image: "https://upload.wikimedia.org/wikipedia/en/3/30/Java_programming_language_logo.svg",
        links: {
            website: "https://www.java.com/",
            wikipedia: "https://en.wikipedia.org/wiki/Java_(programming_language)",
            resources: [
                "https://docs.oracle.com/javase/tutorial/",
                "https://www.udemy.com/course/java-the-complete-java-developer-course/",
                "https://www.freecodecamp.org/news/learn-java-course/"
            ]
        },
        interestingFact: "Java's 'Write Once, Run Anywhere' (WORA) capability makes it a versatile choice for developers.",
        skillLevel: "Intermediate to Advanced",
        usefulness: "High",
        other: "Widely used in enterprise environments and Android app development."
    },
    {
        name: "webpack",
        description: "Module bundler for JavaScript applications.",
        image: "https://webpack.js.org/site-logo.1fcab817090e78435061.svg",
        links: {
            website: "https://webpack.js.org/",
            wikipedia: "https://en.wikipedia.org/wiki/Webpack",
            resources: [
                "https://webpack.js.org/guides/getting-started/",
                "https://www.udemy.com/course/webpack-4-in-depth/",
                "https://www.freecodecamp.org/news/an-intro-to-webpack-what-it-is-and-how-to-use-it-8304ecdc3c60/"
            ]
        },
        interestingFact: "Webpack can bundle multiple modules into a single file, optimizing the loading time of web applications.",
        skillLevel: "Intermediate",
        usefulness: "High",
        other: "Essential for modern web development workflows."
    },
    {
        name: "vite",
        description: "Next generation front-end tooling.",
        image: "https://vitejs.dev/logo.svg",
        links: {
            website: "https://vitejs.dev/",
            wikipedia: "https://en.wikipedia.org/wiki/Vite_(software)",
            resources: [
                "https://vitejs.dev/guide/",
                "https://www.udemy.com/course/vite-react-project-setup/",
                "https://www.freecodecamp.org/news/vite-explained/"
            ]
        },
        interestingFact: "Vite focuses on fast development and optimizes the build process for modern JavaScript frameworks.",
        skillLevel: "Intermediate",
        usefulness: "High",
        other: "Designed to be a faster alternative to traditional bundlers like webpack."
    },
    {
        name: "Postman",
        description: "API development environment.",
        image: "https://voyager.postman.com/logo/postman-logo-icon-orange.svg",
        links: {
            website: "https://www.postman.com/",
            wikipedia: "https://en.wikipedia.org/wiki/Postman_(software)",
            resources: [
                "https://learning.postman.com/",
                "https://www.udemy.com/course/postman-the-complete-guide/",
                "https://www.freecodecamp.org/news/learn-postman-course/"
            ]
        },
        interestingFact: "Postman started as a side project for a small group of API developers.",
        skillLevel: "Beginner",
        usefulness: "High",
        other: "Widely used for testing and documenting APIs."
    },
    {
        name: "Redux Toolkit",
        description: "Official, recommended way to write Redux logic.",
        image: "https://redux-toolkit.js.org/img/redux.svg",
        links: {
            website: "https://redux-toolkit.js.org/",
            wikipedia: "https://en.wikipedia.org/wiki/Redux_(JavaScript_library)",
            resources: [
                "https://redux-toolkit.js.org/tutorials/overview",
                "https://www.udemy.com/course/redux-react/",
                "https://www.freecodecamp.org/news/learn-redux-course/"
            ]
        },
        interestingFact: "Redux Toolkit simplifies Redux development by providing a set of tools and best practices.",
        skillLevel: "Intermediate",
        usefulness: "High",
        other: "Recommended for managing state in complex React applications."
    }
];

export default skills;