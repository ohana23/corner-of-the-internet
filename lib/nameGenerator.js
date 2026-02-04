// Ancient Egyptian names
const egyptianNames = [
  "Amenhotep",
  "Nefertiti",
  "Ramesses",
  "Cleopatra",
  "Tutankhamun",
  "Akhenaten",
  "Hatshepsut",
  "Thutmose",
  "Khufu",
  "Imhotep",
  "Ankhesenamun",
  "Meritaten",
  "Seti",
  "Ptahhotep",
  "Senusret",
  "Sobekneferu",
  "Nefertari",
  "Khafre",
  "Menkaure",
  "Ahmose",
  "Horemheb",
  "Nebamun",
  "Userhat",
  "Meketre",
];

// Medieval Jewish Rabbi names
const rabbiFirstNames = [
  "Eli",
  "Moshe",
  "Shlomo",
  "Yitzhak",
  "Avraham",
  "Yaakov",
  "Shimon",
  "Yehuda",
  "Rashi",
  "Maimon",
  "Gamliel",
  "Hillel",
  "Shammai",
  "Akiva",
  "Meir",
  "Tarfon",
  "Eliezer",
  "Yochanan",
  "Nachman",
  "Zeira",
  "Ashi",
  "Rava",
  "Abaye",
  "Shmuel",
];

const rabbiTitles = [
  "the Elder",
  "the Wise",
  "the Pious",
  "ben David",
  "ben Yosef",
  "of Cordoba",
  "of Toledo",
  "of Babylon",
  "the Scribe",
  "the Teacher",
  "HaGadol",
  "HaKatan",
  "the Blessed",
  "of the Scroll",
  "the Learned",
  "ben Shlomo",
  "of Sefarad",
  "the Righteous",
];

// Elden Ring style fantasy names
const eldenFirstNames = [
  "Malekith",
  "Godfrey",
  "Radagon",
  "Maliketh",
  "Morgott",
  "Mohg",
  "Miquella",
  "Malenia",
  "Ranni",
  "Radahn",
  "Rykard",
  "Godwyn",
  "Gurranq",
  "Gideon",
  "Vyke",
  "Loretta",
  "Astel",
  "Placidusax",
  "Fortissax",
  "Lansseax",
  "Nepheli",
  "Rogier",
  "Sellen",
  "Jerren",
  "Restorath",
  "Vargram",
  "Thornyx",
  "Mordenth",
  "Zephyrix",
  "Corvanus",
  "Drakthos",
  "Seraphyx",
];

const eldenTitles = [
  "the Devourer",
  "the Grafted",
  "the Omen",
  "the Starscourge",
  "the Blade of Miquella",
  "the All-Knowing",
  "Lord of Blood",
  "the Fell",
  "the Unalloyed",
  "the Golden",
  "the Blasphemous",
  "of the Void",
  "the Undying",
  "Keeper of Flame",
  "the Ashen",
  "of the Erdtree",
  "the Accursed",
  "Bane of Stars",
  "the Eternal",
  "Scourge of Realms",
  "the Deathless",
  "Consumer of Worlds",
  "the Forgotten",
  "Lord of Cinders",
  "the Eclipse",
  "Herald of Ruin",
];

// Cursor colors - vibrant and distinct
const colors = [
  "#FF6B6B", // coral red
  "#4ECDC4", // teal
  "#FFE66D", // yellow
  "#95E1D3", // mint
  "#F38181", // salmon
  "#AA96DA", // lavender
  "#FCBAD3", // pink
  "#A8D8EA", // light blue
  "#FF9F43", // orange
  "#6C5CE7", // purple
  "#00CEC9", // cyan
  "#FD79A8", // hot pink
  "#00B894", // green
  "#E17055", // burnt orange
  "#0984E3", // blue
  "#D63031", // red
  "#74B9FF", // sky blue
  "#A29BFE", // periwinkle
  "#55EFC4", // seafoam
  "#FDCB6E", // mustard
];

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export function generateName() {
  const nameType = Math.floor(Math.random() * 3);

  switch (nameType) {
    case 0:
      // Egyptian name
      return getRandomItem(egyptianNames);
    case 1:
      // Rabbi name with title
      return `${getRandomItem(rabbiFirstNames)} ${getRandomItem(rabbiTitles)}`;
    case 2:
      // Elden Ring style
      return `${getRandomItem(eldenFirstNames)}, ${getRandomItem(eldenTitles)}`;
    default:
      return getRandomItem(egyptianNames);
  }
}

export function generateColor() {
  return getRandomItem(colors);
}

export function generateIdentity() {
  return {
    name: generateName(),
    color: generateColor(),
  };
}
