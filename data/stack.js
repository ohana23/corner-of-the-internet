import App from "next/app";

export const stack = [
  {
    name: "Notes",
    description: "I keep it simple.",
    platforms: "macOS, iOS",
    appIcon: "/stack-app-icons/notes.webp",
  },
  {
    name: "Reminders",
    description: "Again... simple.",
    platforms: "macOS, iOS",
    appIcon: "/stack-app-icons/reminders.webp",
  },
  {
    name: "Figma",
    logo: "https://cdn.simpleicons.org/figma",
    description: "Interface design and prototyping",
    platforms: "macOS",
    appIcon: "/stack-app-icons/figma.png",
  },
  {
    name: "Figma Slides",
    logo: "https://cdn.simpleicons.org/figma",
    description: "The most fluid slide deck software",
    platforms: "macOS",
    appIcon: "/stack-app-icons/figma-slides.png",
  },
  {
    name: "Dia",
    description: "My favorite browser on desktop",
    platforms: "macOS",
    appIcon: "/stack-app-icons/diabrowser.webp",
  },
  {
    name: "Safari",
    logo: "https://cdn.simpleicons.org/safari",
    description: "My favorite browser on mobile",
    platforms: "iOS",
    appIcon: "/stack-app-icons/safari.png",
  },
  {
    name: "iPhone 15 Pro",
    logo: "https://cdn.simpleicons.org/apple",
    description: "I'll probably upgrade once the foldable iPhone gets released",
    platforms: "Physical",
  },
  {
    name: "BMW 330i",
    logo: "https://cdn.simpleicons.org/bmw",
    description: "2021. Just fun to drive.",
    platforms: "Physical",
  },
  {
    name: "Zed",
    logo: "https://cdn.simpleicons.org/zedindustries",
    description:
      "Started using this as my code editor of choice at the end of 2025. I like it's speed, simplicity, and Claude Code integration.",
    platforms: "macOS",
    appIcon: "/stack-app-icons/zed.png",
  },
  {
    name: "Xcode",
    description: "A chore to use, but it's the best IDE for iOS development.",
    platforms: "macOS",
    appIcon: "/stack-app-icons/xcode.webp",
  },
  {
    name: "Spotify",
    logo: "https://cdn.simpleicons.org/spotify",
    description: "Music, Podcasts",
    platforms: "macOS, iOS",
    appIcon: "/stack-app-icons/spotify.png",
  },
  {
    name: "Youtube",
    logo: "https://cdn.simpleicons.org/youtube",
    description: "Videos, Podcasts",
    platforms: "macOS, iOS",
    appIcon: "/stack-app-icons/youtube.png",
  },
  {
    name: "Substack",
    logo: "https://cdn.simpleicons.org/substack",
    description: "My favorite newsletter platform",
    platforms: "macOS, iOS",
    appIcon: "/stack-app-icons/substack.png",
  },
  {
    name: "Claude",
    logo: "https://cdn.simpleicons.org/anthropic",
    description:
      "My latest AI assistant of choice. Though it seems to change like once a fiscal quarter.",
    platforms: "macOS, iOS",
    appIcon: "/stack-app-icons/claude.png",
  },
  {
    name: "Claude Code",
    logo: "https://cdn.simpleicons.org/anthropic",
    description: "The best coding agent for now. We'll see if it changes.",
    platforms: "macOS, iOS",
    appIcon: "/stack-app-icons/claude-code.png",
  },
  {
    name: "Letterboxd",
    logo: "https://cdn.simpleicons.org/letterboxd",
    description: "Where I track the movies I watch.",
    platforms: "macOS, iOS",
    appIcon: "/stack-app-icons/letterboxd.png",
  },
  {
    name: "Goodreads",
    logo: "https://cdn.simpleicons.org/goodreads",
    description: "Where I track the books I read.",
    platforms: "macOS, iOS",
    appIcon: "/stack-app-icons/goodreads.png",
  },
  {
    name: "Github",
    logo: "https://cdn.simpleicons.org/github",
    description: "How would I build without it?",
    platforms: "macOS, iOS",
    appIcon: "/stack-app-icons/github.png",
  },
  {
    name: "Copilot",
    description:
      "The best, most well-designed, actually sticky piece of budgeting software I've ever used. It will take a lot to overthrow this king.",
    platforms: "macOS, iOS",
    appIcon: "/stack-app-icons/copilot-money.webp",
  },
  {
    name: "Calendar",
    description: "Where I keep my life outside of work organized.",
    platforms: "macOS, iOS",
    appIcon: "/stack-app-icons/applecalendar.webp",
  },
  {
    name: "Google Calendar",
    logo: "https://cdn.simpleicons.org/googlecalendar",
    description: "Where I keep my work life oragnized.",
    platforms: "macOS, iOS",
    appIcon: "/stack-app-icons/google-calendar.png",
  },
  {
    name: "itsycal",
    description:
      "The most minimal calendar app I use. It lives in the macOS menu bar.",
    platforms: "macOS",
    appIcon: "/stack-app-icons/itsycal.webp",
  },
  {
    name: "Raycast",
    logo: "https://cdn.simpleicons.org/raycast",
    description: "A necessity for macOS power users.",
    platforms: "macOS",
    appIcon: "/stack-app-icons/raycast.png",
  },
  {
    name: "Passwords",
    description: "I keep all of my passwords here. It does everything I need.",
    platforms: "macOS, iOS",
    appIcon: "/stack-app-icons/passwords.webp",
  },
  {
    name: "Airpods Pro 3",
    logo: "https://cdn.simpleicons.org/apple",
    description: "The best earbuds.",
    platforms: "Physical",
  },
  {
    name: "Apple Watch Series 10",
    logo: "https://cdn.simpleicons.org/apple",
    description: "My fitness tracker.",
    platforms: "Physical",
  },
  {
    name: "Anker 3-in-1 Cube Charger",
    description:
      "The only charger I need for my phone, Airpods, and Apple Watch.",
    platforms: "Physical",
    appIcon: "/stack-app-icons/anker.webp",
  },
  {
    name: "Loom",
    logo: "https://cdn.simpleicons.org/loom",
    description: "How I record videos to share with my coworkers.",
    platforms: "macOS",
    appIcon: "/stack-app-icons/loom.png",
  },
  {
    name: "Robinhood",
    logo: "https://cdn.simpleicons.org/robinhood",
    description: "My personal stock trading platform.",
    platforms: "macOS, iOS",
    appIcon: "/stack-app-icons/robinhood.png",
  },
  {
    name: "Fidelity",
    logo: "https://cdn.simpleicons.org/fidelity",
    description: "My retirement accounts platform.",
    platforms: "macOS, iOS",
    appIcon: "/stack-app-icons/fidelity.webp",
  },
  {
    name: "Beast Blender",
    description:
      "A nice upgrade from a NutriBullet. I wish the cups were easier to clean, but everything about this screams high-quality industrial design.",
    platforms: "Physical",
    appIcon: "/stack-app-icons/beast.webp",
  },
  {
    name: "Gifski",
    description: "Make GIFS as fast as possible.",
    platforms: "macOS",
    appIcon: "/stack-app-icons/gifski.webp",
  },
  {
    name: "Midjourney",
    description:
      "My Midjourney subscription gets toggled on and off depending on whether a visual project I'm working on rears it's head.",
    platforms: "macOS",
    appIcon: "/stack-app-icons/midjourney.webp",
  },
  {
    name: "CleanShot X",
    description: "A mile better than the native macOS screenshot tool.",
    platforms: "macOS",
    appIcon: "/stack-app-icons/cleanshot-x.webp",
  },
  {
    name: "Mobbin",
    description:
      "The greatest software design resource. A trove of beautiful app and site designs.",
    platforms: "macOS",
    appIcon: "/stack-app-icons/mobbin.webp",
  },
  {
    name: "Cash App Taxes",
    logo: "https://cdn.simpleicons.org/cashapp",
    description:
      "Literally the best tax processing software. Genuinely fun to use?",
    platforms: "macOS",
    appIcon: "/stack-app-icons/cash-app-taxes.png",
  },
  {
    name: "Mymind",
    description: "Automatic link organization tool.",
    platforms: "macOS, iOS",
    appIcon: "/stack-app-icons/mymind.webp",
  },
  {
    name: "Trek Emonda ALR",
    description: "My lightweight, aluminum road bike.",
    platforms: "Physical",
    appIcon: "/stack-app-icons/trek.webp",
  },
  {
    name: "Strava",
    logo: "https://cdn.simpleicons.org/strava",
    description:
      "Keeps track of my workouts, and inspires me to keep up with my more athletic friends.",
    platforms: "iOS",
    appIcon: "/stack-app-icons/strava.png",
  },
];
