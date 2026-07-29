export const geicoMeta = {
  title: "Working at GEICO",
  eyebrow: "Case study",
  summary:
    "Full-stack engineering, design advocacy, and team leadership across GEICO’s customer and employee experiences.",
  details: [
    { label: "Date", value: "June 24, 2019 → June 29, 2021" },
    { label: "Roles", value: "Full Stack Engineer, UI, UX" },
    { label: "Location", value: "Washington, D.C." },
    {
      label: "Skills & Tools",
      value:
        "React, JavaScript, C#, SQL, frontend and backend development, UI/UX, unit tests, pitch deck design, mentoring",
    },
  ],
};

export const geicoNav = [
  { id: "design", label: "Design" },
  { id: "react-nanodegree", label: "React Nanodegree" },
  { id: "hackathon", label: "Hackathon" },
];

export const geicoSections = [
  {
    id: "design",
    title: "Design",
    blocks: [
      {
        type: "paragraph",
        text: "I was a Fullstack Engineer at GEICO, not a designer, but I focused on and advocated for design as much as I could. Here are a few ways I involved myself with design there:",
      },
      {
        type: "nestedRichList",
        items: [
          {
            segments: [
              {
                text: "Since I knew the engineering aspects of what our team could build and I had an interest in design, I became an ambassador for my team to the GEICO Design Kit team. I proposed component improvements weekly and coded them up when approved. A few examples of UX features I proposed and shipped are:",
              },
            ],
            children: [
              [
                {
                  text: "Automatic-scroll to errors and alerts. ",
                  strong: true,
                },
                {
                  text: "I suggested we scroll to errors and alerts on each form, especially on mobile, since users couldn’t tell if something went wrong when submitting.",
                },
              ],
              [
                {
                  text: "Change text buttons to visual cards. ",
                  strong: true,
                },
                {
                  text: "Form buttons were mostly lists of text options which weren’t easily scannable. I worked with the design team to create new buttons with illustrations and icons that made them more visually appealing and scannable. The illustrations were often dynamic, changing based on the user’s actual vehicle.",
                },
              ],
              [
                {
                  text: "Click outside of message modals to close them. ",
                  strong: true,
                },
                {
                  text: "This is a common design pattern that GEICO’s modals were lacking. I built a parameter to the modal component that allowed it.",
                },
              ],
              [
                {
                  text: "Replace Toggles with Checkboxes where applicable. ",
                  strong: true,
                },
                {
                  text: "Toggles imply an immediate state change",
                  href: "https://www.nngroup.com/articles/toggle-switch-guidelines/",
                },
                {
                  text: ", checkboxes are more appropriate if a form requires a submission for the change to go into effect.",
                },
              ],
              [
                {
                  text: "Shorten email input fields. ",
                  strong: true,
                },
                {
                  text: "They were full page-width before, ",
                },
                {
                  text: "way too long for the majority of email addresses",
                  href: "https://www.freshaddress.com/blog/long-email-addresses/",
                },
                { text: "." },
              ],
              [{ text: "More..." }],
            ],
          },
          {
            segments: [
              {
                text: "The Senior Engineer on my team wanted to propose building a Natural Language Processing Chatbot (or, a “Conversational User Interface”) to upper management. He created a proposal deck to present, but I thought the deck could be improved and simplified. After all, a cutting-edge feature should have a cutting-edge proposal. So I completely redesigned the deck, added modern animations, icons and typography for a sleek look. After returning the deck back to him, I got a “Holy sh*t” in response which is my favorite reaction. The proposal went well and management gave the go-ahead to build out the project.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "react-nanodegree",
    title: "React Nanodegree",
    blocks: [
      {
        type: "paragraph",
        text: "With GEICO’s sponsorship, I earned a Udacity Nanodegree for 3 subjects: React, Redux, and React Native.",
      },
      {
        type: "paragraph",
        text: "Here are 2 of the 3 final projects I created during the course (I omitted the first one since its repo doesn’t have a visual. You can find it on my GitHub if you’re curious.). The emphasis on these projects was on engineering and not on design, so I kept things very simple:",
      },
      {
        type: "richNumberedList",
        items: [
          [
            {
              text: "would-you-rather",
              href: "https://github.com/ohana23/would-you-rather",
              strong: true,
            },
            {
              text: ". A classic Would You Rather? game built with React. Answer people’s questions and submit your own.",
            },
          ],
          [
            {
              text: "mobile-flashcards",
              href: "https://github.com/ohana23/mobile-flashcards",
              strong: true,
            },
            {
              text: ". A flashcards iOS app built with React Native. Create flashcard decks, then quiz yourself.",
            },
          ],
        ],
      },
      {
        type: "image",
        src: "/geico/react-nanodegree.webp",
        alt: "Udacity certificate awarded to Daniel Ohana for completing the React Nanodegree program",
        caption: "React Nanodegree certificate",
        layout: "wide",
      },
    ],
  },
  {
    id: "hackathon",
    title: "Hackathon",
    blocks: [
      {
        type: "paragraph",
        text: "I led a team to win GEICO’s annual internal hackathon. It was a simple mobile app prototype we called Pocket Gecko that acted as an internal information board for GEICO employees and campus visitors, including an up-to-date events page, a maps feature if you got lost (the main headquarters can be a confusing series of homogenous hallways), a weekly cafeteria menu and more.",
      },
      {
        type: "richParagraph",
        segments: [
          {
            text: "Since my 5 teammates didn’t have experience in the tools we decided on, I taught them the basics of Figma and even ",
          },
          {
            text: "version control with this document",
            href: "https://dannyohana.notion.site/p/3915abb1eb87405193e104be906eaa0d",
          },
          { text: "." },
        ],
      },
      {
        type: "paragraph",
        text: "We demoed to multiple department directors and the Vice President of IT and eventually won 1st place (although I have a funny story about that—feel free to reach out directly for a laugh).",
      },
    ],
  },
];
