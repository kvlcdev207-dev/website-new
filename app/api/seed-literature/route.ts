import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

const mockWritings = [
  {
    category: "poetry",
    title: "Morning Light Over the Campus",
    author: "Leo Nischhal Shrestha",
    excerpt: "Golden rays slip through the library windows, painting verses on dusty shelves. Each beam a stanza, each shadow a pause...",
    date: "Fri, 9 Oct 2026",
    fullContent: "Golden rays slip through the library windows,\npainting verses on dusty shelves.\nEach beam a stanza, each shadow a pause\nbetween the lines of unwritten stories.\n\nThe old oak by the quad drops amber leaves\nlike punctuation marks on the path I walk.\nMorning wind turns pages I haven't written yet -\na draft of light, a rhyme of shadow.\n\nAnd in this quiet hour before the bell rings,\nI understand: every day is a blank page\nwaiting for the courage to begin.",
    likes: 24,
    comments: [
      { id: "c1", author: "Leo Anubhav K.C.", text: "Beautiful imagery! The 'draft of light' line is perfect.", timestamp: "2026-10-09T10:30:00Z" },
      { id: "c2", author: "Leo Samita Gyawali", text: "Love how you captured the campus morning atmosphere.", timestamp: "2026-10-09T14:15:00Z" },
    ],
  },
  {
    category: "stories",
    title: "The Library's Secret",
    author: "Leo Anubhav K.C.",
    excerpt: "There was a book that nobody had checked out in twenty years. Its cover was worn, its title faded. When Maya finally opened it...",
    date: "Wed, 7 Oct 2026",
    fullContent: "There was a book that nobody had checked out in twenty years.\nIts cover was worn, its title faded to a ghost of gold.\nIt sat on the third shelf, fourth from the left -\nalways there, never touched.\n\nMaya found it on a rainy Tuesday.\nThe library smelled of old paper and rain on tin roofs.\nShe pulled it down, blew dust from the cover,\nand read the first line:\n\n\"Every story begins with a door you didn't know existed.\"\n\nShe read for three hours.\nWhen she closed it, the title had reappeared:\n\"The Library's Secret - By You.\"\n\nThe next morning, the book was gone.\nBut on the shelf, a new one appeared,\nwaiting for the next curious soul.",
    likes: 18,
    comments: [
      { id: "c3", author: "Leo Nischhal Shrestha", text: "The ending gave me chills. Beautiful meta-fiction!", timestamp: "2026-10-07T16:20:00Z" },
    ],
  },
  {
    category: "blogs",
    title: "Why I Serve: A Leo's Journey",
    author: "Leo Samita Gyawali",
    excerpt: "People ask why I spend weekends cleaning parks or tutoring kids. The answer isn't in what I give, but in what I become...",
    date: "Mon, 5 Oct 2026",
    fullContent: "People ask why I spend weekends cleaning parks,\ntutoring kids in the community center,\nplanting trees in soil that'll outlive me.\n\nThe answer isn't in what I give.\nIt's in what I become.\n\nEvery piece of trash I pick up\nteaches me to notice what others ignore.\nEvery child I teach to read\nreminds me that knowledge is the only gift\nthat multiplies when shared.\nEvery tree I plant\nis a promise to a future I won't see.\n\nService isn't charity.\nIt's the practice of becoming\nthe person you needed when you were younger.\n\nThat's why I serve.\nNot because I have extra time.\nBut because I'm still becoming.",
    likes: 31,
    comments: [
      { id: "c4", author: "Leo Prince Parajuli", text: "This perfectly captures why we do what we do. Inspiring!", timestamp: "2026-10-05T09:45:00Z" },
      { id: "c5", author: "Leo Ashika Budhathoki", text: "The last paragraph hit hard. 'The person you needed when you were younger' - wow.", timestamp: "2026-10-05T14:30:00Z" },
    ],
  },
  {
    category: "poetry",
    title: "नेपाली कविता: हाम्रो विद्यालय",
    author: "Leo Ashika Budhathoki",
    excerpt: "हाम्रो विद्यालय, ज्ञानको मन्दिर, जहाँ सपना उड्छ निर्विघ्न। शिक्षा को ज्योति जलाएर, हामी बनौँ देशको स्तम्भ...",
    date: "Sat, 3 Oct 2026",
    fullContent: "हाम्रो विद्यालय, ज्ञानको मन्दिर,\nजहाँ सपना उड्छ निर्विघ्न।\nशिक्षा को ज्योति जलाएर,\nहामी बनौँ देशको स्तम्भ।\n\nकिताबका पानामा छिपेको सपना,\nशिक्षकको मुस्कानमा झल्कने आशा।\nयहाँ हरेक विद्यार्थी हो\nभविष्यको निर्माता, देशको आशा।\n\nपुस्तकालयको मौनमा बज्छ\nज्ञानको संगीत, सपनाको राग।\nहाम्रो विद्यालय -\nसपनाहरूको घर, भविष्यको द्वार।",
    likes: 22,
    comments: [
      { id: "c6", author: "Leo Anubhav K.C.", text: "Beautiful! The Nepali verses flow so naturally.", timestamp: "2026-10-03T11:20:00Z" },
    ],
  },
  {
    category: "stories",
    title: "The Last Bench",
    author: "Leo Prince Parajuli",
    excerpt: "Everyone wanted the front row. But the last bench held stories - whispered dreams, shared lunches, and the quiet promise of friendship...",
    date: "Thu, 1 Oct 2026",
    fullContent: "Everyone wanted the front row.\nBetter view, better grades, teacher's eye.\nBut the last bench held stories.\n\nWhispered dreams during biology.\nShared lunches when someone forgot theirs.\nThe quiet promise: \"I'll wait for you after class.\"\nNotes passed like secret treaties.\nLaughter muffled behind textbooks.\n\nYears later, the classroom is empty.\nBut the last bench still holds them -\nthe dreams, the lunches, the promises.\nSome seats remember everyone who sat there.",
    likes: 15,
    comments: [
      { id: "c7", author: "Leo Yunesh Shrestha", text: "So relatable! The last bench really does hold the best memories.", timestamp: "2026-10-01T18:40:00Z" },
    ],
  },
  {
    category: "blogs",
    title: "Leadership Lessons from a Clean-Up Drive",
    author: "Leo Sailesh Acharya",
    excerpt: "Picking up trash taught me more about leadership than any workshop. It's not about directing - it's about showing up first...",
    date: "Tue, 29 Sep 2026",
    fullContent: "Picking up trash taught me more about leadership\nthan any workshop or seminar ever could.\n\nIt's not about directing others.\nIt's about showing up first.\nBending down when no one's watching.\nCarrying the heaviest bag without being asked.\n\nReal leadership is quiet.\nIt's the empty water bottle you refill for a teammate.\nThe \"I'll take this side\" when the work gets hard.\nThe \"Good job\" that means more than applause.\n\nThe park got cleaner that day.\nBut more importantly -\nthe team learned to lead each other.",
    likes: 27,
    comments: [
      { id: "c8", author: "Leo Aashish B.K.", text: "So true. The best leaders are the ones working alongside you.", timestamp: "2026-09-29T15:30:00Z" },
    ],
  },
  {
    category: "poetry",
    title: "Monsoon Memories",
    author: "Leo Sita Limbu",
    excerpt: "Rain on the tin roof, steam from tea cups, and the smell of wet earth. Some memories don't need words, just the sound of rain...",
    date: "Sun, 27 Sep 2026",
    fullContent: "Rain on the tin roof -\na lullaby the city forgot.\nSteam curling from tea cups,\nthe smell of wet earth rising\nlike incense from forgotten prayers.\n\nSome memories don't need words.\nJust the sound of rain on metal.\nThe way it blurs the world\ninto watercolor edges.\n\nMonsoon doesn't wash things away.\nIt reveals what the sun hid:\nthe cracks, the colors, the quiet\nbeauty of things growing.",
    likes: 19,
    comments: [],
  },
  {
    category: "blogs",
    title: "Building a Reading Culture",
    author: "Leo Aashish B.K.",
    excerpt: "Our campus library has 5,000 books but only 50 regular visitors. Here's how we're changing that, one book club at a time...",
    date: "Fri, 25 Sep 2026",
    fullContent: "Our campus library has 5,000 books\nbut only 50 regular visitors.\nFive thousand stories waiting.\nFifty readers finding them.\n\nThat's a ratio that haunts me.\n\nSo we started a book club.\nNot the academic kind -\nthe \"bring whatever you're reading\" kind.\nChai and samosas mandatory.\nNo presentations, just conversations.\n\n\"I didn't know you liked sci-fi.\"\n\"Wait, you cried at that ending too?\"\n\"Let me lend you the sequel.\"\n\nThree months later:\n200 regular visitors.\n5,000 books still waiting.\nBut now - they're being found.",
    likes: 20,
    comments: [
      { id: "c9", author: "Leo Rohit Rai", text: "This is such a practical approach. The 'chai and samosas' detail made me smile!", timestamp: "2026-09-25T13:10:00Z" },
    ],
  },
  {
    category: "stories",
    title: "The Letter I Never Sent",
    author: "Leo Yunesh Shrestha",
    excerpt: "It sat in my drawer for three years. Three years of 'I'll send it tomorrow.' Some tomorrows never come, and that's okay...",
    date: "Wed, 23 Sep 2026",
    fullContent: "It sat in my drawer for three years.\nThree years of \"I'll send it tomorrow.\"\nThree birthdays, two monsoons,\none graduation ceremony.\n\nThe envelope yellowed at the edges.\nThe ink faded from blue to sepia.\nBut the words never changed:\n\"I'm sorry. I was afraid. I'm not anymore.\"\n\nSome tomorrows never come.\nAnd that's okay.\nBecause the writing healed me\neven if the sending never happened.\n\nToday, I took it out.\nRead it one last time.\nBurned it in the evening fire.\n\nThe smoke carried my apology\nto a sky that doesn't keep score.\nAnd for the first time in three years -\nmy hands felt empty in a good way.",
    likes: 26,
    comments: [
      { id: "c10", author: "Leo Aashu Gurung", text: "The ending is powerful. Burning the letter - such a release.", timestamp: "2026-09-23T20:15:00Z" },
      { id: "c11", author: "Leo Ambika Shrestha", text: "Made me tear up. 'Sky that doesn't keep score' - beautiful.", timestamp: "2026-09-24T08:30:00Z" },
    ],
  },
];

export async function POST() {
  try {
    const client = await clientPromise
    const db = client.db("kvlc_database")
    
    // Clear existing data first
    await db.collection("literature").deleteMany({})
    
    // Prepare documents with string IDs
    const documents = mockWritings.map((item, index) => ({
      ...item,
      _id: String(index + 1), // "1", "2", "3", etc.
      createdAt: new Date(),
      updatedAt: new Date(),
    })) // <--- FIXED: Added the missing closing parenthesis here
    
    const result = await db.collection("literature").insertMany(documents as any[])
    
    return NextResponse.json({ 
      success: true, 
      message: `Seeded ${result.insertedCount} literature items with string IDs`,
      insertedIds: result.insertedIds 
    })
  } catch (error) {
    console.error("Error seeding literature:", error)
    return NextResponse.json({ error: "Failed to seed literature" }, { status: 500 })
  }
}
