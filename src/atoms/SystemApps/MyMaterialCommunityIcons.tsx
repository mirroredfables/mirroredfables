// TODO: This is a hack to bypass a metro packing issue
import { createIconSet } from "@expo/vector-icons";
// import font from "..//Fonts/MaterialCommunityIcons.ttf";
import glyphMap from "../../../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json";
export default createIconSet(
  glyphMap,
  "MaterialCommunityIcons",
  "MaterialCommunityIcons"
);
//# sourceMappingURL=MaterialCommunityIcons.js.map
