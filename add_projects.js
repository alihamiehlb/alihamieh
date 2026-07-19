const fs = require('fs');

const projectsData = JSON.parse(fs.readFileSync('content/projects.json', 'utf8'));

const newProjects = [
  {
    id: "aqualink",
    title: "Aqualink",
    slug: "aqualink",
    tags: ["robotics", "marine-tech"],
    description: "Marine tech project focused on underwater communication and automation.",
    overview: "Aqualink is a robotics and marine technology project developed for underwater exploration and communication.",
    images: ["/projects/aqualink-wro.jpeg"],
    content: "## Aqualink\nAqualink is an innovative marine technology project...",
    featured: true
  },
  {
    id: "alzhelper",
    title: "AlzHelper",
    slug: "alzhelper",
    tags: ["robotics", "health-tech", "ai"],
    description: "A health-tech robotics project to help people with Alzheimer's not get lost, featuring me with the ARC 2nd place trophy.",
    overview: "AlzHelper uses AI and embedded systems to monitor and assist patients with Alzheimer's disease.",
    images: ["/projects/me-with-arc-sec-place-trophy.jpeg"],
    content: "## AlzHelper\nDeveloped to help people with Alzheimer's...",
    featured: true
  },
  {
    id: "dasai-hamieh",
    title: "Dasai Hamieh",
    slug: "dasai-hamieh",
    tags: ["embedded", "3d-printing", "fusion-360"],
    description: "A custom fork of Dasai Mochi with a 3D printed case and light-up electronics.",
    overview: "Designed the casing in Fusion 360, 3D printed it, and integrated electronics to build a functional Dasai Mochi fork.",
    images: [
      "/projects/dasai-hamieh-fork-of-dasaimochi-withcase.jpeg",
      "/projects/dasai-hamieh-without-case-light-up.jpeg",
      "/projects/in-fusion-360-dasaihamieh.jpeg",
      "/projects/sketching-of-dasai-hamieh.jpeg",
      "/projects/v1-dasai-hamieh-case.jpeg"
    ],
    content: "## Dasai Hamieh\nHardware fork of Dasai Mochi...",
    featured: true
  },
  {
    id: "electric-boat",
    title: "Electric Boat",
    slug: "electric-boat",
    tags: ["embedded", "hardware"],
    description: "A functional electric boat project.",
    overview: "Custom-built electric boat utilizing RC components and custom chassis.",
    images: ["/projects/electric-boat-project.jpeg"],
    content: "## Electric Boat Project...",
    featured: true
  },
  {
    id: "hamieh-jammer",
    title: "Hamieh Jammer",
    slug: "hamieh-jammer",
    tags: ["security", "embedded"],
    description: "A custom fork of NRFBox focused on signal jamming and security testing.",
    overview: "Built for educational security testing of RF signals.",
    images: ["/projects/hamieh-jammer-fork-of-nrfbox.jpeg"],
    content: "## Hamieh Jammer...",
    featured: false
  },
  {
    id: "hamieh-rocket-v1",
    title: "Hamieh Rocket V1",
    slug: "hamieh-rocket-v1",
    tags: ["hobby", "3d-printing"],
    description: "A hobbyist 3D-printed rocket model.",
    overview: "V1 of my custom 3D-printed rocket.",
    images: ["/projects/hobby-3d-printed-rocket-hamiehrocketv1.jpeg"],
    content: "## Hamieh Rocket V1...",
    featured: false
  },
  {
    id: "morse-code-trainer",
    title: "Morse Code Trainer",
    slug: "morse-code-trainer",
    tags: ["embedded", "education"],
    description: "A hardware device developed from scratch to train Morse code.",
    overview: "Completely self-developed Morse code trainer for enthusiasts.",
    images: ["/projects/mores-code-tranier-allme-developed.jpeg"],
    content: "## Morse Code Trainer...",
    featured: false
  }
];

projectsData.projects = [...newProjects, ...projectsData.projects.filter(p => !newProjects.find(n => n.id === p.id))];

fs.writeFileSync('content/projects.json', JSON.stringify(projectsData, null, 2));
console.log("Updated projects.json with new projects and images.");
