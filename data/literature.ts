export type Category = "all" | "poetry" | "stories" | "blogs";

export type Writing = {
  id: string;
  category: "poetry" | "stories" | "blogs";
  title: string;
  author: string;
  excerpt: string;
  date: string;
  fullContent: string;
  likes: number;
  comments: Comment[];
};

export type Comment = {
  id: string;
  author: string;
  text: string;
  timestamp: string;
};

export const categoryLabels: Record<string, string> = {
  poetry: "Poetry",
  stories: "Short Stories",
  blogs: "Blogs & Essays",
};

export const categoryColors = {
  poetry: "bg-leo-blue/10 text-leo-blue",
  stories: "bg-leo-green/10 text-leo-green",
  blogs: "bg-leo-yellow/10 text-leo-yellow",
};

export const writings: Writing[] = [
  {
    id: "1",
    category: "poetry",
    title: "Morning Light Over the Campus",
    author: "Leo Nischhal Shrestha",
    excerpt: "Golden rays slip through the library windows, painting verses on dusty shelves. Each beam a stanza, each shadow a pause...",
    date: "Fri, 9 Oct 2026",
    fullContent: `Golden rays slip through the library windows,
painting verses on dusty shelves.
Each beam a stanza, each shadow a pause
between the lines of unwritten stories.

The old oak by the quad drops amber leaves
like punctuation marks on the path I walk.
Morning wind turns pages I haven't written yet —
a draft of light, a rhyme of shadow.

And in this quiet hour before the bell rings,
I understand: every day is a blank page
waiting for the courage to begin.`,
    likes: 24,
    comments: [
      { id: "c1", author: "Leo Anubhav K.C.", text: "Beautiful imagery! The 'draft of light' line is perfect.", timestamp: "2026-10-09T10:30:00Z" },
      { id: "c2", author: "Leo Samita Gyawali", text: "Love how you captured the campus morning atmosphere.", timestamp: "2026-10-09T14:15:00Z" },
    ],
  },
  {
    id: "2",
    category: "stories",
    title: "The Library's Secret",
    author: "Leo Anubhav K.C.",
    excerpt: "There was a book that nobody had checked out in twenty years. Its cover was worn, its title faded. When Maya finally opened it...",
    date: "Wed, 7 Oct 2026",
    fullContent: `There was a book that nobody had checked out in twenty years.
Its cover was worn, its title faded to a ghost of gold.
It sat on the third shelf, fourth from the left —
always there, never touched.

Maya found it on a rainy Tuesday.
The library smelled of old paper and rain on tin roofs.
She pulled it down, blew dust from the cover,
and read the first line:

"Every story begins with a door you didn't know existed."

She read for three hours.
When she closed it, the title had reappeared:
"The Library's Secret — By You."

The next morning, the book was gone.
But on the shelf, a new one appeared,
waiting for the next curious soul.`,
    likes: 18,
    comments: [
      { id: "c3", author: "Leo Nischhal Shrestha", text: "The ending gave me chills. Beautiful meta-fiction!", timestamp: "2026-10-07T16:20:00Z" },
    ],
  },
  {
    id: "3",
    category: "blogs",
    title: "Why I Serve: A Leo's Journey",
    author: "Leo Samita Gyawali",
    excerpt: "People ask why I spend weekends cleaning parks or tutoring kids. The answer isn't in what I give, but in what I become...",
    date: "Mon, 5 Oct 2026",
    fullContent: `People ask why I spend weekends cleaning parks,
tutoring kids in the community center,
planting trees in soil that'll outlive me.

The answer isn't in what I give.
It's in what I become.

Every piece of trash I pick up
teaches me to notice what others ignore.
Every child I teach to read
reminds me that knowledge is the only gift
that multiplies when shared.
Every tree I plant
is a promise to a future I won't see.

Service isn't charity.
It's the practice of becoming
the person you needed when you were younger.

That's why I serve.
Not because I have extra time.
But because I'm still becoming.`,
    likes: 31,
    comments: [
      { id: "c4", author: "Leo Prince Parajuli", text: "This perfectly captures why we do what we do. Inspiring!", timestamp: "2026-10-05T09:45:00Z" },
      { id: "c5", author: "Leo Ashika Budhathoki", text: "The last paragraph hit hard. 'The person you needed when you were younger' — wow.", timestamp: "2026-10-05T14:30:00Z" },
    ],
  },
  {
    id: "4",
    category: "poetry",
    title: "नेपाली कविता: हाम्रो विद्यालय",
    author: "Leo Ashika Budhathoki",
    excerpt: "हाम्रो विद्यालय, ज्ञानको मन्दिर, जहाँ सपना उड्छ निर्विघ्न। शिक्षा को ज्योति जलाएर, हामी बनौँ देशको स्तम्भ...",
    date: "Sat, 3 Oct 2026",
    fullContent: `हाम्रो विद्यालय, ज्ञानको मन्दिर,
जहाँ सपना उड्छ निर्विघ्न।
शिक्षा को ज्योति जलाएर,
हामी बनौँ देशको स्तम्भ।

किताबका पानामा छिपेको सपना,
शिक्षकको मुस्कानमा झल्कने आशा।
यहाँ हरेक विद्यार्थी हो
भविष्यको निर्माता, देशको आशा।

पुस्तकालयको मौनमा बज्छ
ज्ञानको संगीत, सपनाको राग।
हाम्रो विद्यालय —
सपनाहरूको घर, भविष्यको द्वार।`,
    likes: 22,
    comments: [
      { id: "c6", author: "Leo Anubhav K.C.", text: "Beautiful! The Nepali verses flow so naturally.", timestamp: "2026-10-03T11:20:00Z" },
    ],
  },
  {
    id: "5",
    category: "stories",
    title: "The Last Bench",
    author: "Leo Prince Parajuli",
    excerpt: "Everyone wanted the front row. But the last bench held stories — whispered dreams, shared lunches, and the quiet promise of friendship...",
    date: "Thu, 1 Oct 2026",
    fullContent: `Everyone wanted the front row.
Better view, better grades, teacher's eye.
But the last bench held stories.

Whispered dreams during biology.
Shared lunches when someone forgot theirs.
The quiet promise: "I'll wait for you after class."
Notes passed like secret treaties.
Laughter muffled behind textbooks.

Years later, the classroom is empty.
But the last bench still holds them —
the dreams, the lunches, the promises.
Some seats remember everyone who sat there.`,
    likes: 15,
    comments: [
      { id: "c7", author: "Leo Yunesh Shrestha", text: "So relatable! The last bench really does hold the best memories.", timestamp: "2026-10-01T18:40:00Z" },
    ],
  },
  {
    id: "6",
    category: "blogs",
    title: "Leadership Lessons from a Clean-Up Drive",
    author: "Leo Sailesh Acharya",
    excerpt: "Picking up trash taught me more about leadership than any workshop. It's not about directing — it's about showing up first...",
    date: "Tue, 29 Sep 2026",
    fullContent: `Picking up trash taught me more about leadership
than any workshop or seminar ever could.

It's not about directing others.
It's about showing up first.
Bending down when no one's watching.
Carrying the heaviest bag without being asked.

Real leadership is quiet.
It's the empty water bottle you refill for a teammate.
The "I'll take this side" when the work gets hard.
The "Good job" that means more than applause.

The park got cleaner that day.
But more importantly —
the team learned to lead each other.`,
    likes: 27,
    comments: [
      { id: "c8", author: "Leo Aashish B.K.", text: "So true. The best leaders are the ones working alongside you.", timestamp: "2026-09-29T15:30:00Z" },
    ],
  },
  {
    id: "7",
    category: "poetry",
    title: "Monsoon Memories",
    author: "Leo Sita Limbu",
    excerpt: "Rain on the tin roof, steam from tea cups, and the smell of wet earth. Some memories don't need words, just the sound of rain...",
    date: "Sun, 27 Sep 2026",
    fullContent: `Rain on the tin roof —
a lullaby the city forgot.
Steam curling from tea cups,
the smell of wet earth rising
like incense from forgotten prayers.

Some memories don't need words.
Just the sound of rain on metal.
The way it blurs the world
into watercolor edges.

Monsoon doesn't wash things away.
It reveals what the sun hid:
the cracks, the colors, the quiet
beauty of things growing.`,
    likes: 19,
    comments: [],
  },
  {
    id: "8",
    category: "blogs",
    title: "Building a Reading Culture",
    author: "Leo Aashish B.K.",
    excerpt: "Our campus library has 5,000 books but only 50 regular visitors. Here's how we're changing that, one book club at a time...",
    date: "Fri, 25 Sep 2026",
    fullContent: `Our campus library has 5,000 books
but only 50 regular visitors.
Five thousand stories waiting.
Fifty readers finding them.

That's a ratio that haunts me.

So we started a book club.
Not the academic kind —
the "bring whatever you're reading" kind.
Chai and samosas mandatory.
No presentations, just conversations.

"I didn't know you liked sci-fi."
"Wait, you cried at that ending too?"
"Let me lend you the sequel."

Three months later:
200 regular visitors.
5,000 books still waiting.
But now — they're being found.`,
    likes: 20,
    comments: [
      { id: "c9", author: "Leo Rohit Rai", text: "This is such a practical approach. The 'chai and samosas' detail made me smile!", timestamp: "2026-09-25T13:10:00Z" },
    ],
  },
  {
    id: "9",
    category: "stories",
    title: "The Letter I Never Sent",
    author: "Leo Yunesh Shrestha",
    excerpt: "It sat in my drawer for three years. Three years of 'I'll send it tomorrow.' Some tomorrows never come, and that's okay...",
    date: "Wed, 23 Sep 2026",
    fullContent: `It sat in my drawer for three years.
Three years of "I'll send it tomorrow."
Three birthdays, two monsoons,
one graduation ceremony.

The envelope yellowed at the edges.
The ink faded from blue to sepia.
But the words never changed:
"I'm sorry. I was afraid. I'm not anymore."

Some tomorrows never come.
And that's okay.
Because the writing healed me
even if the sending never happened.

Today, I took it out.
Read it one last time.
Burned it in the evening fire.

The smoke carried my apology
to a sky that doesn't keep score.
And for the first time in three years —
my hands felt empty in a good way.`,
    likes: 26,
    comments: [
      { id: "c10", author: "Leo Aashu Gurung", text: "The ending is powerful. Burning the letter — such a release.", timestamp: "2026-09-23T20:15:00Z" },
      { id: "c11", author: "Leo Ambika Shrestha", text: "Made me tear up. 'Sky that doesn't keep score' — beautiful.", timestamp: "2026-09-24T08:30:00Z" },
    ],
  },
];

export function getWritingById(id: string): Writing | undefined {
  return writings.find((w) => w.id === id);
}

export function getWritingsByCategory(category: "poetry" | "stories" | "blogs"): Writing[] {
  return writings.filter((w) => w.category === category);
}

export function getAllWritings(): Writing[] {
  return writings;
}