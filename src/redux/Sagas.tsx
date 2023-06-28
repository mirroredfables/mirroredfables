import {
  call,
  put,
  fork,
  select,
  take,
  takeEvery,
  takeLatest,
} from "redux-saga/effects";
import {
  generateImage,
  rewriteDallERequestPrompt,
  saveImage,
} from "./ImagesSlice";
import { generateGameImagePromptTemplate } from "../prompts/GamePrompts";
import {
  VisualNovelGameCharacter,
  VisualNovelGameMusic,
  VisualNovelGameScene,
} from "./VisualNovelGameTypes";
import {
  generateInitialWorldResponseDataTemplate,
  generateInitialScenesResponseDataTemplate,
  generateScriptResponseDataTemplate,
  updateScriptResponseDataTemplate,
  generateVoicesResponseDataTemplate,
  fixBrokenJson,
  generateInitialWorld,
  generateScenes,
  generateScript,
  generateScriptFromPrevious,
  generateSceneWithNewLine,
  generateVoices,
  searchYoutubeForMusic,
} from "./GameGenerator";
import {
  resetGameFully,
  addGameMakerMessage,
  setInitialWorld,
  upsertScenes,
  setCompleted,
  setGeneratorBusy,
  rewriteStory,
} from "./GameSlice";

function* sagaTest(action) {
  const state = yield select();
  console.log("sagaTest - action", action);
  console.log("sagaTest - state", state);
}

function* sagaAddSystemMessage(action: { payload: { message: string } }) {
  yield put(
    addGameMakerMessage({ message: `[worker] ${action.payload.message}` })
  );
}

function* sagaRepairJson(action: {
  payload: {
    jsonString: string;
    jsonTemplate?: string;
  };
}) {
  yield put({
    type: "ADD_SYSTEM_MESSAGE",
    payload: {
      message: "Attempting to repair JSON...",
    },
  });
  try {
    yield put(fixBrokenJson(action.payload));
    const result = yield take(fixBrokenJson.fulfilled);
    const resultContent = result.payload.choices[0].message.content;
    yield put({ type: "REPAIR_JSON_SUCCEEDED", payload: resultContent });
    yield put({
      type: "ADD_SYSTEM_MESSAGE",
      payload: {
        message: "Repair JSON succeeded.",
      },
    });
    return resultContent;
  } catch (e) {
    yield put({ type: "REPAIR_JSON_FAILED", payload: { message: e.message } });
    yield put({
      type: "ADD_SYSTEM_MESSAGE",
      payload: {
        message: "Repair JSON failed.",
      },
    });
  }
}

function* sagaParseJson(action: {
  payload: {
    contentRaw: string;
    jsonTemplate?: string;
  };
}) {
  yield put({
    type: "ADD_SYSTEM_MESSAGE",
    payload: { message: "Parsing response..." },
  });
  try {
    const content = JSON.parse(action.payload.contentRaw);
    yield put({
      type: "ADD_SYSTEM_MESSAGE",
      payload: { message: "Parsing succeeded." },
    });
    return content;
  } catch (e) {
    yield put({
      type: "ADD_SYSTEM_MESSAGE",
      payload: { message: "Parsing failed..." },
    });
    // repair json
    const repairedRawContent = yield call(sagaRepairJson, {
      payload: {
        jsonString: action.payload.contentRaw,
        jsonTemplate: action.payload.jsonTemplate,
      },
    });
    const repairedContent = JSON.parse(repairedRawContent);
    yield put({
      type: "ADD_SYSTEM_MESSAGE",
      payload: { message: "Parsing succeeded." },
    });
    return repairedContent;
  }
}

function* sagaGenerateGame(action: {
  payload: { setting: string; noImage?: boolean };
}) {
  yield put({
    type: "ADD_SYSTEM_MESSAGE",
    payload: {
      message:
        "Generator started... Please be patient as this may take up to 10 minutes.",
    },
  });

  yield put({ type: "RESET_GAME" });
  yield take("RESET_GAME_SUCCEEDED");

  yield put({ type: "GENERATE_WORLD", payload: action.payload });
  const generateWorldResult = yield take("GENERATE_WORLD_SUCCEEDED");

  yield put({
    type: "GENERATE_MORE_SCENES",
    payload: { request: "generate 12 scenes" },
  });
  yield take("GENERATE_MORE_SCENES_SUCCEEDED");

  // TODO: this is for testing
  yield put({
    type: "GENERATE_FULL_SCENE",
    payload: {
      request:
        "generate scripts for the initial scene, include foreshadowing for the scenes in the future. The script should have between 30 to 50 lines.",
      writingStyle: generateWorldResult.payload.world.writingStyle,
      artStyle: generateWorldResult.payload.world.artStyle,
      targetSceneId: 0,
      noImage: action.payload.noImage,
    },
  });
  yield take("GENERATE_FULL_SCENE_SUCCEEDED");

  yield put({ type: "GENERATE_GAME_SUCCEEDED" });
  yield put({
    type: "ADD_SYSTEM_MESSAGE",
    payload: { message: "Generator succeeded!" },
  });

  yield put(setCompleted({ completed: true }));
}

function* sagaResetGame(action) {
  yield put(resetGameFully({}));

  yield put({ type: "RESET_GAME_SUCCEEDED" });
}

function* sagaGenerateWorld(action: {
  payload: { setting: string; noImage?: boolean };
}) {
  yield put({
    type: "ADD_SYSTEM_MESSAGE",
    payload: { message: "Generating world..." },
  });

  const initialWorldResponse = yield call(subSagaGenerateInitialWorld, action);

  const gameWorld = initialWorldResponse;

  let worldImage = "";
  if (!action.payload.noImage) {
    worldImage = yield call(sagaGenerateImage, {
      payload: {
        object: gameWorld.world.setting,
        type: "background",
        style: gameWorld.world.artStyle,
        save: true,
      },
    });
  }
  gameWorld.titleBackground = {
    name: gameWorld.world.setting,
    image: worldImage,
  };

  const state = yield select();
  // TODO: change this when other voices are available
  if (state.systemSettings.elevenKey) {
    const characterWithVoices = yield call(subSagaGenerateVoices, {
      payload: { characters: gameWorld.characters },
    });
    gameWorld.characters = characterWithVoices;
  }

  for (const character of gameWorld.characters) {
    let characterImage = "";
    if (!action.payload.noImage) {
      characterImage = yield call(sagaGenerateImage, {
        payload: {
          object: character.description,
          type: "character portrait",
          style: gameWorld.world.artStyle,
          save: true,
        },
      });
    }
    character.image = characterImage;
  }

  // set it in the game maker
  yield put(setInitialWorld(gameWorld));

  yield put({
    type: "GENERATE_WORLD_SUCCEEDED",
    payload: gameWorld,
  });
  yield put({
    type: "ADD_SYSTEM_MESSAGE",
    payload: { message: "Generating world succeeded." },
  });

  return gameWorld;
}

function* subSagaGenerateInitialWorld(action: {
  payload: { setting: string };
}) {
  try {
    yield put({
      type: "ADD_SYSTEM_MESSAGE",
      payload: { message: "Generating initial world..." },
    });
    yield put(generateInitialWorld(action.payload));
    // TODO: add in a retry here in case openAI is busy?
    const generateInitialWorldResponse = yield take(
      generateInitialWorld.fulfilled
    );
    const contentRaw =
      generateInitialWorldResponse.payload.choices[0].message.content;
    const content = yield call(sagaParseJson, {
      payload: {
        contentRaw: contentRaw,
        jsonTemplate: JSON.stringify(
          generateInitialWorldResponseDataTemplate,
          null,
          1
        ),
      },
    });
    yield put({
      type: "ADD_SYSTEM_MESSAGE",
      payload: { message: "Generating initial world succeeded." },
    });
    yield put({
      type: "GENERATE_INITIAL_WORLD_SUCCEEDED",
      payload: content,
    });
    return content;
  } catch (e) {
    yield put({
      type: "GENERATE_INITIAL_WORLD_REQUEST_FAILED",
      payload: { message: e.message },
    });
    yield put({
      type: "ADD_SYSTEM_MESSAGE",
      payload: { message: "Generating initial world failed..." },
    });
    yield put({
      type: "ADD_SYSTEM_MESSAGE",
      payload: { message: e.message },
    });
  }
}

function* subSagaGenerateVoices(action: {
  payload: {
    characters: VisualNovelGameCharacter[];
  };
}) {
  yield put({
    type: "ADD_SYSTEM_MESSAGE",
    payload: { message: "Generating voices..." },
  });
  try {
    yield put(generateVoices(action.payload));
    // TODO: add in a retry here in case openAI is busy?
    const generateVoicesResponse = yield take(generateVoices.fulfilled);
    const contentRaw =
      generateVoicesResponse.payload.choices[0].message.content;
    const content = yield call(sagaParseJson, {
      payload: {
        contentRaw: contentRaw,
        jsonTemplate: JSON.stringify(
          generateVoicesResponseDataTemplate,
          null,
          1
        ),
      },
    });
    const characters = content.characters;
    yield put({
      type: "GENERATE_VOICES_REQUEST_SUCCEEDED",
      payload: characters,
    });
    yield put({
      type: "ADD_SYSTEM_MESSAGE",
      payload: { message: "Generating voices succeeded..." },
    });
    return characters;
  } catch (e) {
    yield put({
      type: "GENERATE_VOICES_REQUEST_FAILED",
      payload: { message: e.message },
    });
    yield put({
      type: "ADD_SYSTEM_MESSAGE",
      payload: { message: "Generating voices failed..." },
    });
    yield put({
      type: "ADD_SYSTEM_MESSAGE",
      payload: { message: e.message },
    });
  }
}

function* sagaGenerateMoreScenes(action: {
  payload: {
    request: string;
  };
}) {
  yield put({
    type: "ADD_SYSTEM_MESSAGE",
    payload: { message: "Generating scenes..." },
  });
  yield put(setGeneratorBusy({ busy: true }));
  const scenes = yield call(subSagaGenerateMoreScenes, action);
  // set it in the game maker
  yield put(upsertScenes(scenes));

  yield put({
    type: "GENERATE_MORE_SCENES_SUCCEEDED",
    payload: scenes,
  });
  yield put({
    type: "ADD_SYSTEM_MESSAGE",
    payload: { message: "Generating scenes succeeded." },
  });
  yield put(setGeneratorBusy({ busy: false }));
  return scenes;
}

function* subSagaGenerateMoreScenes(action: {
  payload: {
    request: string;
  };
}) {
  yield put({
    type: "ADD_SYSTEM_MESSAGE",
    payload: { message: "Generating scenes outline..." },
  });
  try {
    yield put(generateScenes(action.payload));
    // TODO: add in a retry here in case openAI is busy?
    const generateScenesResponse = yield take(generateScenes.fulfilled);
    const contentRaw =
      generateScenesResponse.payload.choices[0].message.content;
    yield put({
      type: "ADD_SYSTEM_MESSAGE",
      payload: { message: "Generating scenes outline succeeded." },
    });
    const content = yield call(sagaParseJson, {
      payload: {
        contentRaw: contentRaw,
        jsonTemplate: JSON.stringify(
          generateInitialScenesResponseDataTemplate,
          null,
          1
        ),
      },
    });
    yield put({ type: "GENERATE_SCENES_OUTLINE_SUCCEEDED", payload: content });
    yield put({
      type: "ADD_SYSTEM_MESSAGE",
      payload: { message: "Generating script parse succeeded." },
    });
    return content;
  } catch (e) {
    yield put({
      type: "GENERATE_SCENES_OUTLINE_FAILED",
      payload: { message: e.message },
    });
    yield put({
      type: "ADD_SYSTEM_MESSAGE",
      payload: { message: "Generating scenes outline failed." },
    });
    // TODO: handle errors here
  }
}

function* sagaGenerateFullScene(action: {
  payload: {
    request: string;
    writingStyle: string;
    artStyle: string;
    targetSceneId?: number;
    exampleScriptsGenInput?: string;
    exampleScriptsGenOutput?: string;
    noImage?: boolean;
  };
}) {
  yield put({
    type: "ADD_SYSTEM_MESSAGE",
    payload: { message: "Generating full scene..." },
  });
  yield put(setGeneratorBusy({ busy: true }));
  try {
    const scene = yield call(subSagaGenerateScript, action);

    const music = yield call(sagaSearchYoutubeForMusic, {
      payload: { scene: scene },
    });
    scene.music = music;

    let image = "";
    if (!action.payload.noImage) {
      image = yield call(sagaGenerateImage, {
        payload: {
          object: scene.location,
          type: "background",
          style: action.payload.artStyle,
          save: true,
        },
      });
    }
    scene.background = {
      name: scene.location,
      image: image,
    };

    // set it in the game maker
    yield put(upsertScenes({ scenes: [scene] }));

    yield put({ type: "GENERATE_FULL_SCENE_SUCCEEDED", payload: scene });
    yield put({
      type: "ADD_SYSTEM_MESSAGE",
      payload: { message: "Generating full scene succeeded." },
    });
    yield put(setGeneratorBusy({ busy: false }));

    return scene;
  } catch (e) {
    yield put({
      type: "GENERATE_FULL_SCENE_FAILED",
      payload: { message: e.message },
    });
    yield put({
      type: "ADD_SYSTEM_MESSAGE",
      payload: { message: "Generating full scene failed." },
    });
    yield put(setGeneratorBusy({ busy: false }));
    // TODO: handle errors here
  }
}

function* subSagaGenerateScript(action: {
  payload: {
    request: string;
    writingStyle?: string;
    targetSceneId?: number;
    exampleScriptsGenInput?: string;
    exampleScriptsGenOutput?: string;
  };
}) {
  yield put({
    type: "ADD_SYSTEM_MESSAGE",
    payload: { message: "Generating script..." },
  });
  try {
    let generateScriptResponse;
    if (action.payload.targetSceneId && action.payload.targetSceneId > 0) {
      yield put(generateScriptFromPrevious(action.payload));
      // TODO: add in a retry here in case openAI is busy?
      generateScriptResponse = yield take(generateScriptFromPrevious.fulfilled);
    } else {
      yield put(generateScript(action.payload));
      // TODO: add in a retry here in case openAI is busy?
      generateScriptResponse = yield take(generateScript.fulfilled);
    }
    const contentRaw =
      generateScriptResponse.payload.choices[0].message.content;
    yield put({
      type: "ADD_SYSTEM_MESSAGE",
      payload: { message: "Generating script succeeded." },
    });
    const content = yield call(sagaParseJson, {
      payload: {
        contentRaw: contentRaw,
        jsonTemplate: JSON.stringify(
          generateScriptResponseDataTemplate,
          null,
          1
        ),
      },
    });
    const scene = content.scene as VisualNovelGameScene;
    yield put({ type: "GENERATE_INITIAL_SCRIPT_SUCCEEDED", payload: scene });
    yield put({
      type: "ADD_SYSTEM_MESSAGE",
      payload: { message: "Generating script parse succeeded." },
    });
    return scene;
  } catch (e) {
    yield put({
      type: "GENERATE_INITIAL_SCRIPT_FAILED",
      payload: { message: e.message },
    });
    yield put({
      type: "ADD_SYSTEM_MESSAGE",
      payload: { message: "Generating script failed." },
    });
    // TODO: handle errors here
  }
}

function* sagaUpdateSceneWithNewLine(action: {
  payload: {
    request?: string;
    targetSceneId: number;
    targetTurnId: number;
    oldLine: string;
    newLine: string;
  };
}) {
  yield put({
    type: "ADD_SYSTEM_MESSAGE",
    payload: {
      message: `Updating scene ${action.payload.targetSceneId} with new line...`,
    },
  });
  yield put(setGeneratorBusy({ busy: true }));

  yield put(
    rewriteStory({
      sceneId: action.payload.targetSceneId,
      turnId: action.payload.targetTurnId,
      text: action.payload.newLine,
    })
  );

  const scene = yield call(subSagaGenerateSceneWithNewLine, action);

  yield put(upsertScenes({ scenes: [scene] }));

  yield put(setGeneratorBusy({ busy: false }));
}

function* subSagaGenerateSceneWithNewLine(action: {
  payload: {
    request?: string;
    targetSceneId: number;
    oldLine: string;
    newLine: string;
  };
}) {
  yield put({
    type: "ADD_SYSTEM_MESSAGE",
    payload: {
      message: `Generating scene ${action.payload.targetSceneId} with new line...`,
    },
  });
  try {
    yield put(generateSceneWithNewLine(action.payload));
    const generateSceneWithNewLineResponse = yield take(
      generateSceneWithNewLine.fulfilled
    );
    const contentRaw =
      generateSceneWithNewLineResponse.payload.choices[0].message.content;
    yield put({
      type: "ADD_SYSTEM_MESSAGE",
      payload: {
        message: `Generating scene ${action.payload.targetSceneId} with new line succeeded.`,
      },
    });
    const content = yield call(sagaParseJson, {
      payload: {
        contentRaw: contentRaw,
        jsonTemplate: JSON.stringify(updateScriptResponseDataTemplate, null, 1),
      },
    });
    const scene = content as VisualNovelGameScene;
    yield put({
      type: "GENERATE_SCENE_WITH_NEW_LINE_SUCCEEDED",
      payload: scene,
    });
    yield put({
      type: "ADD_SYSTEM_MESSAGE",
      payload: {
        message: `Generating scene ${action.payload.targetSceneId} with new line succeeded.`,
      },
    });

    return scene;
  } catch (e) {
    yield put({
      type: "GENERATE_SCENE_WITH_NEW_LINE_FAILED",
      payload: { message: e.message },
    });
    yield put({
      type: "ADD_SYSTEM_MESSAGE",
      payload: {
        message: `Generating scene ${action.payload.targetSceneId} with new line failed.`,
      },
    });
  }
}

function* sagaSearchYoutubeForMusic(action: {
  payload: { scene: VisualNovelGameScene };
}) {
  yield put({
    type: "ADD_SYSTEM_MESSAGE",
    payload: { message: "Searching for music..." },
  });
  try {
    yield put(
      searchYoutubeForMusic({
        query: action.payload.scene.musicRecommendation,
      })
    );
    const searchYoutubeResponse = yield take(searchYoutubeForMusic.fulfilled);
    const videoId = searchYoutubeResponse.payload.video_id as string;
    // TODO: should handle when no video is found
    const music = {
      type: "youtube",
      name: action.payload.scene.musicRecommendation,
      info: "",
      uri: videoId,
      loop: true,
    } as VisualNovelGameMusic;
    yield put({ type: "SEARCH_YOUTUBE_FOR_MUSIC_SUCCEEDED", payload: music });
    yield put({
      type: "ADD_SYSTEM_MESSAGE",
      payload: { message: "Searching for music succeeded." },
    });
    return music;
  } catch (e) {
    yield put({
      type: "SEARCH_YOUTUBE_FOR_MUSIC_FAILED",
      payload: { message: e.message },
    });
    yield put({
      type: "ADD_SYSTEM_MESSAGE",
      payload: { message: "Searching for music failed..." },
    });
    // TODO: handle music search failure, maybe ask for another recommendation?
    const noMusic = {
      type: "youtube",
      name: "",
      info: "",
      uri: "",
      loop: true,
    } as VisualNovelGameMusic;
    // TODO: do this for now
    yield put({ type: "SEARCH_YOUTUBE_FOR_MUSIC_SUCCEEDED", payload: noMusic });
    return noMusic;
  }
}

function* sagaGenerateImage(action: {
  payload: {
    object: string;
    type: string;
    style: string;
    save?: boolean;
  };
}) {
  yield put({
    type: "ADD_SYSTEM_MESSAGE",
    payload: { message: "Generating image started..." },
  });

  const imageOriginal = yield call(subSagaGenerateOriginalImage, {
    payload: {
      object: action.payload.object,
      type: action.payload.type,
      style: action.payload.style,
    },
  });

  if (imageOriginal == "") {
    // HACKY
    console.log("imageOriginal is empty");
    return imageOriginal;
  }

  if (!action.payload.save) {
    yield put({
      type: "ADD_SYSTEM_MESSAGE",
      payload: { message: "Generating image succeeded." },
    });
    return imageOriginal;
  }

  const imageCopy = yield call(subSagaUploadImageViaUrl, {
    payload: {
      image: imageOriginal,
    },
  });
  yield put({
    type: "ADD_SYSTEM_MESSAGE",
    payload: { message: "Generating image succeeded." },
  });
  return imageCopy;
}

function* subSagaGenerateOriginalImage(action: {
  payload: {
    object: string;
    type: string;
    style: string;
  };
}) {
  try {
    yield put({
      type: "ADD_SYSTEM_MESSAGE",
      payload: { message: "Generating image with worker..." },
    });
    const prompt = generateGameImagePromptTemplate({
      object: action.payload.object,
      type: action.payload.type,
      style: action.payload.style,
    }).prompt;
    yield put(
      generateImage({
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        response_format: "url",
      })
    );
    const generateImageResponse = yield take(generateImage.fulfilled);
    const image = generateImageResponse.payload[0].url as string;
    yield put({
      type: "ADD_SYSTEM_MESSAGE",
      payload: { message: "Generating image with worker succeeded." },
    });
    return image;
  } catch (e) {
    yield put({
      type: "ADD_SYSTEM_MESSAGE",
      payload: { message: "Generating image with worker failed." },
    });
    yield put({
      type: "ADD_SYSTEM_MESSAGE",
      payload: { message: e.message },
    });
    return "";
  }
}

function* subSagaUploadImageViaUrl(action: {
  payload: {
    image: string;
  };
}) {
  yield put({
    type: "ADD_SYSTEM_MESSAGE",
    payload: { message: "Saving image with worker..." },
  });
  yield put(saveImage(action.payload));
  const saveImageResponse = yield take(saveImage.fulfilled);
  const image = saveImageResponse.payload.result.variants[0] as string;
  yield put({
    type: "ADD_SYSTEM_MESSAGE",
    payload: { message: "Saving image with worker succeeded." },
  });
  return image;
}

function* sagaRepairDallEGenerateImage(action: {
  payload: {
    error: {
      message: string;
    };
  };
  meta: {
    arg: {
      prompt: string;
    };
  };
}) {
  yield put({
    type: "ADD_SYSTEM_MESSAGE",
    payload: { message: action.payload.error.message },
  });
  yield put({
    type: "ADD_SYSTEM_MESSAGE",
    payload: {
      message: "There was an error generating image... attempting repair.",
    },
  });
  if (action.payload.error.message.includes("safety system")) {
    yield put({
      type: "ADD_SYSTEM_MESSAGE",
      payload: { message: "Attempting to rewrite prompt..." },
    });
    yield put(rewriteDallERequestPrompt({ prompt: action.meta.arg.prompt }));
    const rewriteResponse = yield take(rewriteDallERequestPrompt.fulfilled);
    yield put({
      type: "ADD_SYSTEM_MESSAGE",
      payload: { message: "Rewrite prompt succeeded... Regenerating image..." },
    });
    const newPrompt = rewriteResponse.payload.choices[0].message.content;
    yield put(
      generateImage({
        prompt: newPrompt,
        n: 1,
        size: "1024x1024",
        response_format: "url",
      })
    );
  }
}

function* watchStartGame() {
  // TODO
  //   yield takeEvery("START_GAME", sagaStartGame);
}

function* watchGenerateGame() {
  yield takeEvery("GENERATE_GAME", sagaGenerateGame);
}

function* watchResetGame() {
  yield takeEvery("RESET_GAME", sagaResetGame);
}

function* watchGenerateWorld() {
  yield takeEvery("GENERATE_WORLD", sagaGenerateWorld);
}

function* watchGenerateMoreScenes() {
  yield takeEvery("GENERATE_MORE_SCENES", sagaGenerateMoreScenes);
}

function* watchGenerateFullScene() {
  yield takeEvery("GENERATE_FULL_SCENE", sagaGenerateFullScene);
}

function* watchUpdateSceneWithNewLine() {
  yield takeEvery("UPDATE_SCENE_WITH_NEW_LINE", sagaUpdateSceneWithNewLine);
}

function* watchAddCharacters() {
  // TODO
  //   yield takeEvery("ADD_CHARACTERS", sagaAddCharacter)
}

function* watchUpdateGameWorld() {
  // TODO
  //   yield takeEvery("UPDATE_GAME_WORLD", sagaUpdateGameWorld)
}

function* watchTest() {
  yield takeEvery("TEST", sagaTest);
}

function* watchAddMessage() {
  yield takeEvery("ADD_SYSTEM_MESSAGE", sagaAddSystemMessage);
}

function* watchRepairJson() {
  return takeEvery("REPAIR_JSON", sagaRepairJson);
}

function* watchGenerateImage() {
  yield takeEvery("GENERATE_IMAGE", sagaGenerateImage);
}

function* watchRepairGenerateImage() {
  yield takeEvery(generateImage.rejected, sagaRepairDallEGenerateImage);
}

function* watchUploadImageViaUrl() {
  yield takeEvery("UPLOAD_IMAGE_VIA_URL", subSagaUploadImageViaUrl);
}

function* watchSearchYoutubeForMusic() {
  yield takeEvery("SEARCH_YOUTUBE_FOR_MUSIC", sagaSearchYoutubeForMusic);
}

function* rootSaga() {
  // primaries
  yield fork(watchStartGame);
  yield fork(watchGenerateGame);
  //
  yield fork(watchResetGame);
  yield fork(watchGenerateWorld);
  yield fork(watchGenerateMoreScenes);
  yield fork(watchGenerateFullScene);
  // secondaries
  yield fork(watchUpdateSceneWithNewLine);
  //   yield fork(watchAddCharacters);
  //   yield fork(watchUpdateGameWorld);
  // helpers
  yield fork(watchTest);
  yield fork(watchAddMessage);
  yield fork(watchRepairJson);
  yield fork(watchGenerateImage);
  yield fork(watchRepairGenerateImage);
  yield fork(watchUploadImageViaUrl);
  yield fork(watchSearchYoutubeForMusic);
}

export default rootSaga;
