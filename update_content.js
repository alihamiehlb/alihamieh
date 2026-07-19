const fs = require('fs');
const path = require('path');

const projectsPath = path.join(__dirname, 'content', 'projects.json');
const achievementsPath = path.join(__dirname, 'content', 'achievements.json');
const cvPath = path.join(__dirname, 'content', 'cv.json');

// 1. Update Projects
const projectsData = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));

const newProjects = [
  {
    id: "dasai-hamieh",
    title: "Dasai Hamieh",
    slug: "dasai-hamieh",
    tags: ["hardware", "esp32", "3d-printing"],
    description: "A custom hardware build and fork of Dasaimochi, complete with a custom 3D-printed case and interactive displays.",
    images: [
      "/projects/dasai-hamieh-fork-of-dasaimochi-withcase.jpeg",
      "/projects/dasai-hamieh-without-case-light-up.jpeg",
      "/projects/in-fusion-360-dasaihamieh.jpeg",
      "/projects/sketching-of-dasai-hamieh.jpeg",
      "/projects/v1-dasai-hamieh-case.jpeg"
    ],
    content: "## Overview\nThis project involved designing a custom case in Fusion 360, programming an ESP32 for interactive displays, and building the final hardware.",
    featured: true
  },
  {
    id: "electric-boat",
    title: "Electric Boat Prototype",
    slug: "electric-boat",
    tags: ["hardware", "rc", "engineering"],
    description: "An electric boat prototype built from scratch with custom RC controls.",
    images: ["/projects/electric-boat-project.jpeg"],
    content: "## Overview\nAn electric boat prototype featuring custom electronics and propulsion.",
    featured: false
  },
  {
    id: "hamieh-jammer",
    title: "Hamieh Jammer",
    slug: "hamieh-jammer",
    tags: ["hardware", "security", "rf"],
    description: "A fork of the NRFbox, designed for RF testing and security research.",
    images: ["/projects/hamieh-jammer-fork-of-nrfbox.jpeg"],
    content: "## Overview\nHardware testing device for RF security.",
    featured: false
  },
  {
    id: "hamieh-rocket",
    title: "Hamieh Rocket V1",
    slug: "hamieh-rocket",
    tags: ["hardware", "aerospace", "3d-printing"],
    description: "A 3D-printed hobby rocket designed and assembled from scratch.",
    images: ["/projects/hobby-3d-printed-rocket-hamiehrocketv1.jpeg"],
    content: "## Overview\nV1 of a custom 3D printed rocket.",
    featured: false
  },
  {
    id: "morse-code-trainer",
    title: "Morse Code Trainer",
    slug: "morse-code-trainer",
    tags: ["hardware", "electronics", "education"],
    description: "An interactive morse code trainer developed entirely from the ground up.",
    images: ["/projects/mores-code-tranier-allme-developed.jpeg"],
    content: "## Overview\nA standalone hardware device for learning morse code.",
    featured: false
  },
  {
    id: "aqualink",
    title: "Aqualink",
    slug: "aqualink",
    tags: ["robotics", "wro", "engineering"],
    description: "Robotics competition entry for the World Robot Olympiad.",
    images: ["/projects/aqualink-wro.jpeg"],
    content: "## Overview\nAqualink was built for the World Robot Olympiad.",
    featured: true
  },
  {
    id: "alzhelper",
    title: "Alzhelper",
    slug: "alzhelper",
    tags: ["robotics", "health-tech", "arc"],
    description: "A project designed to help people with Alzheimer's not get lost, which won the ARC robotics event.",
    images: ["/projects/me-with-arc-sec-place-trophy.jpeg"],
    content: "## Overview\nAlzhelper is a wearable/tracking solution to ensure safety for Alzheimer's patients.",
    featured: true
  }
];

// Append new projects
projectsData.projects.push(...newProjects);
fs.writeFileSync(projectsPath, JSON.stringify(projectsData, null, 2));

// 2. Update Achievements
const achievementsData = JSON.parse(fs.readFileSync(achievementsPath, 'utf8'));

achievementsData.achievements = achievementsData.achievements.map(ach => {
  if (ach.id === 'wro') {
    ach.implementation = "Aqualink project: Designed, built, and programmed a competition robot to solve complex tasks under pressure.";
  } else if (ach.id === 'arc') {
    ach.implementation = "Alzhelper project: Developed a system to help people with Alzheimer's not get lost, winning second place at the ARC event.";
  } else {
    ach.implementation = "";
  }
  return ach;
});

fs.writeFileSync(achievementsPath, JSON.stringify(achievementsData, null, 2));

// 3. Update CV
const cvData = JSON.parse(fs.readFileSync(cvPath, 'utf8'));

if (cvData.achievements) {
  cvData.achievements = cvData.achievements.map(ach => {
    ach.implementation = "";
    if (ach.title.includes("Google AI")) {
      ach.implementation = "Developed an AI-powered solution during the hackathon, focusing on practical implementation and rapid prototyping.";
    } else if (ach.title.includes("National First Place")) {
      ach.implementation = "Designed and programmed a robot for the WRO competition, demonstrating advanced problem-solving and engineering skills.";
    }
    return ach;
  });
  fs.writeFileSync(cvPath, JSON.stringify(cvData, null, 2));
}

console.log("Content updated successfully.");
