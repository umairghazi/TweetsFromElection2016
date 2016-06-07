import React, {StyleSheet, Dimensions, PixelRatio} from "react-native";
const {width, height, scale} = Dimensions.get("window"),
    vw = width / 100,
    vh = height / 100,
    vmin = Math.min(vw, vh),
    vmax = Math.max(vw, vh);

export default StyleSheet.create({
    "header": {
        "boxSizing": "border-box",
        "textAlign": "center",
        "width": "100%",
        "paddingTop": 25,
        "paddingRight": 40,
        "paddingBottom": 25,
        "paddingLeft": 40,
        "backgroundColor": "#673AB7",
        "overflow": "hidden"
    },
    "header h1": {
        "float": "left",
        "font": "normal 24px/1.5 'Open Sans', sans-serif",
        "color": "#fff"
    },
    "header a": {
        "color": "#fff",
        "float": "right",
        "textDecoration": "none",
        "display": "inline-block",
        "paddingTop": 13,
        "paddingRight": 50,
        "paddingBottom": 13,
        "paddingLeft": 50,
        "borderRadius": 3,
        "font": "bold 14px/1 'Open Sans', sans-serif",
        "textTransform": "uppercase",
        "backgroundColor": "#F05283"
    },
    "btn-half-left": {
        "width": "50%",
        "float": "left"
    },
    "btn-half-right": {
        "width": "50%",
        "float": "right"
    }
});