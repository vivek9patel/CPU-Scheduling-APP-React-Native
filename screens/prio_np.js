import React, { Component } from "react";
import InputTable from "../models/table";

export default class Prio_np extends InputTable {
  constructor(props) {
    super(props);
    // this.getAnswer = this.getAnswer.bind(this);
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
        prio: parseInt(state.tableData[i][5]),
      });
      // console.log(tuple);
    }
    // console.log(tuple);

    // var tuple = [
    //   { pid: 1, bt1: 6, art: 0, io: 10, bt2: 4, prio: 2 },
    //   { pid: 2, bt1: 9, art: 2, io: 15, bt2: 6, prio: 1 },
    //   { pid: 3, bt1: 3, art: 3, io: 5, bt2: 2, prio: 3 },
    // ];
    var total_bt = [];
    var artt = [];
    var total_btt = [];
    for (var i = 0; i < tuple.length; i++) {
      total_bt[i] = tuple[i].bt1 + tuple[i].io + tuple[i].bt2;
      total_btt[i] = total_bt[i] - tuple[i].io;
      artt[i] = tuple[i].art;
      //	console.log(total_bt[i]);
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
    var rt = [];
    for (var i = 0; i < n; i++) {
      rt.push(tuple[i].bt);
    }

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

    for (var i = 0; i < 50; i++) {
      for (var j = 0; j < n; j++) {
        if (total_bt[i] <= 0) {
          visited[i] = 1;
        }
      }
      var mn = 100000;
      var state = -1;
      for (var j = 0; j < n; j++) {
        if (tuple[j].art <= i) {
          if (tuple[j].prio < mn) {
            mn = tuple[j].prio;
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
          tuple[state].art = 100;
        }
      }
    }
    // console.log(que.length);
    // for(var i=0;i<50;i++){
    //   console.log(i+" "+final_ans[i]);
    // }
    var cmp_time = [];
    for (var i = 0; i < tuple.length; i++) {
      cmp_time[i] = -1;
    }
    for (var i = final_ans.length - 1; i >= 0; i--) {
      //	console.log(final_ans[i]);
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
    // Removing '/' from the back of the array
    for (var i = final_ans.length - 1; i >= 0; i--) {
      if (final_ans[i] != "/") break;
      final_ans.pop();
    }
    // console.log(total_wt / n + " " + total_tat / n);
    // console.log(que);
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
    var tuple = [];
    var n = state.tableData.length;
    for (let i = 0; i < n; i++) {
      var tempPid = state.tableData[i][0].substring(1);
      tempPid = parseInt(tempPid) + 1;
      tuple.push({
        pid: tempPid,
        bt: parseInt(state.tableData[i][2]),
        art: parseInt(state.tableData[i][1]),
        prio: parseInt(state.tableData[i][3]),
      });
      // console.log(tuple);
    }
    // console.log(tuple);
    // var tuple = [
    //   { pid: 1, bt: 4, art: 0, prio: 2 },
    //   { pid: 2, bt: 2, art: 1, prio: 4 },
    //   { pid: 3, bt: 3, art: 2, prio: 6 },
    //   { pid: 4, bt: 5, art: 3, prio: 10 },
    //   { pid: 5, bt: 1, art: 4, prio: 8 },
    //   { pid: 6, bt: 4, art: 5, prio: 12 },
    //   { pid: 7, bt: 6, art: 6, prio: 9 },
    // ];
    var n = tuple.length;
    var total_btt = [];
    var arrt = [];
    for (var i = 0; i < n; i++) {
      total_btt[i] = tuple[i].bt;
      arrt.push(tuple[i].art);
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
    var rt = [];
    for (var i = 0; i < n; i++) {
      rt.push(tuple[i].bt);
    }

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

    for (var i = 0; i < 50; i++) {
      for (var j = 0; j < n; j++) {
        if (tuple[j].bt <= 0) {
          visited[j] = 1;
        }
      }
      var mn = 0;
      var state = -1;
      for (var j = 0; j < n; j++) {
        if (tuple[j].art <= i && visited[j] === 0) {
          if (tuple[j].prio > mn) {
            mn = tuple[j].prio;
            state = j;
          }
        }
      }
      //	console.log("i "+i);

      //	console.log(i+" sasd " +state);
      if (state == -1) {
        final_ans.push("/");
        var smit = [];
        que.push(smit);
      } else {
        //	console.log("a");
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
    // console.log(que.length);
    // for(var i=0;i<50;i++){
    //	 console.log(i+" "+final_ans[i]);
    // }
    var cmp_time = [];
    for (var i = 0; i < tuple.length; i++) {
      cmp_time[i] = -1;
    }
    for (var i = final_ans.length - 1; i >= 0; i--) {
      //	console.log(final_ans[i]);
      if (final_ans[i] === "/") {
      } else {
        if (cmp_time[final_ans[i] - 1] == -1) {
          cmp_time[final_ans[i] - 1] = i + 1;
        }
      }
    }

    var wt = [];
    for (var i = 0; i < n; i++) {
      tat[i] = cmp_time[i] - arrt[i];

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
    // console.log(total_wt / n + " " + total_tat / n);
    // console.log(que);
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
  render() {
    if (
      typeof this.props.navigation.state.params["from_history"] != "undefined"
    ) {
      return (
        <InputTable
          onPress={(state) => this.getAnswer(state)}
          from_history={true}
          inpt_data={this.props.navigation.state.params}
          algorithm={"PRIORITY SCHEDULING(NP)"}
          isPriorityAlgorithms={true}
        />
      );
    } else {
      return (
        <InputTable
          onPress={(state) => this.getAnswer(state)}
          from_history={false}
          algorithm={"PRIORITY SCHEDULING(NP)"}
          isPriorityAlgorithms={true}
        />
      );
    }
  }
}
