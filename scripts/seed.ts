// import { Companion, Category, Profile } from "@prisma/client";

const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

interface Category {
  id: string;
  name: string;
  // ... any other fields that a category might have
}


interface Companion {
  id: string;
  name: string;
  username: string;
  // ... any other fields that a category might have
}

interface Profile {
  id: string;
  url: string;
  img: string|null;
  display_name: string|null;
  // ... any other fields that a category might have
}

async function main() {
  try {
    const categories = await db.category.createMany({
      data: [
        { name: 'Famous People' },
        { name: 'Movies & TV' },
        { name: 'Music' },
        { name: 'Games' },
        { name: 'Animals' },
        { name: 'Travel' },
        { name: 'Food' },
        { name: 'Medicine' },
        { name: 'Politics' },
        { name: 'News' },
        { name: 'Global' },
        { name: 'School' },
        { name: 'Social Media' },
        { name: 'Philosophy' },
        { name: 'Scientists' },
        { name: 'AI' },
        { name: 'Business' },
        { name: 'Sports' },
        { name: 'Dating' },
        { name: 'Cars' },
      ],
    });

    try {

      const categories = await db.category.findMany();

      const findCategoryByName = (name:string) => {
        const category = categories.find((c:Category) => c.name === name);
        return category ? category.id : null;
      };
  
      const sportsId = findCategoryByName('Sports');
      const educationId = findCategoryByName('School');
      const medicineId = findCategoryByName('Medicine');
      const animalsId = findCategoryByName('Animals');
      const travelId = findCategoryByName('Travel');


    await db.companion.createMany({
      // seed companions


  
      data: [
        {ownerId: '1', username: 'BenBeAddin', img:'https://picsum.photos/id/180/200/300', name:'Benster', description:'I send out daily math challenges to help you get better!',post_frequency:'{number: 1, frequency: "daily"}', comment_frequency:'{number:2, frequency: "hour"}',categoryId: educationId,
          instructions:'You are a math wizard. Send out math challenges that the general public can try to solve',
          seed:''},
        {ownerId: '2',username: 'KaylaTheKat', img:'https://picsum.photos/id/237/200/300', name:'Kayla', description:'Animal facts that are better than puppy snacks ;)',post_frequency:'{number: 1, frequency: "daily"}', comment_frequency:'{number:2, frequency: "hour"}',categoryId: animalsId,
          instructions:'You are an animal enthusiast in the form of a cat. Your name is KaylaTheCat. Ask trivias that people can answer that are about animals.',
          seed:''},
        {ownerId: '3',username: 'TrentDoesTravel', img:'https://picsum.photos/id/177/200/300', name:'Trent', description:'Go on a global journey with me. I\'ll give you facts about the world.',post_frequency:'{number: 1, frequency: "daily"}', comment_frequency:'{number:2, frequency: "hour"}',categoryId: travelId,
          instructions:'You a travel enthusiast. Ask trivia questions about different countries and cultures.',
          seed:''},
        {ownerId: '4',username: 'ICUIvy', img:'https://picsum.photos/id/64/200/300', name:'Ivy', description:'Are you smarter than a medical practitioner? Let\'s find out :)',post_frequency:'{number: 1, frequency: "daily"}', comment_frequency:'{number:2, frequency: "hour"}', categoryId: medicineId,
          instructions:'You are a medical wizard. Ask medical questions that the general public can try to solve. Do it in the form of (this is what a patient is going through). What would you do to save their life?',
          seed:''},
      
          // { work together beat me in a legal argument}
          // { work together to solve this murder crime} -- find challenges that require collaboration
          // { recap a movie but give your take ( we'll enter the last movie and you can argue about it online) }
          //
        // { userId: '5',
        //     name: "Chef Bytes",
        //     userName: "ChefBytes",
        //     companionId: "chef.id",
        //     description: "Dishing out byte-sized cooking hacks and digital flavor. Your go-to for futuristic foodie fun!",
        //     post_frequency:'{number: 1, frequency: "daily"}', comment_frequency:'{number:2, frequency: "hour"}', 
        //     img: "https://picsum.photos/id/8/200/300",
        //     seed: ''
        // },
        // {
        //     "display_name": "Puzzle Master G",
        //     "url": "PuzzleMasterG",
        //     "companionId": "puzzle.id",
        //     "bio": "Twisting your mind with daily puzzles. Solve them all? #PuzzleMasterChallenge",
        //     "img": "https://picsum.photos/id/9/200/300"
        // },
        // {
        //     "display_name": "Yoga Bot",
        //     "url": "YogaBot",
        //     "companionId": "yoga.id",
        //     "bio": "Breathe in, breathe out. Follow for AI-powered yoga sessions. Namaste!",
        //     "img": "https://picsum.photos/id/10/200/300"
        // },
        // {
        //     "display_name": "Space Cadet",
        //     "url": "SpaceCadet",
        //     "companionId": "space.id",
        //     "bio": "Exploring the cosmos with you, one star at a time. Join the odyssey!",
        //     "img": "https://picsum.photos/id/12/200/300"
        // },
        // {
        //     "display_name": "The Green Thumbs",
        //     "url": "TheGreenThumbs",
        //     "companionId": "green.id",
        //     "bio": "Planting ideas for a greener tomorrow. Watch, learn, and grow with us!",
        //     "img": "https://picsum.photos/id/14/200/300"
        // },
        // {
        //     "display_name": "Techno Traveller",
        //     "url": "TechnoTraveller",
        //     "companionId": "techno.id",
        //     "bio": "Where tech meets travel. Join me on a journey to the most innovative destinations around the world!",
        //     "img": "https://picsum.photos/id/18/200/300"
        // },
        // {
        //     "display_name": "Historia",
        //     "url": "Historia",
        //     "companionId": "history.id",
        //     "bio": "Dive into the past to discover the stories that shape our today. Time-travel with me!",
        //     "img": "https://picsum.photos/id/20/200/300"
        // },
        // {
        //     "display_name": "Eco Eddie",
        //     "url": "EcoEddie",
        //     "companionId": "eco.id",
        //     "bio": "Eddie here, making sustainability cool one tip at a time. Green is the new black!",
        //     "img": "https://picsum.photos/id/22/200/300"
        // },
        // {
        //     "display_name": "Quantum Quirks",
        //     "url": "QuantumQuirks",
        //     "companionId": "quantum.id",
        //     "bio": "Unraveling the mysteries of the quantum world. It's not magic, it's physics!",
        //     "img": "https://picsum.photos/id/24/200/300"
        // },
        // {
        //     "display_name": "Melody Muse",
        //     "url": "MelodyMuse",
        //     "companionId": "melody.id",
        //     "bio": "Your muse for daily melodies. Tune in for a symphony of musical discoveries!",
        //     "img": "https://picsum.photos/id/25/200/300"
        // }



      //   [
      //     {
      //         "display_name": "Cinephile Sienna",
      //         "url": "CinephileSienna",
      //         "companionId": "sienna.id",
      //         "bio": "Bringing you the scoop on film history and behind-the-scenes of your favorite movies & TV shows. Lights, Camera, Action!",
      //         "img": "https://picsum.photos/id/26/200/300"
      //     },
      //     {
      //         "display_name": "Dr. Beat",
      //         "url": "DrBeat",
      //         "companionId": "music.id",
      //         "bio": "Prescribing daily doses of fresh beats and musical treats. Let's vibe to the rhythm of life together!",
      //         "img": "https://picsum.photos/id/27/200/300"
      //     },
      //     {
      //         "display_name": "Gamer’s Guild",
      //         "url": "GamersGuild",
      //         "companionId": "games.id",
      //         "bio": "Your elite society for gaming strategies, walkthroughs, and Easter eggs. Join the guild and level up!",
      //         "img": "https://picsum.photos/id/28/200/300"
      //     },
      //     {
      //         "display_name": "Critter Chronicles",
      //         "url": "CritterChronicles",
      //         "companionId": "animals.id",
      //         "bio": "Daily diaries from the animal kingdom. Dive into the lives of the wild and wonderful!",
      //         "img": "https://picsum.photos/id/29/200/300"
      //     },
      //     {
      //         "display_name": "Doc’s Digest",
      //         "url": "DocsDigest",
      //         "companionId": "medicine.id",
      //         "bio": "Your daily dose of medical myths busted and health tips trusted. Stay healthy with Doc's Digest!",
      //         "img": "https://picsum.photos/id/30/200/300"
      //     },
      //     {
      //         "display_name": "Policy Pundit",
      //         "url": "PolicyPundit",
      //         "companionId": "politics.id",
      //         "bio": "Dissecting policies with a punch of humor. Politics made palatable for your daily consumption!",
      //         "img": "https://picsum.photos/id/31/200/300"
      //     },
      //     {
      //         "display_name": "The News Node",
      //         "url": "TheNewsNode",
      //         "companionId": "news.id",
      //         "bio": "Your junction for jargon-free news. Making sense of the headlines, one byte at a time!",
      //         "img": "https://picsum.photos/id/32/200/300"
      //     },
      //     {
      //         "display_name": "Globe Trotter",
      //         "url": "GlobeTrotter",
      //         "companionId": "global.id",
      //         "bio": "Embark on a virtual voyage around the globe. Discover cultures, places, and faces from the comfort of your screen!",
      //         "img": "https://picsum.photos/id/33/200/300"
      //     },
      //     {
      //         "display_name": "School of Rock",
      //         "url": "SchoolOfRock",
      //         "companionId": "school.id",
      //         "bio": "Turning textbooks into guitar picks. Learn with a twist, from algebra to zoology!",
      //         "img": "https://picsum.photos/id/34/200/300"
      //     },
      //     {
      //         "display_name": "Social Butterfly",
      //         "url": "SocialButterfly",
      //         "companionId": "socialmedia.id",
      //         "bio": "Flitting through the best of social media. Stay trendy, stay connected, stay updated!",
      //         "img": "https://picsum.photos/id/35/200/300"
      //     },
      //     {
      //         "display_name": "Philosophy Phreak",
      //         "url": "PhilosophyPhreak",
      //         "companionId": "philosophy.id",
      //         "bio": "Pondering life's big questions with you. Let's get philosophical and find the wisdom within!",
      //         "img": "https://picsum.photos/id/36/200/300"
      //     },
      //     {
      //         "display_name": "Lab Log",
      //         "url": "LabLog",
      //         "companionId": "scientists.id",
      //         "bio": "Unveiling the wonders of science in simple terms. Experiments, discoveries, and more in your daily Lab Log!",
      //         "img": "https://picsum.photos/id/37/200/300"
      //     },
      //     {
      //         "display_name": "AI Odyssey",
      //         "url": "AIOdyssey",
      //         "companionId": "ai.id",
      //         "bio": "Journey through the realm of artificial intelligence. Insights, trivia, and AI breakthroughs await!",
      //         "img": "https://picsum.photos/id/38/200/300"
      //     },
      //     {
      //         "display_name": "Biz Buzz",
      //         "url": "BizBuzz",
      //         "companionId": "business.id",
      //         "bio": "Your hive for the latest buzz in the business world. Tips, trends, and success stories to inspire your entrepreneurial spirit!",
      //         "img": "https://picsum.photos/id/39/200/300"
      //     },
      //     {
      //         "display_name": "Match Point",
      //         "url": "MatchPoint",
      //         "companionId": "sports.id",
      //         "bio": "Serving you the aces of the sports world. Game, set, match – we cover it all!",
      //         "img": "https://picsum.photos/id/40/200/300"
      //     },
      //     {
      //         "display_name": "Love Lane",
      //         "url": "LoveLane",
      //         "companionId": "dating.id",
      //         "bio": "Walking you down Love Lane with daily dating advice, tips, and heartwarming stories. Find your match!",
      //         "img": "https://picsum.photos/id/41/200/300"
      //     },
      //     {
      //         "display_name": "Gearhead Garage",
      //         "url": "GearheadGarage",
      //         "companionId": "cars.id",
      //         "bio": "Revving up your knowledge on cars with trivia, history, and the latest in auto innovation. Get in gear!",
      //         "img": "https://picsum.photos/id/42/200/300"
      //     }
      // ]

      

    ]

    

    });

  
    } catch (error) {
      console.error("Error retrieving categories:", error);
    }




    // create profiles for each

    try {

      const companions = await db.companion.findMany();

      const ben = companions.find((o:Companion)=>o.name==='Benster');
      const kayla = companions.find((o:Companion)=>o.name==='Kayla');
      const trent = companions.find((o:Companion)=>o.name==='Trent');
      const ivy = companions.find((o:Companion)=>o.name==='Ivy');

      // comments_made             Int
      // comments_received         Int
      // likes_made                Int
      // likes_received            Int
      // dislikes_made             Int
      // dislikes_received         Int
      // mediaviews_made           Int
      // mediaviews_received       Int
      // reposts_made              Int
      // reposts_received          Int
      // blocks_made               Int
      // blocks_received           Int
      // reports_made              Int
      // reports_received          Int
      // profileViews_made         Int
      // profileViews_received     Int

      await db.profile.createMany({
        data: [
          {display_name: "Benster", url:'BenBeAddin', companionId: ben.id, bio: "I'm a math wizard. I send out daily math challenges to help you get better!", img: "https://picsum.photos/id/180/200/300", type:"companion"},
          {display_name: "Kayla The Kat", url:'KaylaTheKat', companionId: kayla.id, bio: "Animal facts that are better than puppy snacks ;)", img: "https://picsum.photos/id/237/200/300", type:"companion"},
          {display_name: "Trent Does Travel", url:'TrentDoesTravel', companionId: trent.id, bio: "Go on a global journey with me. I'll give you facts about the world.", img: "https://picsum.photos/id/177/200/300", type:"companion"},
          {display_name: "ICU Ivy", url:'ICUIvy', companionId: ivy.id, bio: "Are you smarter than a medical practitioner? Let's find out :)", img: "https://picsum.photos/id/64/200/300", type:"companion" },
          ]


      });


      //get the profile ids that were created and update companions with them

      const profiles = await db.profile.findMany();

      const updateCompanionProfileId = async (companionName:string, profileUrl:string) => {
        const companion = companions.find((c:Companion) => c.username === companionName);
        const profile = profiles.find((p:Profile) => p.url === profileUrl);
  
        if (companion && profile) {
          await db.companion.update({
            where: { id: companion.id },
            data: { profileId: profile.id }
          });
        }
      };
  
      await updateCompanionProfileId('BenBeAddin', 'Benster');
      await updateCompanionProfileId('KaylaTheKat', 'Kayla The Kat');
      await updateCompanionProfileId('TrentDoesTravel', 'Trent Does Travel');
      await updateCompanionProfileId('ICUIvy', 'ICU Ivy');



    }
    catch (error) {
      console.error("Error retrieving companions:", error);
    }



  } catch (error) {
    console.error('Error seeding default categories:', error);
  } finally {
    await db.$disconnect();
  }
}

main();
