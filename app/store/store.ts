import { Pipeline } from '@/src/pipeline/Pipeline';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { atomWithUndo } from './atomWithUndo';

export const emptyPipeline: Pipeline = {
  // project setup
  name: '',
  // test docs
  testDocs: [],
  // pipeline plan
  pipelinePlan: '',
  pipelineDescription: '',
  // pipeline source
  source: {
    id: 'source_0',
    name: 'Source',
    description: 'Primary source',
    type: 'source',
    sourceType: 'basic',
    config: {},
    connectsTo: [],
    expanded: true,
  },
  // pipeline output
  output: {
    id: 'output_0',
    name: 'Output',
    description: 'Primary output',
    type: 'output',
    outputType: 'basic',
    config: {},
    connectsTo: [],
    expanded: true,
  },
  // pipeline steps
  steps: [],
  // results
  results: undefined,
};

export const isRunningAtom = atom<boolean>(false);

export const pipelineAtom = atomWithStorage<Pipeline>(
  'litlytics.pipeline',
  emptyPipeline
);
export const pipelineUndoAtom = atomWithUndo(pipelineAtom, 5);

/*
const testPipeline = {
  name: 'test',
  pipelinePlan: `Step name: Source Reviews  
Step type: source  
Step description: This step retrieves the list of product reviews to be processed in the pipeline.  

---  
Step name: Detect Sentiment  
Step type: llm  
Step description: This step uses a language model to analyze each review and determine its sentiment, classifying them as positive, negative, or neutral.  

---  
Step name: Filter Negative Reviews  
Step type: code  
Step description: This step filters the reviews to retain only those that are classified as negative based on the results from the sentiment detection step.  

---  
Step name: Extract Complaints  
Step type: llm  
Step description: This step utilizes a language model to extract specific complaints from the negative reviews, identifying key issues mentioned by customers.  

---  
Step name: Compile Complaints  
Step type: llm  
Step description: This step summarizes the extracted complaints into a concise list, highlighting the most common issues raised by customers across the negative reviews.`,
  pipelineDescription: `I have a list of product reviews. I want to extract list of complaints from negative reviews. At the end, I want to get a summary of all complaints people have.`,
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
      sourceType: 'basic',
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
      position: { x: 0, y: 80 },
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
      position: { x: 0, y: 160 },
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
      position: { x: 0, y: 240 },
      connectsTo: ['4'],
    },
    {
      id: '4',
      name: 'Summarize common complaints',
      description: 'Summarize the most frequent complaints in given documents.',
      type: 'llm',
      input: 'aggregate-results',
      prompt:
        'Please analyze the provided text document and identify the most common complaints mentioned. Summarize these complaints, highlighting the key themes and issues that appear most frequently.',
      position: { x: 0, y: 320 },
      connectsTo: [],
    },
  ],
  results: {
    id: '124ba2cc-2930-4ecc-a0f2-bc59215acee0',
    name: 'Aggregate result',
    content: '',
    processingResults: [
      {
        stepId: '4',
        result:
          "Based on the analysis of the provided text, several common complaints emerge, highlighting key themes and issues that players are experiencing:\n\n1. **Gameplay Balance Issues**: \n   - Players are frustrated with the nerfing of fire damage, which has rendered it ineffective against armored enemies and in crowd control situations. This suggests a broader concern about the game's balance philosophy, where fun elements are being removed rather than new options being introduced.\n\n2. **Toxic Player Behavior**:\n   - There is a significant complaint regarding the prevalence of toxic players in public matches. Players report experiences with individuals who disrupt gameplay, such as killing teammates and leaving behind samples, which diminishes the enjoyment of the game. Additionally, the inability to report these players exacerbates the issue.\n\n3. **Frustration with Game Mechanics**:\n   - Many players express dissatisfaction with various mechanics, including the difficulty in finding effective loadouts and the perception that piloting mechs is more of a liability than an enjoyable aspect of gameplay. This indicates a need for better balancing and more engaging options within the game.\n\n4. **Map Design and Generation**:\n   - Complaints about map generation leading to unwinnable scenarios and repetitive, unengaging environments are prevalent. Players feel that poorly designed maps diminish the overall experience and enjoyment of the game.\n\n5. **Resource Management Issues**:\n   - Players are frustrated with the ammo economy, which forces them into sneaky playstyles instead of engaging in combat. The consumption of regular ammo by trash mobs is also noted as a significant point of frustration.\n\n6. **Overall Player Experience**:\n   - The overall experience of preparing to play the game is described as onerous, leading some players to consider uninstalling the game altogether due to accumulated frustration. This reflects a broader sentiment of dissatisfaction with the game's current state.\n\n7. **Impact of External Factors**:\n   - Lastly, there is mention of external issues, such as Sony's blockade of certain countries, which has negatively impacted support for the game. This adds another layer of frustration for players who may feel abandoned or unsupported.\n\nIn summary, the key themes of complaints include gameplay balance issues, toxic player behavior, frustrations with game mechanics and resource management, poor map design, and external factors affecting player support. These issues collectively contribute to a declining player experience and dissatisfaction with the game.",
        usage: {
          prompt_tokens: 309,
          completion_tokens: 470,
          total_tokens: 779,
        },
      },
    ],
  },
};

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
