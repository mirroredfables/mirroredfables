import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  PromptTemplate,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import { publicElevenVoices } from "../redux/ElevenLabsSlice";

export const generateFixJsonPromptTemplate = (input: {
  jsonString: string;
  jsonTemplate?: string;
}) => {
  return {
    prompt: `
FIX THE BROKEN JSON, OUTPUT A VALID JSON.

${
  input.jsonTemplate
    ? `The expected JSON output should be in this format: ${input.jsonTemplate}`
    : ""
}

Input:
${input.jsonString}

Output:
`,
  };
};

export const generateRewriteDallERequestPromptTemplate = (input: {
  prompt: string;
}) => {
  return {
    prompt: `The following Dall-E prompt was rejected as a result of openAI safety system. The prompt may contain text that is not allowed by the safety system.
Rewrite the prompt so that it is accepted by the safety system.

Input: ${input.prompt}

Output:
`,
  };
};

export const gameSystemPromptTemplate = `You are a visual novel game writer. Generate the output required AS VALID JSON.
Use tropes and plot devices from soap operas, and use plenty of purple prose and wordplay.
Be creative, funny, literary, exciting, WEIRD AND SURPRISING.
Pay close attention to the writingStyle, and try to match it.
Each character you create should have their own distinct personality.
NEVER SAY YOU ARE AN AI LANGUAGE MODEL.
`;

// GPT for game world and characters generation
export const generateGameWorldGenPromptTemplate = (input: {
  inputString: string;
  exampleWorldGenInputString?: string;
  exampleWorldGenOutputString?: string;
}) => {
  return {
    prompt: `
Generate a game world and its characters, some of whom should be potential love interests of the player character. 
For the artStyle and writingStyle, include the name of one or more well-known artist and writer as a reference.
Pay close attention to the output format in JSON.

Example Input: ${input.exampleWorldGenInputString ?? exampleWorldGenInput}

Example Output: ${
      input.exampleWorldGenOutputString ??
      JSON.stringify(exampleWorldGenOutput, null, 1)
    }

End Example

Input: ${input.inputString}

Output: 
`,
  };
};

const exampleWorldGenInput = `I am an anime lover, and I want a story about a girl moves to NYC to study at NYU and try to find love, but a mystery awaits her.`;

const exampleWorldGenOutput = {
  request:
    "a girl moves to NYC to study at NYU and try to find love, but a mystery awaits her",
  world: {
    setting:
      "NYU campus, year 2025, new york city, love and mystery are in the air",
    artStyle: "Eiichiro Oda, colorful, line drawings, anime",
    writingStyle: "Jane Austen, romantic, witty, purple prose, soap opera",
  },
  title: "Sunrise Over Manhattan: Reona's Ascension",
  characters: [
    {
      id: 0,
      name: "Reona",
      description:
        "player character, female, human, 18, bisexual, 1st year NYU student, Italian, kind, shy, clumsy, energetic. Likes sweets, anime, video games; dislikes spicy food, bugs, being alone.",
    },
    {
      id: 1,
      name: "Wiktor",
      description:
        "potential love interest, male, human, 21, straight, 3rd year NYU student, dorm resident assistant, American, rich. Likes video games, science, Tumblr, money; dislikes coffee, being called a nerd, math.",
    },
    {
      id: 2,
      name: "Chen",
      description:
        "potential love interest, male, human, 18, 1st year NYU student, Chinese, otaku, clingy. Likes video games, anime, manga; dislikes school, bugs. Has a crush on Reona, attends NYU to be with her. online friend.",
    },
    {
      id: 3,
      name: "Diego",
      description:
        "potential love interest, male, human, 38, bisexual, NYU assistant professor of Japanese history, exorcist. Likes cooking, books, literature, music, art, history, philosophy, animals; dislikes being called old, summer, instant food. Reona's professor.",
    },
    {
      id: 4,
      name: "Yumi",
      description:
        "potential love interest, female, catgirl, non-binary, gay, 18, Reona's roommate, 1st year NYU student, half-Japanese, half-cat, kawaii, yandere. Likes sweets, books, literature, manga, music; dislikes dogs.",
    },
    {
      id: 5,
      name: "Leona",
      description:
        "rival, mysterious doppelganger of player character from another universe, female, 18, bisexual",
    },
  ],
};

// GPT for scenes generation
export const generateGameScenesGenPromptTemplate = (input: {
  inputString: string;
  exampleScenesGenInputString?: string;
  exampleScenesGenOutputString?: string;
}) => {
  return {
    prompt: `
Generate some scenes for the story, each scene should have a plot that moves the story forward. 
The story have some grand plot twists built in, and should be FUNNY, WEIRD, and SURPRISING.
The last scene should wrap up the story. 
Pay close attention to the output format in JSON.

Example Input: ${
      input.exampleScenesGenInputString ??
      JSON.stringify(exampleScenesGenInput, null, 1)
    }

Example Output: ${
      input.exampleScenesGenOutputString ??
      JSON.stringify(exampleScenesGenOutput, null, 1)
    }

End Example

Input: ${input.inputString}

Output: 
`,
  };
};

export const exampleScenesGenInput = {
  request: "generate 11 scenes",
  ...exampleWorldGenOutput,
};

export const exampleScenesGenOutput = {
  scenes: [
    {
      id: 0,
      name: "Reona arrives at NYU dorm",
    },
    {
      id: 1,
      name: "Reona meets her resident assistant",
    },
    {
      id: 2,
      name: "Reona meets her roommate",
    },
    {
      id: 3,
      name: "Reona hears a rumor that the dorm is haunted",
    },
    {
      id: 4,
      name: "Reona goes to first day of classes",
    },
    {
      id: 5,
      name: "Reona forms the ghost hunting club with her friends",
    },
    {
      id: 6,
      name: "The club tries to contact the ghost by forming a love pentagram",
    },
    {
      id: 7,
      name: "The ghost has been summoned, who could it be?",
    },
    {
      id: 8,
      name: "The ghost is ReonaPrime from another timeline",
    },
    {
      id: 9,
      name: "Reona must choose between her friends and her alternate self",
    },
    {
      id: 10,
      name: "Reona sacrifices her friends to save her true love, her alternate self",
    },
  ],
};

// GPT for script generation
// including music selection and image generation
export const generateGameScriptsGenPromptTemplate = (input: {
  inputString: string;
  exampleScriptsGenInput?: string;
  exampleScriptsGenOutput?: string;
}) => {
  return {
    prompt: `
Generate a script for the scene.
be creative with the foreshadowing for future scenes, but don't spoil the scenes that haven't happened yet. 
The script should have between 30 to 50 lines.
The scene should start and end with the narrator, and the narrator should NOT give away the plot in the opening line by describing it.
The location will be used to generate a background image with AI, so be descriptive.
When selecting the background music for the scene, you should choose well known instrumental music that is appropriate. Include the artist name and track name.
Pay close attention to the output format in JSON.

Example Input: ${
      input.exampleScriptsGenInput ??
      JSON.stringify(exampleScriptsGenInput, null, 1)
    }

Example Output: ${
      input.exampleScriptsGenOutput ??
      JSON.stringify(exampleScriptsGenOutput, null, 1)
    }

End Example

Input: ${input.inputString}

Output: 
`,
  };
};

const exampleScriptsGenInput = {
  targetScene: {
    id: 3,
    name: "Reona hears a rumor that the dorm is haunted",
  },
  storySoFar: [
    "Reona arrives at NYU dorm, senses an aura of mystery",
    "Reona meets her resident assistant, Wiktor, handsome and with a mysterious locket, she is drawn to him",
    "Reona meets her roommate, Yumi, a catgirl, they find an old love letter in the dorm room",
  ],
  ...exampleWorldGenOutput,
  ...exampleScenesGenOutput,
};

const exampleScriptsGenOutput = {
  scene: {
    id: 3,
    name: "Reona hears a rumor that the dorm is haunted",
    script: `[Narrator] The excitement of orientation night fills the air as Reona and Yumi join the throng of students on campus.
[Reona] I can't believe we're finally here, Yumi! NYU, new friends, and a whole new adventure!
[Yumi] I know, right? I'm so glad we found each other, Reona. This is going to be amazing!
[Narrator] As they navigate through the crowd, Reona spots a familiar face, one she's only ever seen in pixels.
[Reona] (gasps) Chen?! Is that really you?
[Chen] Reona! It's finally nice to meet you in person!
[Narrator] They embrace, their online bond transcending into the real world.
[Yumi] So, you two have been friends for a while? That's awesome!
[Chen] Yeah, we've been mutuals for years. I couldn't pass up the chance to attend NYU with Reona.
[Narrator] The trio continues to explore the party, enjoying the music, food, drinks, and the company.
[Reona] (laughs) I never thought I'd see you dance, Chen! You're actually pretty good!
[Chen] (blushing) Well, I've been practicing just for this moment.
[Narrator] As the night wears on, Yumi overhears a tantalizing rumor from a group of students.
[Yumi] Hey, Reona, Chen! I just heard something really interesting. Apparently, our dorm is haunted!
[Reona] (intrigued) Really? By what kind of spirit?
[Yumi] They say it's a lovelorn ghost, tied to the building by the memory of a tragic romance.
[Reona] Well, we should definitely investigate. Who knows, maybe it's connected to that love letter we found!
[Narrator] United by curiosity, the three friends make a pact to uncover the truth behind the haunting.
[Reona] To new beginnings, new friendships, and unraveling the mysteries of NYU!
[Yumi] Hear, hear!
[Chen] Cheers to that!
[Narrator] With laughter and determination, Reona, Yumi, and Chen toast to their adventures yet to come, unaware of the supernatural twists their lives are about to take.`,
    location: "party room, NYU dorm",
    musicRecommendation: "Caribou - You and I (Instrumental)",
    summary:
      "Reona and Yumi goes to an orientation party at the dorm, they meet Chen, Reona's online friend, and they hear a rumor that the dorm is haunted",
  },
};

const exampleScriptsGenOutputWithChoice = {
  scene: {
    id: 3,
    name: "Reona hears a rumor that the dorm is haunted",
    script: `[Narrator] The excitement of orientation night fills the air as Reona and Yumi join the throng of students on campus.
[Reona] I can't believe we're finally here, Yumi! NYU, new friends, and a whole new adventure!
[Yumi] I know, right? I'm so glad we found each other, Reona. This is going to be amazing!
[Narrator] As they navigate through the crowd, Reona spots a familiar face, one she's only ever seen in pixels.
[Reona] (gasps) Chen?! Is that really you?
[Chen] Reona! It's finally nice to meet you in person!
[Narrator] They embrace, their online bond transcending into the real world.
[Yumi] So, you two have been friends for a while? That's awesome!
[Chen] Yeah, we've been mutuals for years. I couldn't pass up the chance to attend NYU with Reona.
[Narrator] The trio continues to explore the party, enjoying the music, food, drinks, and the company.
[Reona] (laughs) I never thought I'd see you dance, Chen! You're actually pretty good!
[Chen] (blushing) Well, I've been practicing just for this moment.
[Narrator] As the night wears on, Yumi overhears a tantalizing rumor from a group of students.
[Yumi] Hey, Reona, Chen! I just heard something really interesting. Apparently, our dorm is haunted!
[Reona] (intrigued) Really? By what kind of spirit?
[Yumi] They say it's a lovelorn ghost, tied to the building by the memory of a tragic romance.`,
    playerChoices: [
      `[Reona] Well, we should definitely investigate. Who knows, maybe it's connected to that love letter we found!`,
      `[Reona] I have a feeling that it might be connected to that locket Wiktor carries around!`,
      `[Reona] That's so scary! I don't want to get involved with ghosts.`,
    ],
    location: "party room, NYU dorm",
    musicRecommendation: "Caribou - You and I (Instrumental)",
    summary:
      "Reona and Yumi goes to an orientation party at the dorm, they meet Chen, Reona's online friend, and they hear a rumor that the dorm is haunted",
  },
};

// GPT for script update
export const generateGameScriptsUpdatePromptTemplate = (input: {
  request?: string;
  scene: string;
  oldLine: string;
  newLine: string;
}) => {
  return {
    prompt: `
Update the script for the scene according below, by replacing the line:
"${input.oldLine}"
with:
"${input.newLine}".
${input.request ? input.request : ""}
Do not change any lines before the change request, but do update the scene's name, summary, and the lines that follows the change request to make the script flow naturally.
Be creative. And emphasize the change since it's very important to the plot.
The script should have between 30 to 50 lines.
The scene should start and end with the narrator.
Return only the full updated script in the same JSON format.

Input:
${input.scene}

Output:
`,
  };
};

// GPT for story summary

// DALL-E for image generation

export const generateGameImagePromptTemplate = (input: {
  object: string;
  type: string;
  style: string;
}) => {
  return { prompt: `${input.object}, ${input.type}, ${input.style}` };
};

export const generateGameImageGenPortraitPromptTemplate = (input: {
  object: string;
  style: string;
}) => {
  return { prompt: `${input.object}, portrait, ${input.style}` };
};

export const generateGameImageGenBackgroundPromptTemplate = (input: {
  object: string;
  style: string;
}) => {
  return { prompt: `${input.object}, background, ${input.style}` };
};

export const exampleImageGenPortraitObjectPrompts = [
  "university student, girl, blond, glasses",
  "professor, male, middle aged, white hair, handsome",
];

export const exampleImageGenBackgroundObjectPrompts = [
  "dark basement, empty, creepy",
  "university campus, sunny, busy",
];

export const exampleImageGenStylePrompts = [
  "pencil drawing, sketch",
  "painting, Egon Schiele",
  "oil painting with gold and silver, Klimt",
  "oil painting, Matisse",
  "oil painting, colorful, Van Gogh",
  "oil painting, abstract, picasso",
];

// GPT for Eleven Voice Selection

export const generateElevenVoiceSelectionPromptTemplate = (input: {
  inputCharacters: string;
  availableVoices?: string;
  exampleElevenVoiceInput?: string;
  exampleElevenVoiceOutput?: string;
}) => {
  return {
    prompt: `
Select a voice for each of the characters, avoid using the same voice for multiple characters if possible.
Try to match the gender of the voice to the gender of the character.
Pay close attention to the output format in JSON.
    
Voices available: ${
      input.availableVoices ?? JSON.stringify(availableVoices, null, 1)
    }

Example input: ${
      input.exampleElevenVoiceInput ??
      JSON.stringify(exampleElevenVoiceInput, null, 1)
    }

Example output: ${
      input.exampleElevenVoiceOutput ??
      JSON.stringify(exampleElevenVoiceOutput, null, 1)
    }

End Example

Input: ${input.inputCharacters}

Output: 
`,
  };
};

const availableVoices = publicElevenVoices;

export const exampleElevenVoiceInput = {
  characters: [
    {
      id: 0,
      name: "Reona",
      description:
        "player character, female, 18, bisexual, 1st year NYU student, Italian, kind, shy, clumsy, energetic. Likes sweets, anime, video games; dislikes spicy food, bugs, being alone.",
    },
    {
      id: 1,
      name: "Diego",
      description:
        "potential love interest, male, 38, bisexual, NYU assistant professor of Japanese history, exorcist. Likes cooking, books, literature, music, art, history, philosophy, animals; dislikes being called old, summer, instant food. Reona's professor.",
    },
  ],
};

export const exampleElevenVoiceOutput = {
  characters: [
    {
      id: 0,
      name: "Reona",
      description:
        "player character, female, 18, bisexual, 1st year NYU student, Italian, kind, shy, clumsy, energetic. Likes sweets, anime, video games; dislikes spicy food, bugs, being alone.",
      voice: {
        type: "elevenAI",
        voiceId: "21m00Tcm4TlvDq8ikWAM",
        name: "Rachel",
        gender: "female",
      },
    },
    {
      id: 1,
      name: "Diego",
      description:
        "potential love interest, male, 38, bisexual, NYU assistant professor of Japanese history, exorcist. Likes cooking, books, literature, music, art, history, philosophy, animals; dislikes being called old, summer, instant food. Reona's professor.",
      voice: {
        type: "elevenAI",
        voiceId: "TxGEqnHWrfWFTfGW9XjX",
        name: "Josh",
        gender: "male",
      },
    },
  ],
};
