import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  Text,
  TouchableOpacity,
  Switch,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";
import * as Haptics from "expo-haptics";

export default class InputTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalProcess: 0,
      tableHead: ["Process", "Arriving Time", "CPU Burst"],
      tableData: [["P0", 0, 0]],
      processes: ["P0"],
      tatarr: [],
      waitingarr: [],
      complitionarr: [],
      avgtat: 0,
      ganntChartArray: [],
      avgwaiting: 0,
      isChartGenerated: false,
      gotAnswer: false,
      currentCpuPID: "IDLE",
      currentQueuePID: [],
      currentSecond: 0,
      queueAnimationArray: [],
      isAnimationDone: false,
      isIoEnabled: false,
      time_Quantam: 2, // Time Quantam , Initially '2' (Added for Round robin Algorithm)
      from_history: false, // If Input Data comes from history
    };
    this.addProcess = this.addProcess.bind(this);
    this.deleteProcess = this.deleteProcess.bind(this);
    this.ganntChart = this.ganntChart.bind(this);
    this.getAnswer = this.getAnswer.bind(this);
    this.showAnimation = this.showAnimation.bind(this);
    this.animationCompleted = this.animationCompleted.bind(this);
    this.timeQuantamTextInput = this.timeQuantamTextInput.bind(this);
    this.toggleButton = this.toggleButton.bind(this);
  }

  checkForStorageKey = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("storage_key");

      if (jsonValue != null) {
      } else {
        AsyncStorage.setItem("storage_key", JSON.stringify(0));
      }
    } catch (e) {
      console.log("Couldn't Check For The Storage_Key Value");
      console.log(e);
    }
  };

  componentDidMount() {
    if (this.props.from_history == true) {
      // If the Input comes from History
      var history_data = this.props.inpt_data;
      var state = this.state;
      state.tableData = history_data["tableData"];
      state.tableHead = history_data["tableHead"];
      state.totalProcess = history_data["totalProcess"];
      state.processes = history_data["processes"];
      state.from_history = true;
      state.isIoEnabled = history_data["isIoEnabled"];
      state.time_Quantam = history_data["time_Quantam"];
      this.setState({ state });
    }
    this.checkForStorageKey(); // If there is not storage key Place a storage Key
  }
  getDate = () => {
    let today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    today = date + " @ " + time;

    return today;
  };

  storeData = async (id, data) => {
    var inpt_data = data;
    if (id != "storage_key") {
      inpt_data = { ...inpt_data, date: this.getDate() };
    }

    try {
      const jsonValue = id != "storage_key" ? JSON.stringify(inpt_data) : data;
      await AsyncStorage.setItem(id, jsonValue);
      //   return jsonValue;
    } catch (e) {
      console.log("Couldn't Store the Value");
      console.log(e);
    }
  };

  getAnswer = () => {
    if (this.props.from_history != true) {
      var inpt_data = {
        algorithm: this.props.algorithm,
        totalProcess: this.state.totalProcess,
        tableHead: this.state.tableHead,
        tableData: this.state.tableData,
        processes: this.state.processes,
        isIoEnabled: this.state.isIoEnabled,
        time_Quantam: this.state.time_Quantam,
      };
      var current_storage_key;

      AsyncStorage.getItem("storage_key", (err, value) => {
        if (err) {
          console.log(err);
        } else {
          current_storage_key = JSON.parse(value);
          inpt_data = { ...inpt_data, date: this.getDate() }; // Store the Date
          AsyncStorage.setItem(
            current_storage_key.toString(),
            JSON.stringify(inpt_data)
          ); // Store the Data
          AsyncStorage.setItem(
            "storage_key",
            JSON.stringify(current_storage_key + 1)
          ); // Update the Storage Key
        }
      });
    }

    (this.state.currentCpuPID = "IDLE"),
      (this.state.currentQueuePID = []),
      (this.state.currentSecond = 0),
      (this.state.isAnimationDone = false),
      this.props.onPress(this.state);
    this.state.avgtat = parseFloat(this.state.avgtat).toFixed(2);
    this.state.avgwaiting = parseFloat(this.state.avgwaiting).toFixed(2);
  };

  showAnimation() {
    setTimeout(() => {
      let total_seconds = this.state.ganntChartArray.length;
      if (total_seconds == this.state.currentSecond) {
        this.state.isAnimationDone = true;
      }

      var temp_cpu_id = this.state.ganntChartArray[this.state.currentSecond];
      if (temp_cpu_id == "/") temp_cpu_id = "IDLE";
      this.setState({
        currentCpuPID: temp_cpu_id,
        currentQueuePID: this.state.queueAnimationArray[
          this.state.currentSecond
        ],
        currentSecond: this.state.currentSecond + 1,
      });
    }, 2000);
  }

  animationCompleted() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    alert("Process Completed!");
  }

  ganntChart() {
    if (this.state.ganntChartArray.length == 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      alert("Add Processes & Press Evaluate First!");
      return null;
    }

    let n = this.state.ganntChartArray.length;
    var chartQueue = [];
    var i = 0;
    while (i < n) {
      var temp = {
        pid: this.state.ganntChartArray[i],
        start: i,
        end: i + 1,
      };
      i++;
      while (
        i < n &&
        this.state.ganntChartArray[i] == this.state.ganntChartArray[i - 1]
      ) {
        temp.end++;
        i++;
      }
      chartQueue.push(temp);
    }
    var chartData = [],
      widthArray = [];
    for (let i = 0; i < chartQueue.length; i += 1) {
      chartData.push(chartQueue[i].pid);
      widthArray.push(chartQueue[i].end - chartQueue[i].start);
    }
    var queueAnimationArrayCopy = this.state.queueAnimationArray[
      this.state.currentSecond
    ];

    var isAnimationFinished = this.state.isAnimationDone;
    var currentCpuProcess = this.state.currentCpuPID;

    function printAnimatetdQueueData() {
      var retunedData = [];
      retunedData.push(
        <Text
          key={0}
          style={{
            borderRadius: 8,
            letterSpacing: 1,
            borderWidth: 1,
            backgroundColor: "#00FF91",
            padding: 5,
            paddingLeft: 10,
            paddingRight: 10,
            fontSize: 16,
            marginRight: 10,
            fontWeight: "bold",
          }}
        >
          EMPTY
        </Text>
      );
      if (isAnimationFinished == true || queueAnimationArrayCopy.length == 0) {
        return retunedData;
      } else if (
        queueAnimationArrayCopy.length == 1 &&
        "P" + (queueAnimationArrayCopy[0] - 1).toString() == currentCpuProcess
      ) {
        return retunedData;
      }
      var printedData = [];
      for (let i = 0; i < queueAnimationArrayCopy.length; i++) {
        var currentQueueProcessId =
          "P" + (queueAnimationArrayCopy[i] - 1).toString();
        if (currentQueueProcessId == currentCpuProcess) continue;
        printedData.push(
          <Text
            key={i}
            style={{
              padding: 5,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#00a693",
              color: "white",
              borderWidth: 1,
              borderRadius: 5,
              fontWeight: "bold",
              textAlign: "center",
              fontSize: 17,
              paddingBottom: 7,
              paddingTop: 7,
              marginLeft: 3,
            }}
          >
            {currentQueueProcessId}
          </Text>
        );
      }
      return printedData;
    }
    function printData() {
      var printedData = [];
      for (let i = 0; i < chartData.length; i++) {
        printedData.push(
          <View
            key={i}
            style={{
              backgroundColor: "#7c0ccc",
              width: widthArray[i] * 35,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: 45,
              borderWidth: 1,
              borderColor: "white",
            }}
          >
            {chartData[i] == "/" ? (
              <View
                style={{
                  height: "100%",
                  backgroundColor: "#A9A9A9",
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  alignSelf: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    marginLeft: 5,
                    color: "white",
                    display: "flex",
                    flexDirection: "row",
                    alignSelf: "center",
                    justifyContent: "center",
                  }}
                >
                  {chartQueue[i].start}
                </Text>
                <Text
                  style={{
                    marginRight: 5,
                    color: "white",
                    display: "flex",
                    flexDirection: "row",
                    alignSelf: "center",
                    justifyContent: "center",
                  }}
                >
                  {chartQueue[i].end}
                </Text>
              </View>
            ) : (
              <View
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 18,
                    width: "100%",
                    borderWidth: 0,
                    borderColor: "black",
                    textAlign: "center",
                    color: "white",
                    paddingTop: 10,
                  }}
                >
                  {chartData[i]}
                </Text>
                <View
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    alignSelf: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{ marginLeft: 5, color: "white", paddingBottom: 5 }}
                  >
                    {chartQueue[i].start + 1}
                  </Text>
                  <Text
                    style={{ marginRight: 5, color: "white", paddingBottom: 5 }}
                  >
                    {chartQueue[i].end}
                  </Text>
                </View>
              </View>
            )}
          </View>
        );
      }
      return printedData;
    }
    return (
      <View
        style={{
          width: "100%",
          marginTop: 5,
          marginBottom: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <Text
          style={{
            width: "100%",
            fontSize: 20,
            paddingTop: 30,
            paddingLeft: 10,
            textAlign: "left",
          }}
        >
          CPU Schedule
        </Text>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          style={{
            width: "100%",
            marginTop: 5,
            marginBottom: 5,
            paddingBottom: 20,
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              borderColor: "black",
            }}
          >
            {printData()}
          </View>
        </ScrollView>
        <View
          style={{
            borderWidth: 1,
            borderRadius: 10,
            borderColor: "#2F4F4F",
            width: "98%",
            padding: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: "100%",
              marginBottom: 10,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                textAlign: "center",
                padding: 5,
                fontWeight: "bold",
                backgroundColor: "orange",
                borderWidth: 1.5,
                borderColor: "gray",
                borderTopLeftRadius: 10,
                borderBottomLeftRadius: 10,
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              QUEUE
            </Text>
            <ScrollView
              showsHorizontalScrollIndicator={true}
              horizontal={true}
              style={{
                display: "flex",
                flexDirection: "row",
                marginLeft: 2,
                paddingBottom: 5,
                paddingTop: 5,
              }}
            >
              {printAnimatetdQueueData()}
            </ScrollView>
          </View>
          {/* Shows Animation */}
          {/* {showAnimation()} */}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
              width: "100%",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <Text
                style={{
                  borderRadius: 8,
                  letterSpacing: 1,
                  borderWidth: 1,
                  backgroundColor: "#00FF91",
                  padding: 5,
                  paddingLeft: 10,
                  paddingRight: 10,
                  fontSize: 16,
                  marginBottom: 2,
                  // color: "white",
                  fontWeight: "bold",
                }}
              >
                {this.state.isAnimationDone == true ? (
                  <Text>IDLE</Text>
                ) : (
                  this.state.currentCpuPID
                )}
              </Text>
              <Text
                style={{
                  padding: 5,
                  fontSize: 16,
                  borderColor: "black",
                  fontWeight: "bold",
                  backgroundColor: "orange",
                  color: "white",
                  borderStyle: "dotted",
                  borderWidth: 1.5,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                }}
              >
                CPU
              </Text>
            </View>
            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                Seconds :
              </Text>
              <Text
                style={{
                  backgroundColor: "#E74C3C",
                  width: 35,
                  height: 35,
                  borderRadius: 35 / 2,
                  paddingTop: 8,
                  marginLeft: 3,
                  borderWidth: 2,
                  fontSize: 16,
                  color: "white",
                  textAlign: "center",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {this.state.isAnimationDone == true ? (
                  <Text>0</Text>
                ) : (
                  this.state.currentSecond
                )}
              </Text>
            </View>
          </View>

          {this.state.isAnimationDone == false
            ? this.showAnimation()
            : this.animationCompleted()}
        </View>
      </View>
    );
  }

  showAnswer() {
    if (this.state.gotAnswer == true) {
      return (
        <View>
          <View style={styles.main__container}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {this.state.processes.map((data, index) => (
                <View style={styles.box} key={index}>
                  <View style={styles.pr_row}>
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                      ID :
                    </Text>
                    <Text> {data}</Text>
                  </View>
                  <View style={styles.pr_row}>
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                      TAT :
                    </Text>
                    <Text> {this.state.tatarr[index]}</Text>
                  </View>
                  <View style={styles.pr_row}>
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                      WT :
                    </Text>
                    <Text> {this.state.waitingarr[index]}</Text>
                  </View>
                  <View style={styles.pr_row}>
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                      CT :
                    </Text>
                    <Text> {this.state.complitionarr[index]}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.main__container}>
            <View style={styles.col_rad}>
              <Text style={{ fontWeight: "bold" }}>Avg. TAT : </Text>
              <Text>{this.state.avgtat}</Text>
            </View>
            <View style={styles.col_rad}>
              <Text style={{ fontWeight: "bold" }}>Avg. WT : </Text>
              <Text>{this.state.avgwaiting}</Text>
            </View>
          </View>
        </View>
      );
    }
  }

  addProcess() {
    const state = this.state;
    (state.currentCpuPID = "IDLE"),
      (state.currentQueuePID = []),
      (state.currentSecond = 0),
      (state.isAnimationDone = false),
      state.totalProcess++;
    if (this.state.isIoEnabled) {
      state.tableData.push(["P" + state.totalProcess, 0, 0, 0, 0]);
    } else {
      state.tableData.push(["P" + state.totalProcess, 0, 0]);
    }
    state.processes.push("P" + state.totalProcess);
    state.gotAnswer = false;
    state.isChartGenerated = false;
    this.state.ganntChartArray = [];
    this.setState({ state });
  }

  deleteProcess() {
    const state = this.state;
    if (state.totalProcess == -1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      alert("Table is Empty!");
      return null;
    }
    (state.currentCpuPID = "IDLE"),
      (state.currentQueuePID = []),
      (state.currentSecond = 0),
      (state.isAnimationDone = false),
      state.totalProcess--;
    state.tableData.pop();
    state.processes.pop();
    state.isChartGenerated = false;
    state.gotAnswer = false;
    this.state.ganntChartArray = [];
    this.setState({ state });
  }

  toggleButton() {
    const toggleSwitch = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      var isIoEnabled = this.state.isIoEnabled;
      var tableHead = this.state.tableHead;
      var tableData = this.state.tableData;
      var totalProcess = this.state.totalProcess;
      this.state.tatarr = [];
      this.state.waitingarr = [];
      this.state.complitionarr = [];
      this.state.avgtat = 0;
      this.state.ganntChartArray = [];
      this.state.avgwaiting = 0;
      this.state.isChartGenerated = false;
      this.state.gotAnswer = false;
      this.state.currentCpuPID = "IDLE";
      this.state.currentQueuePID = [];
      this.state.currentSecond = 0;
      this.state.queueAnimationArray = [];
      this.state.isAnimationDone = false;
      isIoEnabled = !isIoEnabled;
      if (isIoEnabled) {
        tableHead = ["PID", "AT", "CPU Burst", "I/O", "CPU"];
        for (let i = 0; i < tableData.length; i++) {
          let temp_process = tableData[i];
          temp_process.push(0);
          temp_process.push(0);
          tableData[i] = temp_process;
        }
      } else {
        tableHead = ["Process", "Arriving Time", "CPU Burst"];
        for (let i = 0; i < tableData.length; i++) {
          let temp_process = tableData[i];
          temp_process.pop();
          temp_process.pop();
          tableData[i] = temp_process;
        }
      }
      totalProcess = tableData.length - 1;
      // processes = ["P0"];
      this.setState({
        isIoEnabled,
        tableHead,
        tableData,
        totalProcess,
      });
    };
    return (
      <View
        style={{
          width: 150,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
          marginBottom: 10,
          marginTop: 20,
          marginLeft: 10,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>I/O Burst: </Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={this.state.isIoEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={this.state.isIoEnabled}
        />
      </View>
    );
  }
  timeQuantamTextInput() {
    return (
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
          width: 250, //(Added for Round robin Algorithm)
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Time Quantum:</Text>
        <TextInput
          editable={true}
          placeholder={this.state.time_Quantam.toString()}
          onChangeText={(text) => (this.state.time_Quantam = text)}
          keyboardType="number-pad"
          style={{
            height: 20,
            width: 50,
            borderRadius: 10,
            borderColor: "gray",
            borderWidth: 1,
            textAlign: "center",
          }}
        />
      </View>
    );
  }
  render() {
    const state = this.state;
    if (this.props.isPriorityAlgorithms == true) {
      if (state.tableHead[state.tableHead.length - 1] != "Prio")
        state.tableHead.push("Prio");
      if (
        state.tableData.length != 0 &&
        state.tableData[state.tableData.length - 1].length !=
          state.tableHead.length
      )
        state.tableData[state.tableData.length - 1].push(0);
    }
    const element = (index, cellIndex) => (
      <TextInput
        editable={true}
        placeholder={
          this.state.from_history
            ? this.state.tableData[index][cellIndex].toString()
            : "edit"
        }
        onChangeText={(text) => (this.state.tableData[index][cellIndex] = text)}
        keyboardType="number-pad"
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 0,
          textAlign: "center",
        }}
      />
    );

    return (
      <ScrollView style={styles.screen}>
        {this.toggleButton()}
        <View style={styles.container}>
          <Table borderStyle={{ borderColor: "transparent" }}>
            <Row
              data={state.tableHead}
              style={styles.head}
              textStyle={styles.text}
            />
            {state.tableData.map((rowData, index) => (
              <TableWrapper key={index} style={styles.row}>
                {rowData.map((cellData, cellIndex) => (
                  <Cell
                    key={cellIndex}
                    data={
                      cellIndex === 0 ? cellData : element(index, cellIndex)
                    }
                    textStyle={styles.text}
                  />
                ))}
              </TableWrapper>
            ))}
          </Table>
          {this.props.isRoundRobinAlgo == true
            ? this.timeQuantamTextInput()
            : null}
          <View style={styles.answers}>
            <View style={styles.processRow}>
              <TouchableOpacity
                style={styles.btn_add}
                onPress={this.addProcess}
                placeholder="click"
              >
                <Text style={styles.btn_txt}>+ Add Process</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btn_del}
                onPress={this.deleteProcess}
                placeholder="click"
              >
                <Text style={styles.btn_txt}>- Del Process</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.btn}
              onPress={this.getAnswer}
              placeholder="click"
            >
              <Text style={styles.btn_txt}>✓ Evaluate</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.chartBtn}
              onPress={() => {
                this.setState({ isChartGenerated: true });
              }}
              placeholder="click"
            >
              <Text style={styles.btn_txt}>⚙ Generate CPU Schedule</Text>
            </TouchableOpacity>

            {this.state.isChartGenerated == true ? (
              this.ganntChart()
            ) : (
              <View></View>
            )}

            {this.showAnswer()}
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
  },
  head: {
    height: 40,
    backgroundColor: "#c1c1c1",
    borderRadius: 3,
  },
  text: { margin: 6, textAlign: "center", fontWeight: "500", fontSize: 15 },
  row: {
    flexDirection: "row",
    backgroundColor: "#FFF1C1",
    borderRadius: 10,
    marginTop: 2,
  },
  btn: {
    width: 120,
    height: 40,
    backgroundColor: "#78B7BB",
    borderRadius: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  btn_add: {
    width: 130,
    height: 38,
    backgroundColor: "green",

    borderRadius: 50,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  btn_del: {
    width: 130,
    height: 38,
    backgroundColor: "red",

    borderRadius: 50,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  answers: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  btn_txt: {
    fontSize: 15,
    fontWeight: "900",
    color: "white",
  },
  btnText: { textAlign: "center", color: "#fff" },
  processRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  main__container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 20,
  },
  compiltion: {
    display: "flex",
    flexDirection: "column",
  },

  col_rad: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF1C1",
    borderWidth: 1,
    marginTop: 5,
    padding: 10,
    borderRadius: 20,
  },
  col_radCPU: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF1C1",
    color: "white",
    borderWidth: 3,
    borderColor: "red",
    marginTop: 5,
    padding: 10,
    borderRadius: 20,
  },
  box: {
    backgroundColor: "yellow",
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "black",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: 5,
  },
  pr_row: {
    display: "flex",
    flexDirection: "row",
    padding: 5,
  },
  chartBtn: {
    width: "80%",
    height: 45,
    backgroundColor: "#3399ff",
    borderRadius: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  MainContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    margin: 10,
  },
});
