import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableHighlight,
  ScrollView,
} from "react-native";
import "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
export default function App({ navigation }) {
  const Algorithms = [
    { id: "0", name: "FCFS" },
    { id: "1", name: "SJF" },
    { id: "2", name: "SRTF" },
    { id: "3", name: "Round Robin" },
    { id: "4", name: "LJF" },
    { id: "5", name: "LRTF" },
    { id: "6", name: "Priority Scheduling(P)" },
    { id: "7", name: "Priority Scheduling(NP)" },
  ];
  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <SafeAreaView
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* <Text style={{ fontSize: 40, fontWeight: "bold" }}>CPU Scheduling</Text> */}
        <View style={styles.container}>
          <TouchableHighlight
            style={styles.algoBox}
            onPress={() => [
              navigation.navigate("FCFS Algorithm", Algorithms[0]),
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
            ]}
          >
            <View
              style={[styles.algoBox, { backgroundColor: "rgb(5, 116, 95)" }]}
            >
              <LinearGradient
                colors={["rgba(59,223,210,0.8)", "transparent"]}
                style={styles.algoBgColor}
              />
              <Image
                style={styles.algoBoxImg}
                height={100}
                source={require("../assets/algoIcons/flagIcon.png")}
              ></Image>
              <Text style={styles.algoBoxTxt}>FCFS</Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.algoBox}
            onPress={() => [
              navigation.navigate("SJF Algorithm", Algorithms[1]),
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
            ]}
          >
            <View
              style={[styles.algoBox, { backgroundColor: "rgb(25,84,123)" }]}
            >
              <LinearGradient
                colors={["rgba(255, 170, 34,0.8)", "transparent"]}
                style={styles.algoBgColor}
              />
              <Image
                style={styles.algoBoxImg}
                width={100}
                source={require("../assets/algoIcons/fast-forward.png")}
              ></Image>
              <Text style={styles.algoBoxTxt}>SJF</Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.algoBox}
            onPress={() => [
              navigation.navigate("SRTF Algorithm", Algorithms[2]),
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
            ]}
          >
            <View
              style={[styles.algoBox, { backgroundColor: "rgb(1, 95, 223)" }]}
            >
              <LinearGradient
                colors={["rgba(30, 210, 252,0.8)", "transparent"]}
                style={styles.algoBgColor}
              />
              <Image
                style={styles.algoBoxImg}
                width={100}
                source={require("../assets/algoIcons/clock.png")}
              ></Image>
              <Text style={styles.algoBoxTxt}>SRTF</Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.algoBox}
            onPress={() => [
              navigation.navigate("Round Robin Algorithm", Algorithms[3]),
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
            ]}
          >
            <View
              style={[styles.algoBox, { backgroundColor: "rgb(255, 170, 34)" }]}
            >
              <LinearGradient
                colors={["rgba(182, 10, 250, 0.95)", "transparent"]}
                style={styles.algoBgColor}
              />
              <Image
                style={styles.algoBoxImg}
                source={require("../assets/algoIcons/refresh.png")}
              ></Image>
              <Text
                style={{ fontSize: 26, color: "white", fontWeight: "bold" }}
              >
                Round Robin
              </Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.algoBox}
            onPress={() => [
              navigation.navigate("LJF Algorithm", Algorithms[4]),
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
            ]}
          >
            <View
              style={[
                styles.algoBox,
                { backgroundColor: "rgb(178, 138, 242)" },
              ]}
            >
              <LinearGradient
                colors={["rgba(59, 31, 165,0.8)", "transparent"]}
                style={styles.algoBgColor}
              />
              <Image
                style={styles.algoBoxImg}
                height={100}
                source={require("../assets/algoIcons/watch.png")}
              ></Image>
              <Text style={styles.algoBoxTxt}>LJF</Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.algoBox}
            onPress={() => [
              navigation.navigate("LRTF Algorithm", Algorithms[5]),
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
            ]}
          >
            <View
              style={[styles.algoBox, { backgroundColor: "rgb(255, 170, 34)" }]}
            >
              <LinearGradient
                colors={["rgba(121, 74, 0,0.8)", "transparent"]}
                style={styles.algoBgColor}
              />
              <Image
                style={styles.algoBoxImg}
                height={100}
                source={require("../assets/algoIcons/server.png")}
              ></Image>
              <Text style={styles.algoBoxTxt}>LRTF</Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.algoBox_P}
            onPress={() => [
              navigation.navigate("PRIORITY SCHEDULING(P)", Algorithms[6]),
              ,
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
            ]}
          >
            <View
              style={[
                styles.algoBox_P,
                { backgroundColor: "rgb(250, 15, 15)" },
              ]}
            >
              <LinearGradient
                colors={["rgba(238, 234, 27,0.8)", "transparent"]}
                style={styles.algoBgColor}
              />
              <Image
                style={styles.algoBoxImg}
                marginBottom={0}
                width={100}
                height={100}
                source={require("../assets/algoIcons/priority.png")}
              ></Image>
              <Text
                style={{
                  fontSize: 22,
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Priority Scheduling (Preemptive)
              </Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.algoBox_P}
            onPress={() => [
              navigation.navigate("PRIORITY SCHEDULING(NP)", Algorithms[7]),
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
            ]}
          >
            <View
              style={[
                styles.algoBox_P,
                { backgroundColor: "rgb(250, 15, 15)" },
              ]}
            >
              <LinearGradient
                colors={["rgba(238, 234, 27,0.8)", "transparent"]}
                style={styles.algoBgColor}
              />
              <Image
                style={styles.algoBoxImg}
                marginBottom={0}
                width={100}
                height={100}
                source={require("../assets/algoIcons/priority.png")}
              ></Image>
              <Text
                style={{
                  fontSize: 22,
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Priority Scheduling (Non-Preemtive)
              </Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.historyBox}
            onPress={() => [
              navigation.navigate("Input History"),
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
            ]}
          >
            <View
              style={[styles.historyBoxView, { backgroundColor: "#45B649" }]}
            >
              <LinearGradient
                colors={["#DCE35B", "transparent"]}
                style={styles.algoBgColor}
              />
              <Text
                style={{
                  fontSize: 28,
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Input History
              </Text>
            </View>
          </TouchableHighlight>
          <StatusBar style="auto" />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginBottom: 50,
  },
  algoBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 170,
    width: 170,
    borderRadius: 16,
    marginVertical: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: "hidden",
    elevation: 5,
  },
  historyBox: {
    height: 80,
    width: "90%",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: "hidden",
    elevation: 3,
  },
  historyBoxView: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 80,
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
  },
  algoBox_P: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 220,
    width: 170,
    borderRadius: 16,
    marginVertical: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: "hidden",
    elevation: 5,
  },
  algoBgColor: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 170,
    borderRadius: 16,
  },
  algoBoxTxt: {
    fontSize: 36,
    color: "white",
    fontWeight: "bold",
  },
  algoBoxImg: {
    marginBottom: 20,
    height: 95,
    width: 100,
    borderRadius: 10,
  },
});
