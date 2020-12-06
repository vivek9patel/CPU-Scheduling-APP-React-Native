import React, { Component } from "react";
import InputTable from "../models/table";

export default class Ljf extends InputTable {
  constructor(props) {
    super(props);
  }
  getIoEnabledAnswer = (state) => {
    var newState = state;
    var tuple = [];
    var n = state.tableData.length;
    for (let i = 0; i < n; i++) {
      var tempPid = state.tableData[i][0].substring(1);
      tempPid = parseInt(tempPid) + 1;
      tuple.push({
        pid: tempPid,
        bt1: parseInt(state.tableData[i][2]),
        art: parseInt(state.tableData[i][1]),
        io: parseInt(state.tableData[i][3]),
        bt2: parseInt(state.tableData[i][4]),
      });
    }
    var total_bt = [];
    var artt = [];
    var total_btt = [];
    var n = tuple.length;
    for (var i = 0; i < tuple.length; i++) {
      total_bt[i] = tuple[i].bt1 + tuple[i].io + tuple[i].bt2;
      total_btt[i] = total_bt[i] - tuple[i].io;
      artt[i] = tuple[i].art;
    }
    var tuple_temp = tuple;
    tuple.sort(function (a, b) {
      return a.art - b.art;
    });
    tuple.sort();
    var wt = []; //wating time
    var tat = []; //turnaround time
    var total_wt = 0; // total wating time
    var total_tat = 0; // total turnaround time
    var final_ans = []; // grannt chart
    var visited = [];
    for (var i = 0; i < tuple.length; i++) {
      visited[i] = 0;
    }
    var que = [];
    var btco = [];
    for (var i = 0; i < n; i++) {
      btco[i] = 0;
    }
    for (var i = 0; i < 10000; i++) {
      for (var j = 0; j < n; j++) {
        if (total_bt[i] <= 0) {
          visited[i] = 1;
        }
      }
      var mn = 0;
      var state = -1;
      for (var j = 0; j < n; j++) {
        if (tuple[j].art <= i) {
          if (total_bt[j] > mn) {
            mn = total_bt[j];
            state = j;
          }
        }
      }
      if (state == -1) {
        final_ans.push("/");
        var smit = [];
        que.push(smit);
      } else {
        if (btco[state] === 0) {
          for (var j = 0; j < tuple[state].bt1; j++) {
            final_ans.push(tuple[state].pid);
          }
          tuple[state].art = i + tuple[state].bt1 + tuple[state].io;
          for (var g = i; g < i + tuple[state].bt1 - 1; g++) {
            var smit = [];
            for (var y = 0; y < n; y++) {
              if (tuple[y].art <= g || btco[y] == 1) {
                smit.push(tuple[y].pid);
              }
            }
            que.push(smit);
          }
          i += tuple[state].bt1 - 1;
          btco[state] = 1;
          total_bt[state] -= tuple[state].bt1 + tuple[state].io;
        } else {
          for (var j = 0; j < tuple[state].bt2; j++) {
            final_ans.push(tuple[state].pid);
          }
          for (var g = i; g < i + tuple[state].bt1 - 1; g++) {
            var smit = [];
            for (var y = 0; y < n; y++) {
              if (tuple[y].art <= g || btco[y] == 1) {
                smit.push(tuple[y].pid);
              }
            }
            que.push(smit);
          }
          i += tuple[state].bt2 - 1;
          total_bt[state] = 0;
          tuple[state].art = 10000;
        }
      }
    }
    var cmp_time = [];
    for (var i = 0; i < tuple.length; i++) {
      cmp_time[i] = -1;
    }
    for (var i = final_ans.length - 1; i >= 0; i--) {
      if (final_ans[i] === "/") {
      } else {
        if (cmp_time[final_ans[i] - 1] == -1) {
          cmp_time[final_ans[i] - 1] = i + 1;
        }
      }
    }

    var wt = [];

    for (var i = 0; i < n; i++) {
      tat[i] = cmp_time[i] - artt[i];
      wt[i] = tat[i] - total_btt[i];
    }
    for (var i = 0; i < n; i++) {
      total_wt = total_wt + wt[i];
      total_tat = total_tat + tat[i];
    }
    // Changing Pid into string in final answer array
    for (var i = 0; i < final_ans.length; i++) {
      if (final_ans[i] != "/") {
        final_ans[i]--;
        final_ans[i] = "P" + final_ans[i].toString();
      }
    }
    for (var i = final_ans.length - 1; i >= 0; i--) {
      if (final_ans[i] != "/") break;
      final_ans.pop();
    }
    newState.queueAnimationArray = que;
    newState.tatarr = tat;
    newState.waitingarr = wt;
    newState.complitionarr = cmp_time;
    newState.avgtat = total_tat / n;
    newState.avgwaiting = total_wt / n;
    newState.ganntChartArray = final_ans;
    newState.gotAnswer = true;
    newState.isChartGenerated = false;
    this.setState({ newState });
  };
  getAnswer = (state) => {
    if (state.isIoEnabled) {
      this.getIoEnabledAnswer(state);
      return;
    }
    var newState = state;
    var tuple = [],
      tuple_temp = [];
    var n = state.tableData.length;
    for (let i = 0; i < n; i++) {
      var tempPid = state.tableData[i][0].substring(1);
      tempPid = parseInt(tempPid) + 1;
      tuple.push({
        pid: tempPid,
        bt: parseInt(state.tableData[i][2]),
        art: parseInt(state.tableData[i][1]),
      });
      tuple_temp.push({
        pid: tempPid,
        bt: parseInt(state.tableData[i][2]),
        art: parseInt(state.tableData[i][1]),
      });
     
    }
    var n = tuple.length;
    var total_btt = [];
    var artt = [];
    for (var i = 0; i < n; i++) {
      total_btt[i] = tuple[i].bt;
      artt[i] = tuple[i].art;
    }
    var tuple_temp = tuple;
    tuple.sort(function (a, b) {
      return a.art - b.art;
    });
    tuple.sort();
    var n = tuple.length;
    var wt = [];
    var tat = [];
    var total_wt = 0;
    var total_tat = 0;
    var final_ans = [];
    var visited = [];
    for (var i = 0; i < tuple.length; i++) {
      visited[i] = 0;
    }
    var que = [];
    var btco = [];
    for (var i = 0; i < n; i++) {
      btco[i] = 0;
    }
    for (var i = 0; i < 10000; i++) {
      for (var j = 0; j < n; j++) {
        if (tuple[j].bt <= 0) {
          visited[j] = 1;
        }
      }
      var mn = 0;
      var state = -1;
      for (var j = 0; j < n; j++) {
        if (tuple[j].art <= i && visited[j] === 0) {
          if (tuple[j].bt > mn) {
            mn = tuple[j].bt;
            state = j;
          }
        }
      }
      if (state == -1) {
        final_ans.push("/");
        var smit = [];
        que.push(smit);
      } else {
        for (var j = 0; j < tuple[state].bt; j++) {
          final_ans.push(tuple[state].pid);
        }
        for (var g = i; g < i + tuple[state].bt; g++) {
          var smit = [];
          for (var y = 0; y < n; y++) {
            if (tuple[y].art <= g && visited[y] === 0) {
              smit.push(tuple[y].pid);
            }
          }
          que.push(smit);
        }
        i += tuple[state].bt - 1;
        tuple[state].bt = 0;
      }
    }
    var cmp_time = [];
    for (var i = 0; i < tuple.length; i++) {
      cmp_time[i] = -1;
    }
    for (var i = final_ans.length - 1; i >= 0; i--) {
      if (final_ans[i] === "/") {
      } else {
        if (cmp_time[final_ans[i] - 1] == -1) {
          cmp_time[final_ans[i] - 1] = i + 1;
        }
      }
    }
    for (var i = 0; i < n; i++) {
      tat[i] = cmp_time[i] - artt[i];
      wt[i] = tat[i] - total_btt[i];
    }
    for (var i = 0; i < n; i++) {
      total_wt = total_wt + wt[i];
      total_tat = total_tat + tat[i];
    }
    // Changing Pid into string in final answer array
    for (var i = 0; i < final_ans.length; i++) {
      if (final_ans[i] != "/") {
        final_ans[i]--;
        final_ans[i] = "P" + final_ans[i].toString();
      }
    }
    // Removing '/' from the back of the array
    for (var i = final_ans.length - 1; i >= 0; i--) {
      if (final_ans[i] != "/") break;
      final_ans.pop();
    }
    console.log(total_wt / n + " " + total_tat / n);
    newState.queueAnimationArray = que;
    newState.tatarr = tat;
    newState.waitingarr = wt;
    newState.complitionarr = cmp_time;
    newState.avgtat = (total_tat * 1.0) / n;
    newState.avgwaiting = (total_wt * 1.0) / n;
    newState.ganntChartArray = final_ans;
    newState.gotAnswer = true;
    newState.isChartGenerated = false;
    this.setState({ newState });
  };
  render() {
    if (
      typeof this.props.navigation.state.params["from_history"] != "undefined"
    ) {
      return (
        <InputTable
          onPress={(state) => this.getAnswer(state)}
          from_history={true}
          inpt_data={this.props.navigation.state.params}
          algorithm={"LJF Algorithm"}
        />
      );
    } else {
      return (
        <InputTable
          onPress={(state) => this.getAnswer(state)}
          from_history={false}
          algorithm={"LJF Algorithm"}
        />
      );
    }
  }
}
