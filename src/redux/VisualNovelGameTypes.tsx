export interface VisualNovelGameWorld {
  setting: string;
  artStyle: string;
  writingStyle: string;
}

export interface VisualNovelGameCharacterVoice {
  type: "elevenAI" | "system";
  voiceId: string;
  name?: string;
  gender?: string;
}

export interface VisualNovelGameCharacterForGenerator {
  id: number;
  name: string;
  description: string;
  // image: string;
  // voice?: VisualNovelGameCharacterVoice;
}

export interface VisualNovelGameCharacterForPlayer {
  id: number;
  name: string;
  // description: string;
  image?: string;
  voice?: VisualNovelGameCharacterVoice;
}

export interface VisualNovelGameCharacter
  extends VisualNovelGameCharacterForPlayer,
    VisualNovelGameCharacterForGenerator {
  // id: number;
  // name: string;
  // description: string;
  // image: string;
  // voice?: VisualNovelGameCharacterVoice;
}

export interface VisualNovelGameBackground {
  name: string;
  image: string;
}

export interface VisualNovelGameMusic {
  //   id: number;
  type: "youtube" | "local" | "remote";
  name: string;
  info: string;
  uri: string;
  //   uri: {
  //     value: any;
  //   };
  loop?: boolean;
}

export interface VisualNovelGameSceneForGenerator {
  id: number;
  name: string;
  //   summary?: string;
  //   script?: string;
  //   location?: string; // -> background
  //   musicRecommendation?: string; // -> music
  //   background?: VisualNovelGameBackground;
  //   music?: VisualNovelGameMusic;
}

export interface VisualNovelGameSceneForGeneratorWithScript
  extends VisualNovelGameSceneForGenerator {
  summary?: string;
  script?: string;
  location?: string; // -> background
  musicRecommendation?: string; // -> music
  //   background?: VisualNovelGameBackground;
  //   music?: VisualNovelGameMusic;
}

export interface VisualNovelGameSceneForPlayer {
  id: number;
  //   name: string;
  //   summary: string;
  //   script: string;
  //   location: string; // -> background
  //   musicRecommendation: string; // -> music
  background?: VisualNovelGameBackground;
  music?: VisualNovelGameMusic;
}

export interface VisualNovelGameScene
  extends VisualNovelGameSceneForGeneratorWithScript,
    VisualNovelGameSceneForPlayer {
  // id: number;
  // name: string;
  // summary?: string;
  // script?: string;
  // location?: string; // -> background
  // musicRecommendation?: string; // -> music
  // background?: VisualNovelGameBackground;
  // music?: VisualNovelGameMusic;
}

export interface VisualNovelGameAction {
  type: string;
  value: string;
}

// should generate the turn from the script
export interface VisualNovelGameTurn {
  id: number;
  sceneId: number;
  type: string;
  text: string;
  activePortrait?: string;
  actions?: VisualNovelGameAction[];
  choices?: [];
}
