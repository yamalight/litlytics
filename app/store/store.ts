import { Pipeline } from '@/src/pipeline/Pipeline';
import { atom } from 'jotai';

export const pipelineAtom = atom<Pipeline>({
  name: 'test',
  pipelinePlan: `1) **LLM Step - Sentiment Analysis**: Use a language model to analyze the sentiment of each product review, categorizing them into positive, negative, and neutral sentiments. This will help in filtering out the reviews that are primarily negative, which are likely to contain complaints.

2) **LLM Step - Extract Complaints**: Pass the negative reviews to a language model to extract specific complaints or issues mentioned in the text. This step focuses on identifying phrases or sentences that indicate dissatisfaction.

3) **Code Step - Frequency Count**: Implement a JavaScript function that takes the extracted complaints and counts the frequency of each unique complaint. This will allow you to determine which complaints are most common across the reviews.

4) **LLM Step - Summarize Findings**: Use a language model to summarize the most frequent complaints identified in the previous step, providing a clear overview of the key issues customers are facing with the product.`,
  pipelineDescription:
    'I need to analyze a set of product reviews to get a list of common complaints.',
  testDocs: [
    {
      id: '0',
      name: 'Positive',
      content: `I was late to the party, only picking this up a couple of weeks ago, after apparently 90 percent of the player base had left. What I've stumbled across is a vibrant community of like-minded gamers, largely absent of toxicity that plagues other gaming communities.

As for the game itself, it's everything I could hope for. The graphics are fantastic, the gun play is extremely rewarding and the game play loop leaves me wanting for very little.

You can tell that the devs have poured their hearts into this.`,
      processingResults: [],
    },
    {
      id: '1',
      name: 'Negative',
      content: `Devs hate the idea you might have fun. Most recently, they put out an all flamethrower DLC, which was exciting. The flamethrower already in the game was one of my favorite weapons. In preparation for the DLC, they nerfed fire damage into the ground so it can't kill armored enemies or crowds (the 2 things it was good at vs a regular MG).

I haaaaaate this balance philosophy. If you want to shake up the meta, give players new options. Don't find the one thing people are already having fun with, take it away, and task them with finding a new way to have fun. This is like the 4th time they've done this since I bought the game, and I'm beginning to think my new way of having fun this time should be uninstalling this game and playing something else.

"It feels like every time someone finds something fun, the fun is removed" -Johan Pilestedt, CCO of Arrowhead`,
      processingResults: [],
    },
    {
      id: '2',
      name: 'Negative 2',
      content: `I want to enjoy this more, but I don't really like how onerous just the act of getting ready to play this game feels.

Almost all of my public random quickplay matches involved sweaty people getting ass mad for whatever reason, killing everyone and leaving the samples behind. Can't even report them if they preemptively block you either. Great fun!!! So I just don't feel like jumping in without a premade group of friends which has its own scheduling problems.

I don't know what loadout to run other than just being the autocannon mule. Everything I've unlocked is either not very effective the vast majority of the time, or is just gross meta shotgun requirements. I've never even piloted one of the mechs because it just feels like a wasteful liability more than a fun tool. maybe it's a product of playing on 7s almost exclusively once I got the autocannon unlocked. I don't really know.

Sometimes the map generation just hands you a completely unwinnable generation (Three eye towers clustered around a jammer on a raid map? Cool. That's really Fun and Balanced.) Other times it just feels like a 45m jogging simulator because ammo economy is so poor that you're better off sneaking than dealing with endless reinforcement waves. Fire damage instantly killing you is super duper fun as well. What's the point of completely sealed armor anyway.

T'was really fun when folks were around to play it until the slog of the same feeling maps and conditions stopped being fun to deal with. Totally fun to only be able to fight in dense fog for each bot map. Or dealing with earthquakes that instantly sap all stamina for some reason when fighting bugs.

It's a good solid game otherwise. Movement feels good, if limiting when compared to say, Darktide. Gunplay is solid when you actually get to use something other than a special weapon. But even then the trash mobs soak up so much regular ammo and the specials just ignore regular primary ammo

All in all, "eh". Sony's blockade of countries pretty much ended any further support I was inclined to give as well. `,
      processingResults: [],
    },
  ],
  // pipeline steps
  steps: [
    {
      id: '0',
      name: 'Plain text source',
      description: 'Simple plain text source',
      type: 'source',
      position: { x: 0, y: 0 },
      connectsTo: ['1'],
      sourceType: 'plain',
      config: {
        documents: [
          {
            id: '0',
            name: 'Positive',
            content: `I was late to the party, only picking this up a couple of weeks ago, after apparently 90 percent of the player base had left. What I've stumbled across is a vibrant community of like-minded gamers, largely absent of toxicity that plagues other gaming communities.

As for the game itself, it's everything I could hope for. The graphics are fantastic, the gun play is extremely rewarding and the game play loop leaves me wanting for very little.

You can tell that the devs have poured their hearts into this.`,
            processingResults: [],
          },
          {
            id: '1',
            name: 'Negative',
            content: `Devs hate the idea you might have fun. Most recently, they put out an all flamethrower DLC, which was exciting. The flamethrower already in the game was one of my favorite weapons. In preparation for the DLC, they nerfed fire damage into the ground so it can't kill armored enemies or crowds (the 2 things it was good at vs a regular MG).

I haaaaaate this balance philosophy. If you want to shake up the meta, give players new options. Don't find the one thing people are already having fun with, take it away, and task them with finding a new way to have fun. This is like the 4th time they've done this since I bought the game, and I'm beginning to think my new way of having fun this time should be uninstalling this game and playing something else.

"It feels like every time someone finds something fun, the fun is removed" -Johan Pilestedt, CCO of Arrowhead`,
            processingResults: [],
          },
          {
            id: '2',
            name: 'Negative 2',
            content: `I want to enjoy this more, but I don't really like how onerous just the act of getting ready to play this game feels.

Almost all of my public random quickplay matches involved sweaty people getting ass mad for whatever reason, killing everyone and leaving the samples behind. Can't even report them if they preemptively block you either. Great fun!!! So I just don't feel like jumping in without a premade group of friends which has its own scheduling problems.

I don't know what loadout to run other than just being the autocannon mule. Everything I've unlocked is either not very effective the vast majority of the time, or is just gross meta shotgun requirements. I've never even piloted one of the mechs because it just feels like a wasteful liability more than a fun tool. maybe it's a product of playing on 7s almost exclusively once I got the autocannon unlocked. I don't really know.

Sometimes the map generation just hands you a completely unwinnable generation (Three eye towers clustered around a jammer on a raid map? Cool. That's really Fun and Balanced.) Other times it just feels like a 45m jogging simulator because ammo economy is so poor that you're better off sneaking than dealing with endless reinforcement waves. Fire damage instantly killing you is super duper fun as well. What's the point of completely sealed armor anyway.

T'was really fun when folks were around to play it until the slog of the same feeling maps and conditions stopped being fun to deal with. Totally fun to only be able to fight in dense fog for each bot map. Or dealing with earthquakes that instantly sap all stamina for some reason when fighting bugs.

It's a good solid game otherwise. Movement feels good, if limiting when compared to say, Darktide. Gunplay is solid when you actually get to use something other than a special weapon. But even then the trash mobs soak up so much regular ammo and the specials just ignore regular primary ammo

All in all, "eh". Sony's blockade of countries pretty much ended any further support I was inclined to give as well. `,
            processingResults: [],
          },
        ],
      },
    },
    {
      id: '1',
      name: 'Sentiment Analysis',
      description:
        'Analyze the sentiment of a product review to identify whether review contains complaints. Return just the overall doc sentiment.',
      type: 'llm',
      prompt:
        'Analyze the sentiment of the provided product review and determine whether it contains complaints. Please return only the overall sentiment of the document.',
      input: 'doc',
      position: { x: 0, y: 60 },
      connectsTo: ['2'],
    },
    {
      id: '2',
      name: 'Extract overall document sentiment',
      description:
        'Extract overall document sentiment from textual description of sentiment generated by LLM. Resulting sentiment should be either "Negative" or return nothing for positive docs to filter them out.',
      type: 'code',
      code: "export default function extractOverallDocumentSentiment(inputString) {\n    const negativeSentimentKeywords = ['bad', 'terrible', 'awful', 'horrible', 'negative', 'poor', 'disappointing', 'sad', 'angry', 'frustrating'];\n    \n    const lowerCaseInput = inputString.toLowerCase();\n    \n    for (let keyword of negativeSentimentKeywords) {\n        if (lowerCaseInput.includes(keyword)) {\n            return 'Negative';\n        }\n    }\n    \n    return '';\n}",
      input: 'result',
      position: { x: 0, y: 130 },
      connectsTo: ['3'],
    },
    {
      id: '3',
      name: 'Extract negative feedback from product review',
      description:
        'Analyze a product review to identify negative feedback. Return just the list of negatives from reviewer.',
      type: 'llm',
      input: 'doc',
      prompt:
        'Please analyze the provided product review and extract only the negative feedback. Return a list containing the identified negative points mentioned by the reviewer.',
      position: { x: 0, y: 210 },
      connectsTo: ['4'],
    },
    {
      id: '4',
      name: 'Summarize common complaints',
      description: 'Summarize the most frequent complaints in given documents.',
      type: 'llm',
      input: 'aggregate',
      prompt:
        'Please analyze the provided text document and identify the most common complaints mentioned. Summarize these complaints, highlighting the key themes and issues that appear most frequently.',
      position: { x: 0, y: 290 },
      connectsTo: [],
    },
  ],
});

/*
export const pipelineAtom = atom<Pipeline>({
  // project setup
  name: '',
  // test docs
  documents: [],
  // pipeline plan
  pipelinePlan: '',
  pipelineDescription: '',
  // pipeline steps
  steps: [],
}));
//*/
