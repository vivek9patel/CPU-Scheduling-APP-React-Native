import AsyncStorage from "@react-native-async-storage/async-storage";

import React, { Component } from "react";
import { View, ScrollView, Text, TouchableHighlight } from "react-native";

export default class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allKeys: [],
    };
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
      const jsonValue = JSON.stringify(inpt_data);
      //   console.log(jsonValue);
      await AsyncStorage.setItem(id, jsonValue);
      //   return jsonValue;
    } catch (e) {
      console.log("Couldn't Store the Value");
      console.log(e);
    }
  };

  getData = async (id) => {
    try {
      const jsonValue = await AsyncStorage.getItem(id);
      //   console.log(jsonValue);
      if (jsonValue != null) {
        let inpt_data = JSON.parse(jsonValue);
        // console.log(inpt_data);
        inpt_data = { ...inpt_data, from_history: true };
        return jsonValue;
      } else {
        console.log("NULL value!");
        return null;
      }
    } catch (e) {
      console.log("Couldn't Get the Value");
      console.log(e);
    }
  };

  getAllKeys = async () => {
    try {
      //   await AsyncStorage.clear();
      const allKeys = await AsyncStorage.getAllKeys();
      const result = await AsyncStorage.multiGet(allKeys);

      //   console.log(allKeys, result);
      let final_data = [];
      for (let i = 0; i < result.length; i++) {
        // console.log(allKeys[i]);
        if (allKeys[i] == "storage_key") continue;
        result[i][1] = JSON.parse(result[i][1]);
        result[i][1] = { ...result[i][1], from_history: true };
        final_data.push(result[i]);
      }
      //   result.pop();
      final_data.sort((a, b) => {
        return a[0] < b[0];
      });
      this.setState({ allKeys: final_data });
    } catch (e) {
      console.log("Couldn't Get All Keys!");
      console.log(e);
    }
  };
  clearHistory = async () => {
    try {
      await AsyncStorage.clear();
      alert("History Cleared!");
      this.setState({ allKeys: [] });
    } catch (e) {
      console.log("Couldn't Clear History!");
      console.log(e);
    }
  };
  componentDidMount() {
    this.getAllKeys();
  }

  printHistoryData = () => {
    var historyData = [];
    var allData = this.state.allKeys;
    for (let i = 0; i < allData.length; i++) {
      historyData.push(
        <TouchableHighlight
          key={i}
          style={{ width: "90%", marginTop: 10 }}
          onPress={() =>
            this.props.navigation.navigate(
              allData[i][1]["algorithm"],
              allData[i][1]
            )
          }
        >
          <View
            backgroundColor="black"
            style={{ padding: 10, backgroundColor: "black" }}
          >
            <Text style={{ color: "white" }}>{allData[i][1]["date"]}</Text>
            <Text style={{ color: "white" }}>{allData[i][1]["algorithm"]}</Text>
          </View>
        </TouchableHighlight>
      );
    }
    return historyData;
  };

  render() {
    const state = this.state;
    return (
      <ScrollView>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableHighlight
            style={{ width: "90%", marginTop: 10 }}
            onPress={this.clearHistory}
          >
            <View
              backgroundColor="red"
              style={{
                padding: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "red",
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                CLEAR ALL
              </Text>
            </View>
          </TouchableHighlight>
          {this.printHistoryData()}
        </View>
      </ScrollView>
    );
  }
}
