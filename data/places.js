const createPlace = (id, city, region, country, coordinates, notes = {}) => ({
  id,
  city,
  region,
  country,
  coordinates,
  review:
    notes.review ||
    "Add your review, favorite details, and anything you want to remember about this place.",
});

// Your travel map. Coordinates are [latitude, longitude].
export const places = [
  // Florida
  createPlace("miami", "Miami", "Florida", "United States", [25.7617, -80.1918], {
    review:
      "I was born and raised in Miami, and lived here all of my life. It's a unique place with it's beaches, mix of cultures, and an extravagance you can only find in a select few places in the world. It's got it's good and it's bad, and sometimes I've felt like a fish out of water in it, but it's still home and the place I know most like the back of my hand. I'm always impressed by the elegant integration of the water with the cityscape.",
  }),
  createPlace("ft-lauderdale", "Ft. Lauderdale", "Florida", "United States", [26.1224, -80.1373], {
    review:
      "Later on in life, we moved closer to Ft. Lauderdale. It's no Miami, but it's an up and coming city with plenty of great beaches and the popping Las Olas boulevard."
  }),
  createPlace("boca-raton", "Boca Raton", "Florida", "United States", [26.3683, -80.1289],
    {
      review:
        "Everyone's grandmother lives in Boca. It's a great place to retire if you can afford it. Clean streets, beautiful beaches, and entitled drivers make it an interesting place to visit."
    }),
  createPlace("delray-beach", "Delray Beach", "Florida", "United States", [26.4615, -80.0728], {
    review:
      "Moved in here in 2026. Hit up Atlantic Ave for the only fun thing here to do. Or, if you're into golf, find a course and hit away. There's plenty to choose from.",
  }),
  createPlace("sebastian", "Sebastian", "Florida", "United States", [27.8164, -80.4706], {
    review:
      "I skydived here with my uncle and, if you can believe it, my mom. Since this is a small coastal town, you can see Florida land and the beautiful blueness of the ocean from the sky.",
  }),
  createPlace("melbourne", "Melbourne", "Florida", "United States", [28.0836, -80.6081], {
    review:
      "Come here to see NASA and SpaceX launches. They're incredible. Or, just enjoy the beach, which is a bit unique because you can drive your car on parts of it.",
  }),
  createPlace("orlando", "Orlando", "Florida", "United States", [28.5383, -81.3792], {
    review:
      "I went to University of Central Florida here, then called Orlando home for almost 8 years afterward. It's a great city if you know where to go. Others might find it boring once they're done with Disney and Universal. But it's got tons of great coffee shops, my favorites being Lineage and Haan Coffee, and some of the restaurants are incredible, like The Strand.",
  }),
  createPlace("st-augustine", "St. Augustine", "Florida", "United States", [29.9012, -81.3124], {
    review:
      "It's America's oldest city, so it's worth exploring a bit. I was here for a friend's bachelor party when about 12 of us guys got mopeds and took the city. My moped did slip on some gravel and subsequently burst into massive flames, though. I have photo evidence.",
  }),
  createPlace("tampa", "Tampa", "Florida", "United States", [27.9506, -82.4572], {
    review:
      "Nice city, though I haven't found much to do here yet other than visit some farmer's markets and experience the food hall. I'm sure it's like Orlando in that you have to figure out where the good spots are.",
  }),
  createPlace("st-petersburg", "St. Petersburg", "Florida", "United States", [27.7676, -82.6403], {
    review:
      "Nice town not too far from Tampa, just a quick drive over the water. Great beach and coffee shops.",
  }),
  createPlace("panama-city", "Panama City", "Florida", "United States", [30.1588, -85.6602], {
    review:
      "Panama City and it's surrounding little towns like Destin, Alys Beach, and Rosemary Beach are really unique little beach towns with their own unique vibes. Alys beach has a mandate to make all buildings white and manicured so it's quite Moorish and Mediterranean, and Rosemary Beach is like a New Orleans' French Quarter style area.",
  }),

  // United States
  createPlace("serenbe", "Serenbe", "Georgia", "United States", [33.5189, -84.7386], {
    review:
      "My cousin had a wedding here just outside of Atlanta. It's a cool little planned development with farmed foods and a nice outdoor lifestyle.",
  }),
  createPlace("savannah", "Savannah", "Georgia", "United States", [32.0809, -81.0912], {
    review:
      "I drove here on a whim when I wanted to explore a city outside of Florida for a weekend. It's quite old, but very pretty. I distinctly remember the riverboats. I stayed in a log cabin in a nearby town to detox from tech.",
  }),
  createPlace("boone-sugar-mountain", "Boone (Sugar Mountain)", "North Carolina", "United States", [36.1334, -81.8718], {
    review:
      "Skied here for the first time for a friend's bachelor party. Stayed in a log cabin with a group of about 10 guys. Great time.",
  }),
  createPlace("virginia-beach", "Virginia Beach", "Virginia", "United States", [36.8529, -75.978], {
    review:
      "Really great beach-town vibes here. Not much to do other than enjoy laying on the sun, but the restaurant in the Cavalier Hotel is delicious.",
  }),
  createPlace("washington-dc", "Washington, D.C.", "Washington, D.C.", "United States", [38.9072, -77.0369], {
    review:
      "Lived here for 2 years after graduating in the Van Ness area. Took the metro to my first big boy job at GEICO in Bethesda, Maryland. Cool city, great museums.",
  }),
  createPlace("shenandoah-mountains", "Shenandoah Mountains", "Virginia", "United States", [38.5231, -78.4348], {
    review:
      "Took a little trip here with a friend back when I was living in Washington D.C. It was nice to get up there to remember what absolute silence sounds like again.",
  }),
  createPlace("new-york-city", "New York City", "New York", "United States", [40.7128, -74.006], {
    review:
      "Visited my cousin who lived here with her husband. Another time I went with my mom and step brother. On another occasion came here for a college group trip. The first time I tried a revolving door was here and it didn't go well. I realized that when I got in I joined some random stranger, and upon realizing, I tried to back out but it was too late. So both her and I bumped our heads into the door because of me. Anyway, amazing city. I love going every few years.",
  }),
  createPlace("brooklyn", "Brooklyn", "New York", "United States", [40.6782, -73.9442], {
    review: "Nice to get away from Manhattan at times for some good food or hangs in Brooklyn.",
  }),
  createPlace("hartford", "Hartford", "Connecticut", "United States", [41.7658, -72.6734], {
    review:
      "My mom lived here for a couple years and it was a nice place to visit, especially during the winter since I usually lived in the Florida heat.",
  }),
  createPlace("mystic", "Mystic", "Connecticut", "United States", [41.3542, -71.9665], {
    review: "Cool little water town.",
  }),
  createPlace("boston", "Boston", "Massachusetts", "United States", [42.3601, -71.0589], {
    review: "One of my favorite American cities. Plenty to do and just good vibes all around.",
  }),
  createPlace("salem", "Salem", "Massachusetts", "United States", [42.5195, -70.8967], {
    review:
      "I was impressed by this little witch town. Lots of history here. And you wouldn't expect the amount of things to do here. The Peabody Essex museum was especially impressive. It contains incredibly intricate Japanese and Chinese art and even has a bunch of maritime based art and curiosities as well. One of my favorite things here is the real life giant clamshell and the jaw of a sperm whale.",
  }),
  createPlace("manchester", "Manchester", "New Hampshire", "United States", [42.9956, -71.4548], {
    review: "Little quiet town with not much to do.",
  }),
  createPlace("milwaukee", "Milwaukee", "Wisconsin", "United States", [43.0389, -87.9065], {
    review:
      "Visited Milwaukee on a visit for work. We were talking to some customers who were building a new city public museum. Cool city but it was a bit quiet with it being the middle of the work day.",
  }),
  createPlace("denver", "Denver", "Colorado", "United States", [39.7392, -104.9903], {
    review:
      "I loved Denver. I have plenty of friends over there so it's never a dull moment. The amount of hiking available is really nice.",
  }),
  createPlace("rocky-mountain-national-park", "Rocky Mountain National Park", "Colorado", "United States", [40.3428, -105.6836], {
    review: "Good hikes with great views.",
  }),
  createPlace("boulder", "Boulder", "Colorado", "United States", [40.015, -105.2705], {
    review: "Like a mini, quaint, Denver, with old town vibes.",
  }),
  createPlace("san-antonio", "San Antonio", "Texas", "United States", [29.4241, -98.4936], {
    review:
      "I was extremely surprised by how much I enjoyed this city. From the surface, it seems pretty plain. But walk down to Riverwalk and suddenly the city seems to open up. A million eateries lines the narrow river that cuts through this city and it's very fun to explore.",
  }),
  createPlace("austin", "Austin", "Texas", "United States", [30.2672, -97.7431], {
    review:
      "I go here for work since Procore's new headquarters is here. It's a cool city with great live music, but I haven't explored much outside of downtown. Aba Austin is my favorite restaurant there. The Sticky Date Cake for dessert is absolutely nuts.",
  }),
  createPlace("houston", "Houston", "Texas", "United States", [29.7604, -95.3698], {
    review:
      "Big, sprawling metropolis if there ever was one. Too big to explore in a day or a weekend. And you definitely need a car.",
  }),
  createPlace("los-angeles", "Los Angeles", "California", "United States", [34.0522, -118.2437], { review: "Not my favorite Californian city, but it's surrounding areas are pretty cool. I went on a whim with a friend who was going to a wedding. He introduced me to a bunch of his friends who were in the film industry. We also had one of the greatest nights of standup comedy where we saw Nikki Glaser, Anthony Jeselnik, Jeff Ross, Pete Holmes, Andrew Santino, and more in an open air comedy club. We weren't expecting a night that incredible." }),
  createPlace("santa-barbara", "Santa Barbara", "California", "United States", [34.4208, -119.6982], { review: "Love this town. It's clean, put together, and the beach is beautiful. Really worth visiting if you're driving along PCH." }),
  createPlace("san-francisco", "San Francisco", "California", "United States", [37.7749, -122.4194], { review: "Mixed feelings about SF for me. Many areas are some of the most beautiful of any city I've seen, but some are rougher around the edges. Either way, it's still incredibly special if only for the amount of technical talent and quality of software that comes out of there. Great food too." }),
  createPlace("monterey", "Monterey", "California", "United States", [36.6002, -121.8947], { review: "This place is special to me. It's a beautiful town along a mountainous area, but it's on the coast, so you can head out on a boat and see some right whales as well. An incredible experience. Nearby is also Carmel-by-the-Sea which is very much worth checking out." }),
  createPlace("san-jose", "San Jose", "California", "United States", [37.3382, -121.8863], { review: "Nice area of California. Great to drive around. Healthy people, beautiful neighborhoods." }),
  createPlace("cupertino", "Cupertino", "California", "United States", [37.323, -122.0322], { review: "Being the Apple fan that I am, I had to stop by here to visit their beautiful ring-shaped campus." }),
  createPlace("sausalito", "Sausalito", "California", "United States", [37.8591, -122.4853], { review: "Take the Golden Gate from SF to land here in Sausalito. Great for a nighttime dinner or some boutique shopping. I loved this beachy little area." }),
  createPlace("glacier-national-park", "Glacier National Park", "Montana", "United States", [48.7596, -113.787], { review: "One of the most incredible places on earth, as far I as I know. Beautiful mountains, wildlife, and water that's as blue as Gatorade. I need to go back." }),
  createPlace("seattle", "Seattle", "Washington", "United States", [47.6062, -122.3321], { review: "Cool city with plenty to do. It's best feature is how close to some incredible nature preserves it is. Also, the air was crisper here than anywhere else I've explored." }),
  createPlace("mount-rainier-national-park", "Mount Rainier National Park", "Washington", "United States", [46.8523, -121.7603], { review: "Like, the biggest thing I've ever seen. I was in awe of Rainier. The closer I got to it, the more in awe I became. Every American should make a visit here. And hike if they can. Pure majesty." }),
  createPlace("olympic-national-park", "Olympic National Park", "Washington", "United States", [47.8021, -123.6044], { review: "Close to Mount Rainier National Park in terms of majesty. Just a sick place to hike overall." }),

  // Caribbean and Mexico
  createPlace("piste", "Pisté", "Yucatán", "Mexico", [20.682, -88.597], { review: "The home of Chichén Itzá. An incredible city of pyramids and ancient ruins. Came here with a friend and we enjoyed driving over here from Cancún." }),
  createPlace("cancun", "Cancún", "Quintana Roo", "Mexico", [21.1619, -86.8515], { review: "Great place to enjoy a hotel resort retreat. Not crazy expensive if you get something that's all-inclusive." }),
  createPlace("falmouth", "Falmouth", "Trelawny", "Jamaica", [18.4934, -77.6559], { review: "Nice drop-off point for a cruise I went on. Good-looking beach and pretty busy touristy area." }),

  // Europe
  createPlace("dublin", "Dublin", "Leinster", "Ireland", [53.3498, -6.2603], { review: "One of my favorite cities. Visited as many pubs as my friend and I could, and all were enjoyable in their own unique way. The Guinness HQ is also a treat, with production quality as high as anything you'd find in Disney World. The best memory though, was going to the Rugby National Tournament on a whim, finding out about it and booking tickets in the same day." }),
  createPlace("galway", "Galway", "Connacht", "Ireland", [53.2707, -9.0568], { review: "Nice coastal town. It was quiet when we went, but it was a good place to stay while we waited to visit the Cliffs of Moher which were by far the most majestic cliffs I've ever seen." }),
  createPlace("doolin", "Doolin", "County Clare", "Ireland", [53.015, -9.377], { review: "The town nearest to the Cliffs of Moher. Met a woman who owned a wool sweater shop. Lovely woman. We got very close to her." }),
  createPlace("paris", "Paris", "Île-de-France", "France", [48.8566, 2.3522]),
  createPlace("barcelona", "Barcelona", "Catalonia", "Spain", [41.3874, 2.1686]),
  createPlace("valencia", "Valencia", "Valencian Community", "Spain", [39.4699, -0.3763]),
  createPlace("alicante", "Alicante", "Valencian Community", "Spain", [38.3452, -0.481]),
  createPlace("denia", "Dénia", "Valencian Community", "Spain", [38.8408, 0.1057]),
  createPlace("altea", "Altea", "Valencian Community", "Spain", [38.5989, -0.051]),
  createPlace("calpe", "Calpe", "Valencian Community", "Spain", [38.644, 0.0445]),
  createPlace("venice", "Venice", "Veneto", "Italy", [45.4408, 12.3155]),
  createPlace("udine", "Udine", "Friuli-Venezia Giulia", "Italy", [46.0711, 13.2346]),
  createPlace("trieste", "Trieste", "Friuli-Venezia Giulia", "Italy", [45.6495, 13.7768]),
  createPlace("gorizia", "Gorizia", "Friuli-Venezia Giulia", "Italy", [45.9402, 13.621]),
  createPlace("postojna", "Postojna", "Inner Carniola", "Slovenia", [45.7744, 14.2153]),
  createPlace("rhodes", "Rhodes", "South Aegean", "Greece", [36.4341, 28.2176]),

  // Israel
  createPlace("jerusalem", "Jerusalem", "Jerusalem District", "Israel", [31.7683, 35.2137]),
  createPlace("tel-aviv", "Tel Aviv", "Tel Aviv District", "Israel", [32.0853, 34.7818]),
  createPlace("haifa", "Haifa", "Haifa District", "Israel", [32.794, 34.9896]),
  createPlace("tiberias", "Tiberias", "Northern District", "Israel", [32.7922, 35.5312]),
  createPlace("eilat", "Eilat", "Southern District", "Israel", [29.5577, 34.9519]),
  createPlace("caesarea", "Caesarea", "Haifa District", "Israel", [32.518, 34.9045]),
  createPlace("beer-sheva", "Be'er Sheva", "Southern District", "Israel", [31.253, 34.7915]),
];
