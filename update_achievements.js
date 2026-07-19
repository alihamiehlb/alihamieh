const fs = require('fs');
const path = require('path');

const filePath = path.join('content', 'achievements.json');
const raw = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(raw);

const newAchievements = [
  {
    id: "google-ai-hackathon",
    title: "3rd Place — Google AI Hackathon",
    description: "Awarded 3rd place at the Google AI Hackathon held in Lebanon, organized by Google Developer Groups (GDG).",
    detail: "Developed an AI-powered solution during the hackathon, focusing on practical implementation and rapid prototyping.",
    instagramHighlight: "Hackathon updates on @alihamiehlb",
    category: "Hackathon",
    image: "/achievements/google-ai-hackathon.png",
    source: "award"
  },
  {
    id: "mc2-robotics",
    title: "1st Place — MC2 Robotics",
    description: "Won first place with the AlzHelper robotics project at the MC2 Robotics Innovation Competition.",
    detail: "Secured 1st place in Lebanon with the AlzHelper robotics project.",
    instagramHighlight: "MC2 Competition · @alihamiehlb",
    category: "Robotics",
    image: "/achievements/mc2-robotics.png",
    source: "award"
  },
  {
    id: "arc-robotics-2nd",
    title: "2nd Place — ARC Robotics",
    description: "National robotics and AI competition.",
    detail: "Secured 2nd place at the ARC Robotics Competition in Lebanon.",
    instagramHighlight: "Robotics highlight",
    category: "Robotics",
    image: "/achievements/arc-robotics.png",
    source: "award"
  },
  {
    id: "arabian-olympiad-ai",
    title: "2nd Place — Arabian Olympiad",
    description: "Runner-up in the AI & Python category across the Arab World.",
    detail: "Secured 2nd place in the AI & Python category at the Arabian Olympiad.",
    instagramHighlight: "Olympiad highlight",
    category: "AI & Python",
    image: "/achievements/arabian-olympiad.png",
    source: "award"
  },
  {
    id: "cybersecurity-olympiad",
    title: "13th Place — Arabian Cybersecurity Olympiad",
    description: "Defensive Cybersecurity category representing Lebanon.",
    detail: "Achieved 13th place in the Defensive Cybersecurity category representing Lebanon in the Arab World.",
    instagramHighlight: "Cybersecurity highlight",
    category: "Cybersecurity",
    image: "/achievements/cybersecurity-olympiad.png",
    source: "award"
  }
];

// Add the new achievements to the front
data.achievements = [...newAchievements, ...data.achievements];

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('Successfully updated achievements.json with new entries.');
