// src/data/resumeSamples.js

export const resumeSamples = [
  {
    id: "internship",
    title: "Internship Resume",
    description: "Perfect for students applying for internships",
    category: "student",
    person: {
      name: "Aarav Sharma",
      location: "Delhi, India",
      email: "aaravsharma@gmail.com",
      linkedin: "linkedin.com/in/aaravsharma",
    },
    sections: {
      objective:
        "Motivated Computer Science undergraduate seeking a Software Development Internship to apply problem-solving skills and gain real-world experience.",
      education: [
        {
          degree: "B.Tech – Computer Science",
          institute: "Bhagwan Parshuram Institute of Technology, Delhi",
          duration: "2024 – 2028",
          score: "CGPA: 8.6",
        },
      ],
      skills: [
        "C++",
        "Python",
        "JavaScript",
        "React",
        "HTML",
        "CSS",
        "Git",
      ],
      projects: [
        {
          title: "Student Management System",
          details:
            "Built a CRUD-based system using Python, improving data handling efficiency by 30%.",
        },
        {
          title: "Portfolio Website",
          details:
            "Designed a responsive portfolio using React with smooth animations.",
        },
      ],
      achievements: [
        "Solved 150+ DSA problems on LeetCode",
        "Finalist in college hackathon",
      ],
    },
  },

  {
    id: "fresher",
    title: "Fresher / Student Resume",
    description: "Ideal for fresh graduates and entry-level roles",
    category: "student",
    person: {
      name: "Janvi Mathur",
      location: "Delhi, India",
      email: "janvimathur@gmail.com",
      github: "github.com/janvimathur",
    },
    sections: {
      summary:
        "Detail-oriented Computer Science student with strong fundamentals in DSA, web development, and UI design.",
      education: [
        {
          degree: "B.Tech – CSE (Data Science)",
          institute: "BPIT, Delhi",
          duration: "2024 – 2028",
        },
      ],
      skills: [
        "C++",
        "Python",
        "JavaScript",
        "React",
        "Firebase",
        "SQL",
      ],
      projects: [
        {
          title: "Resumiq – Resume Builder",
          details:
            "Built a resume builder with ATS-friendly layouts, real-time preview, and PDF export.",
        },
      ],
      certifications: [
        "Python for Everybody – Coursera",
        "Web Development Bootcamp – Udemy",
      ],
    },
  },

  {
    id: "experienced",
    title: "Experienced Professional Resume",
    description: "For professionals with industry experience",
    category: "professional",
    person: {
      name: "Rohit Verma",
      location: "Bengaluru, India",
      email: "rohit.verma@gmail.com",
      role: "Software Engineer (3+ Years)",
    },
    sections: {
      summary:
        "Results-driven Software Engineer with 3+ years of experience in full-stack development and scalable applications.",
      experience: [
        {
          role: "Software Engineer",
          company: "Infosys",
          duration: "2021 – Present",
          details: [
            "Developed REST APIs serving 1M+ users",
            "Reduced API response time by 40%",
            "Mentored 4 junior developers",
          ],
        },
      ],
      skills: [
        "Java",
        "Spring Boot",
        "React",
        "AWS",
        "Docker",
        "PostgreSQL",
      ],
      education: [
        {
          degree: "B.Tech – Computer Science",
          institute: "VTU, Karnataka",
        },
      ],
    },
  },
];
