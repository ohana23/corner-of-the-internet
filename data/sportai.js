export const sportAiMeta = {
  title: "Building SportAI",
  eyebrow: "Case study",
  summary:
    "Designing and building a direct-to-consumer fantasy sports product around SportAI’s predictive Score+ model.",
  details: [
    { label: "Date", value: "July 2021 → August 2022" },
    {
      label: "Roles",
      value: "Design Director, iOS Developer, Marketing",
    },
    { label: "Location", value: "Orlando, FL (Remote)" },
    {
      label: "Responsibilities",
      value:
        "Creative direction, design strategy, UI/UX design, design facilitation and leadership, frontend development, marketing design",
    },
  ],
};

export const sportAiNav = [
  { id: "from-the-top", label: "From the top" },
  { id: "design-ethos", label: "Design ethos" },
  { id: "breaking-ground", label: "Breaking ground" },
  { id: "home", label: "Home" },
  { id: "score-plus", label: "Score+" },
  { id: "compare-lineups", label: "Compare lineups" },
  { id: "salary-optimizer", label: "Salary optimizer" },
  { id: "website", label: "Website" },
  { id: "more-work", label: "More work" },
];

export const sportAiSections = [
  {
    id: "from-the-top",
    title: "From the top",
    blocks: [
      {
        type: "paragraph",
        text: "When I was approached to join SportAI, the idea of the product was just a seed of what it is today. The existing team created a predictive AI that assigns a value to players before their next game. We later called that value Score+. When they discovered that Score+ performed better than its competitors, they decided to build an app around it.",
      },
      { type: "paragraph", text: "The team had many questions:" },
      {
        type: "list",
        items: [
          "Score+ was a powerful metric, but how can it be used in a product?",
          "How can its value be communicated?",
          "How can we use it to build tools that help fantasy players make more informed decisions in their league?",
        ],
      },
      {
        type: "paragraph",
        text: "The more questions they asked, the more SportAI’s potential came into focus. They began to define the problem: when it comes to fantasy sports, there is a need for a consumer tool that is simple and direct.",
      },
      { type: "paragraph", text: "The CTO summed it up best:" },
      {
        type: "quote",
        text: "“The tools out there are only understood via trickle down effects from published articles by analysts who crunch fantasy data full time. The larger consumer market only sees those results after the fact.” - Charlie Strohl (CTO)",
      },
      {
        type: "paragraph",
        text: "It was clear that the market needed a direct to consumer fantasy sports tool. A tool players trust and enjoy using. To fill that gap in the market was an exciting challenge, but it would need a strong brand design and an app built from scratch, so I decided to join.",
      },
    ],
  },
  {
    id: "design-ethos",
    title: "The Design Ethos",
    blocks: [
      {
        type: "paragraph",
        text: "We soon discussed how we wanted our app to be perceived in the eyes of the consumer. We saw the success that Robinhood had by simplifying the interfaces common to stock investing and felt there was something applicable here. Most fantasy sports apps are dense with statistics and terminology.",
      },
      {
        type: "pullquote",
        text: "What if SportAI took the opposite approach? Reduced instead of added?",
      },
      { type: "paragraph", text: "Here was our design ethos:" },
      {
        type: "principles",
        items: [
          {
            title: "Simple.",
            text: "As trite as the word has become in brand and UX design today, we still felt it was important to place an emphasis on it. Robinhood went simple and democratized market trading; we wanted SportAI to do the same and democratize fantasy sports by putting powerful, but easy to understand, tools in the hands of the every day player.",
          },
          {
            title: "Clean and bold.",
            text: "Companies like Nike do this well. Contrasting colors, large type, generous whitespace. We definitely took inspiration from a lot of their design work.",
          },
          {
            title: "Scalable.",
            text: "Every feature we create has the potential to grow and expand. We want to design our pages and components such that no addition requires a huge refactor.",
          },
        ],
      },
      {
        type: "paragraph",
        text: "These are the three things we talk about in almost every meeting together. While it can be a challenge to always achieve them, we do put in the effort.",
      },
    ],
  },
  {
    id: "breaking-ground",
    title: "Breaking Ground",
    blocks: [
      {
        type: "paragraph",
        text: "There was very little as far as product went when I joined. There was a logo and a rough mockup, both sharing a shade of brown that made me uncomfortable. If you ask me, it’s really tough to make brown look good in software, so updating that was our first order of business.",
      },
      {
        type: "paragraph",
        text: "But what color would we choose? That ended up being a simple decision. As simple as black and white actually. Our ethos for the company was simplicity after all, and we wanted to reflect that in the design. There’s something very familiar about black and white, like black lead on white paper. We figured, “Let’s start here, then add accents of color as we go on.” That was good enough for us - no need to complicate it while we’re moving fast.",
      },
      {
        type: "paragraph",
        text: "Very quickly, though, we added our first two accent colors: blue and red. Blue for success states and key points of information, red for errors and warnings.",
      },
      {
        type: "image",
        src: "/sportai/color-guidelines.webp",
        alt: "SportAI color system showing blue, neutral, and red palettes",
        caption: "Basic color guidelines",
        layout: "wide",
      },
      {
        type: "richParagraph",
        segments: [
          { text: "Next, we needed a font. I’d been following " },
          {
            text: "Rasmus Anderson on Twitter",
            href: "https://twitter.com/rsms",
          },
          { text: " for a while when he started tweeting about his development of " },
          { text: "Inter", href: "https://rsms.me/inter/" },
          {
            text: ". Of course, if you’re in the design world and know about fonts, you may know that Inter has become quite common, but we applied it before it became so ubiquitous and liked it for its crisp legibility.",
          },
        ],
      },
      {
        type: "image",
        src: "/sportai/font-guidelines.webp",
        alt: "SportAI typography guidelines using the Inter typeface",
        caption: "Title Font Guidelines",
        layout: "contained",
      },
    ],
  },
  {
    id: "home",
    title: "Home",
    blocks: [
      { type: "paragraph", text: "The homepage contains a few defined sections:" },
      {
        type: "list",
        items: [
          "Updates. A stack of cards showing daily updates that predict which players will do better than others in upcoming games.",
          "Explore. Fantasy tools go here as we add them. So far it has Compare Lineups and Salary Optimizer which I’ll write about later.",
          "Top Players by Score+. The top 10 players ranked by Score+.",
          "Top Players by Value. The top 10 players ranked by Value (essentially a ratio of salary and Score+).",
        ],
      },
      {
        type: "imageGroup",
        layout: "phones",
        images: [
          {
            src: "/sportai/home-updates.webp",
            alt: "SportAI home screen showing model updates and fantasy tools",
          },
          {
            src: "/sportai/home-players.webp",
            alt: "SportAI home screen showing players ranked by Value",
          },
        ],
      },
    ],
  },
  {
    id: "score-plus",
    title: "What is Score+?",
    blocks: [
      {
        type: "paragraph",
        text: "You’ll see Score+ mentioned often here so let’s define it. Score+ is SportAI’s in-house player performance predictor value.",
      },
      {
        type: "paragraph",
        text: "That’s a bit of a mouthful, but basically, every player has a Score+ assigned to them and it predicts how well (in a fantasy sports context) they will do in their next game.",
      },
      { type: "paragraph", text: "Score+ values update once a day." },
      {
        type: "image",
        src: "/sportai/score-plus.webp",
        alt: "Score+ launch graphic explaining the player performance predictor",
        layout: "wide",
      },
    ],
  },
  {
    id: "compare-lineups",
    title: "Compare Lineups",
    blocks: [
      {
        type: "paragraph",
        text: "Previously called “Optimize”, this was the feature that was mocked up before I joined the company. Here, users select two lineups and compare their chances of success in upcoming games.",
      },
      {
        type: "paragraph",
        text: "Every player’s Score+ gets added to their lineup’s total, then the app tells you which lineup has the higher total. So it is simple for now, but we plan to add features to it in the future.",
      },
      {
        type: "paragraph",
        text: "Before I redesigned it it was difficult to understand what the intended flow was. So I broke it down into three simple steps:",
      },
      {
        type: "numberedList",
        items: [
          "Select players for the first lineup",
          "Select players for the second lineup",
          "Compare the two",
        ],
      },
      {
        type: "paragraph",
        text: "After some rough drafts, I landed on this flow and created a Figma prototype:",
      },
      {
        type: "video",
        src: "/sportai/compare-lineups-flow.mp4",
        poster: "/sportai/compare-lineups-flow-poster.jpg",
        alt: "Screen recording of the Compare Lineups prototype flow",
        caption: "Optimize Selection Flow - Version 3",
        layout: "phoneFlow",
      },
      {
        type: "paragraph",
        text: "It allowed selecting players in “your” and “your opponent’s” lineup from a single view. Users could clearly see which players they selected at all times.",
      },
      {
        type: "paragraph",
        text: "I liked the idea of only having to swipe back and forth between the two, and still do, but due to engineering constraints brought up by the frontend engineer at the time, we went with a more straightforward approach. I’m happy we did, because it is quite simple to use and it was easy to develop.",
      },
      {
        type: "paragraph",
        text: "We limited the number of players you could insert into a lineup to five, but we didn’t set a minimum, meaning users could compare one player to five others. This isn’t uncommon. Users might be considering one really high scoring, expensive player or five average, cheaper players.",
      },
    ],
  },
  {
    id: "salary-optimizer",
    title: "Salary Optimizer",
    blocks: [
      {
        type: "paragraph",
        text: "The salary optimizer was our next big feature. It was a classic knapsack problem. Say a user wants a lineup of 5 players, but they can’t decide the best value lineup from a selection of 8 players that fit their fantasy budget. The backend team’s job is to solve that common question using Score+.",
      },
      {
        type: "paragraph",
        text: "But how do you design for a knapsack problem like this one? Well, I started by jotting down the parameters users would have to input.",
      },
      {
        type: "numberedList",
        items: [
          "Fantasy platform",
          "Salary Budget",
          "The players you’re considering",
          "The number of players you want in your final lineup",
        ],
      },
      {
        type: "paragraph",
        text: "Users need access to these variables every time they use this feature, so they need to be accessible before every use of the feature.",
      },
      {
        type: "imageGroup",
        layout: "notes",
        images: [
          {
            src: "/sportai/optimizer-notes.webp",
            alt: "Handwritten Salary Optimizer input notes",
          },
          {
            src: "/sportai/optimizer-sketch.webp",
            alt: "Hand-drawn Salary Optimizer interface sketch",
          },
        ],
      },
      {
        type: "paragraph",
        text: "I explored the idea of a bottom drawer with parameter inputs always available. This seemed like a good idea at the time because it reduced the number of pages to navigate...",
      },
      {
        type: "image",
        src: "/artifacts/sportai-optimize.webp",
        alt: "Early Salary Optimizer design with player search and a parameter drawer",
        caption: "One of the first design iterations for the Salary Optimizer. Searching players takes up the main area and the parameter inputs are in a drawer at the bottom.",
        layout: "wide",
      },
      {
        type: "paragraph",
        text: "... but we opted for a more straightforward design: a “menu” page. That way users can select their parameters, then those inputs get out of the way to let users focus on searching the players they’re considering.",
      },
      {
        type: "list",
        items: [
          "We color coordinate the fantasy platform selected with their respective company’s main color (green for DraftKings, blue for FanDuel).",
          "For the budget input we opt for a digit text field as opposed to a slider or an increment counter because it allows more granularity of values (i.e. salaries aren’t always divisible by 1000 or 100 or 10).",
          "The input descriptions change based on user inputs to better describe what’s happening when they change values.",
        ],
      },
      {
        type: "imageGroup",
        layout: "phones",
        images: [
          {
            src: "/sportai/optimizer-menu-draftkings.webp",
            alt: "Salary Optimizer menu configured for DraftKings",
          },
          {
            src: "/sportai/optimizer-menu-keyboard.webp",
            alt: "Salary Optimizer budget input with the number keyboard visible",
          },
        ],
      },
      {
        type: "paragraph",
        text: "Then onto the player selection. Here we keep some aspect of the bottom drawer to keep track of user’s current cost. If a user tries to move ahead with improper selections for any reason, toast errors are triggered to guide them.",
      },
      {
        type: "imageGroup",
        layout: "threePhones",
        images: [
          {
            src: "/sportai/optimizer-selection-empty.webp",
            alt: "Salary Optimizer player selection before making a choice",
          },
          {
            src: "/sportai/optimizer-selection-error.webp",
            alt: "Salary Optimizer player selection showing a toast error",
          },
          {
            src: "/sportai/optimizer-selection-ready.webp",
            alt: "Salary Optimizer player selection ready to optimize",
          },
        ],
      },
      {
        type: "paragraph",
        text: "In keeping with our design ethos, the Results were made to be as simple as possible. We’ll add to it over time, but for now it contains",
      },
      {
        type: "list",
        items: ["a description,", "a list of players,", "and the lineup’s cost."],
      },
      {
        type: "image",
        src: "/artifacts/sportai-results.webp",
        alt: "Salary Optimizer recommended lineup results",
        layout: "wide",
      },
      {
        type: "paragraph",
        text: "I gave the star header an animation for a bit of visual interest too.",
      },
      {
        type: "video",
        src: "/sportai/salary-optimizer-header.mp4",
        poster: "/sportai/salary-optimizer-header-poster.jpg",
        alt: "Animation of the Salary Optimizer star header",
        caption: "Header Animation.",
        layout: "contained",
      },
      {
        type: "note",
        title: "New Feature: Recommended Players",
        text: "Sometimes with knapsack problems you don’t always get the number of objects you wanted back. In the case of the Salary Optimizer, if a user wants 3 players back, but based on the players they are considering the optimal lineup can only return 2, we need a way to recommend a 3rd. This feature is in the works right now.",
      },
    ],
  },
  {
    id: "website",
    title: "Website",
    blocks: [
      {
        type: "image",
        src: "/sportai/website-beta.webp",
        alt: "Long-form SportAI teaser website for the beta",
        caption: "Teaser website for the beta",
        layout: "website",
      },
      {
        type: "image",
        src: "/sportai/website-release.webp",
        alt: "SportAI website for the first public app release",
        caption: "Updated site for the first release of the app",
        layout: "wide",
      },
    ],
  },
];

export const sportAiReviews = [
  "…app is butter smooth and has great graphs/visuals. ⭐⭐⭐⭐⭐ - ThomasCoiner",
  "…it’s intuitive, easy to use, I just hopped straight in and was looking at stats and top picks. Great design, will be using in the future for sure. ⭐⭐⭐⭐⭐ - Hunter Cowper",
  "I can tell the developers put a lot of effort and thought when designing the user interface of the app! ⭐⭐⭐⭐⭐ - JoeH19204826",
  "Absolutely blown away by the optimization. A must have for any NBA/NFL fans. ⭐⭐⭐⭐⭐ - Jeremy Sargent II",
  "Great starting feature set! Gonna be watching for what comes in future updates! ⭐⭐⭐⭐⭐ - peanutbutterandjenna",
];

export const sportAiGalleryGroups = [
  {
    id: "product-highlights",
    title: "Product highlights",
    items: [
      {
        type: "video",
        src: "/sportai/lineup-selection.mp4",
        poster: "/sportai/lineup-selection-poster.jpg",
        alt: "Screen recording of selecting players for a lineup in SportAI",
        caption: "Lineup selection.",
      },
      {
        type: "video",
        src: "/sportai/springy-buttons.mp4",
        poster: "/sportai/springy-buttons-poster.jpg",
        alt: "Screen recording showing SportAI buttons springing into place",
        caption: "Springy Buttons.",
      },
      {
        type: "video",
        src: "/sportai/swipe-to-delete.mp4",
        poster: "/sportai/swipe-to-delete-poster.jpg",
        alt: "Screen recording showing a swipe-to-delete interaction in SportAI",
        caption: "Swipe to delete.",
      },
      {
        src: "/artifacts/sportai-3d-phones.webp",
        alt: "SportAI player analytics shown on two iPhones",
        caption:
          "Player Profiles. Users can see basic stats and fantasy platform salaries. We list every player’s Score+ front and center and interactive bar charts accompany a list of game stats and metadata.",
        featured: true,
      },
      {
        src: "/artifacts/sportai-appstore.webp",
        alt: "SportAI App Store previews",
        caption: "App Store Previews",
      },
      {
        src: "/artifacts/sportai-total-results.webp",
        alt: "SportAI lineup comparison results",
        caption:
          "Compare Lineup Results. I went through a few iterations for this page but we landed on this one for it’s ability to fit on most screens and its easily digestible data which works well for sharing.",
      },
      {
        src: "/artifacts/sportai-weeks.webp",
        alt: "SportAI interactive weekly fantasy football statistics",
        caption: "Interactive Data Visualizations",
      },
    ],
  },
  {
    id: "marketing",
    title: "Marketing",
    items: [
      {
        src: "/sportai/nba-announcement.webp",
        alt: "NBA is here launch announcement",
        caption: "NBA Post (1/2)",
      },
      {
        src: "/sportai/league-toggle.webp",
        alt: "SportAI league toggle announcement",
        caption: "NBA Post (2/2)",
      },
      {
        src: "/sportai/fantasy-points-post.webp",
        alt: "Fantasy Points Visualization marketing post",
        caption: "Fantasy Points Visualization Post",
      },
      {
        src: "/sportai/injury-status-post.webp",
        alt: "SportAI injury status announcement",
        caption: "Injury Status Post (1/2)",
      },
      {
        src: "/sportai/injury-out-post.webp",
        alt: "SportAI player injury example",
        caption: "Injury Status Post (2/2)",
      },
      {
        src: "/sportai/rankings-post.webp",
        alt: "NFL conference rankings announcement",
        caption: "NFL Conference Rankings Post (1/2)",
      },
      {
        src: "/sportai/rankings-players-post.webp",
        alt: "NFL conference players ranking announcement",
        caption: "NFL Conference Players Post (2/2)",
      },
      {
        src: "/sportai/blog-post.webp",
        alt: "COVID-19 and the NFL Season blog post announcement",
        caption: "Blog Post Announcement",
      },
    ],
  },
  {
    id: "branding",
    title: "Branding",
    items: [
      {
        src: "/sportai/app-icon.webp",
        alt: "Black SportAI app icon",
        caption:
          "Logo/App Icon. I didn’t create the logo, but I cleaned it up a bit from it’s previous version (which used a brown color scheme and contained slight misalignments) then adjusted it for iOS.",
      },
      {
        src: "/sportai/branding-guidelines.webp",
        alt: "SportAI logo and type branding guidelines",
        caption: "Branding Guidelines",
        featured: true,
      },
      {
        src: "/artifacts/sportai-start-winning.webp",
        alt: "Start winning campaign for SportAI",
        caption: "Graphic for marketing use",
      },
    ],
  },
  {
    id: "early-concepts",
    title: "Early concepts",
    items: [
      {
        src: "/sportai/early-concepts.webp",
        alt: "Early SportAI account, settings, and player interface concepts",
        caption: "Account and Settings (Figma Prototype)",
        featured: true,
      },
      {
        src: "/sportai/flow-diagrams.webp",
        alt: "Early SportAI product flow diagrams in Figma",
        caption: "Early flow diagrams in Figma",
      },
    ],
  },
];
