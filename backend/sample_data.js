const sampleCourses = [
  {
    prefix: "SDEV",
    number: "120",
    name: "Computing Logic",
    program: "Software Development",
    description: "Introduces the student to algorithms, algorithm development, and implementation using flowcharting/UML and structured programming techniques.",
    prerequisites: [
      "Demonstrated readiness for college-level English",
      "Demonstrated readiness in STEM MATH - Route 2 or QUANT MATH"
    ],
    creditHoursMin: 3,
    creditHoursMax: 3,
    lectureHoursMin: 3,
    dateOfLastRevision: new Date("2020-08-01"),
    learningObjectives: [
      "Demonstrate the usage of Flowcharts, Pseudocode, and UML diagrams",
      "Utilize logical and relational operators, control structures, and modularity",
      "Apply strategies to test and debug simple programs",
      "Analyze and explain the behavior of simple programs",
      "Apply base numbering system conversions between binary, decimal, and hex",
      "Illustrate applications of binary/hex in computing systems",
      "Identify uses of scripting/programming languages",
      "Compare software development methodologies (SDLC, Iterative, Prototyping)",
      "Discuss secure programming and design",
      "Describe components of Von Neumann architecture",
      "Simulate logic circuits using basic gates"
    ],
    topics: [
      "Algorithms",
      "Numbering Systems",
      "Basic Programming",
      "Control Structures",
      "Flowcharting & Pseudocode",
      "Logic Operators",
      "Truth Tables",
      "UML",
      "Von Neumann Architecture",
      "Logic Gates"
    ]
  },
  {
    prefix: "SDEV",
    number: "140",
    name: "Introduction to Software Development",
    program: "Software Development",
    description: "Covers programming languages, paradigms, tools, and concepts including structured and object-oriented programming.",
    prerequisites: ["SDEV 120"],
    creditHoursMin: 3,
    creditHoursMax: 3,
    lectureHoursMin: 3,
    dateOfLastRevision: new Date("2024-08-01"),
    learningObjectives: [
      "Differentiate compilers and interpreters",
      "Use variables, constants, data types, and control structures",
      "Implement abstraction and modularization using functions",
      "Apply object-oriented programming concepts",
      "Debug and test in an IDE",
      "Document and construct software per industry standards",
      "Discuss ethical and legal software issues",
      "Explore secure programming techniques",
      "Use collaboration tools like Git"
    ],
    topics: [
      "Compilers vs Interpreters",
      "Control Structures",
      "OOP Basics",
      "Software Development Models",
      "Software Architecture",
      "Exception Handling",
      "Testing Techniques",
      "Coding Standards",
      "Version Control Tools"
    ]
  },
  {
    prefix: "SDEV",
    number: "143",
    name: "Git Version Control Systems",
    program: "Software Development",
    description: "Learn Git and version control concepts for managing and deploying software in CI/CD pipelines using CLI tools and collaboration platforms.",
    prerequisites: ["SDEV 120", "CSCI 101"],
    creditHoursMin: 3,
    creditHoursMax: 3,
    lectureHoursMin: 3,
    dateOfLastRevision: new Date("2024-08-01"),
    learningObjectives: [
      "Initialize and manage Git repositories",
      "Track issues and changes using commit messages",
      "Understand Git history and graph structures",
      "Evaluate CI/CD tools and automation",
      "Create project documentation and wikis",
      "Resolve merge conflicts with diff tools",
      "Use Git logs, filters, and collaboration best practices"
    ],
    topics: [
      "Branching & Merging",
      "Push/Pull Requests",
      "Conflict Resolution",
      "CI/CD Pipelines",
      "Documentation (Readmes, Wikis)",
      "Project Management on GitHub",
      "Automation Tools",
      "Git Internals"
    ]
  }
];

const Course = require('./models/Course.js');

async function addSampleCourses() {
    try {
        Course.insertMany(sampleCourses);

        console.log('sample courses added successfully');
    } catch (error) {
        console.error("Error adding sample courses:", error);
    }
}

module.exports = addSampleCourses;