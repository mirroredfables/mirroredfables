// TODO: This is a hack to bypass a metro packing issue
import { createIconSet } from "@expo/vector-icons";
import glyphMap from "../../../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/FontAwesome.json";
export default createIconSet(glyphMap, "FontAwesome", "FontAwesome");
