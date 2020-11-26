import React, { Component } from "react";
import InputTable from "../models/table";

export default class Srtf extends InputTable {
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
      });
      // console.log(tuple);
    }

    // var tuple = [
    //   { pid: 1, bt1: 3, art: 0, io: 2, bt2: 2 },
    //   { pid: 2, bt1: 2, art: 0, io: 4, bt2: 1 },
    //   { pid: 3, bt1: 1, art: 2, io: 3, bt2: 2 },
    //   { pid: 4, bt1: 2, art: 5, io: 2, bt2: 1 },
    // ];
    var total_bt = [];
    var artt = [];
    var total_btt = [];
    for (var i = 0; i < tuple.length; i++) {
      total_bt[i] = tuple[i].bt1 + tuple[i].bt2;

      total_btt[i] = total_bt[i];
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
      var mn = 10000;
      var state = -1;
      for (var j = 0; j < n; j++) {
        if (tuple[j].art <= i) {
          if (total_bt[j] < mn) {
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
          //	if(i==3){console.log("fuck1");}
          for (var j = 0; j < 1; j++) {
            final_ans.push(tuple[state].pid);
          }
          tuple[state].bt1 -= 1;
          total_bt[state] -= 1;
          for (var g = i; g < i + 1; g++) {
            var smit = [];
            for (var y = 0; y < n; y++) {
              if (tuple[y].art <= g || btco[y] == 1) {
                smit.push(tuple[y].pid);
              }
            }
            que.push(smit);
          }
          if (tuple[state].bt1 <= 0) {
            tuple[state].art = i + tuple[state].io + 1;
            btco[state] = 1;
          }
        } else {
          //	if(i==3){console.log("fuck2");}
          for (var j = 0; j < 1; j++) {
            final_ans.push(tuple[state].pid);
          }
          tuple[state].bt2 -= 1;
          total_bt[state] -= 1;
          for (var g = i; g < i + 1; g++) {
            var smit = [];
            for (var y = 0; y < n; y++) {
              if (tuple[y].art <= g || btco[y] == 1) {
                smit.push(tuple[y].pid);
              }
            }
            que.push(smit);
          }
          if (tuple[state].bt2 <= 0) {
            tuple[state].art = 100;
          }
        }
      }
    }
    console.log(que.length);
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
    console.log(total_wt / n + " " + total_tat / n);
    console.log(que);
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
      // console.log(tuple);
    }
    // var tuple = [
    //   { pid: 1, bt: 8, art: 0 },

    //   { pid: 2, bt: 4, art: 1 },
    //   { pid: 3, bt: 2, art: 2 },
    //   { pid: 4, bt: 1, art: 3 },
    //   { pid: 5, bt: 3, art: 4 },
    //   { pid: 6, bt: 2, art: 5 },
    // ];
    // var tuple_temp = [
    //   { pid: 1, bt: 8, art: 0 },

    //   { pid: 2, bt: 4, art: 1 },
    //   { pid: 3, bt: 2, art: 2 },
    //   { pid: 4, bt: 1, art: 3 },
    //   { pid: 5, bt: 3, art: 4 },
    //   { pid: 6, bt: 2, art: 5 },
    // ];
    var tuple_i = tuple;
    tuple.sort(function (a, b) {
      if (a.art == b.art) {
        return a.bt - b.bt;
      }
      return a.art - b.art;
    });
    tuple.sort();
    var tuple_t = tuple;

    var n = tuple.length;
    var wt = [];
    var tat = [];
    var total_wt = 0;
    var total_tat = 0;
    var rt = [];

    for (var i = 0; i < n; i++) {
      rt.push(tuple[i].bt);
    }
    var complete = 0,
      t = 0,
      minm = 9999;
    var shortest = 0,
      finish_time;
    var check = false;
    var final_ans = [];
    // 1 2 3 4
    // 2 4 6 8
    var vis = [];
    for (var i = 0; i < tuple.length; i++) {
      vis[i] = 0;
    }
    var state = 0;
    var flag = 0;
    var que = [];
    for (var i = 0; i < 50; i++) {
      var fl = 0;
      var smit = [];
      for (var j = 0; j < tuple.length; j++) {
        if (tuple[j].art <= i && vis[j] === 0) {
          smit.push(tuple[j].art);
        }
      }
      //	console.log(smit);
      que.push(smit);
      for (var y = 0; y < tuple.length; y++) {
        if (vis[y] === 0) {
          fl = 1;
        }
      }
      if (fl === 0) {
        final_ans.push("/");
      } else {
        if (tuple[state].art > i) {
          final_ans.push("/");
        } else {
          final_ans.push(tuple[state].pid);

          tuple[state].bt--;
          if (tuple[state].bt === 0) {
            vis[state] = 1;
          }
          var mx = 10000;
          var ind = 0;
          for (var j = tuple.length - 1; j >= 0; j--) {
            if (tuple[j].art <= 1 + i) {
              if (tuple[j].bt <= mx && tuple[j].bt > 0) {
                mx = tuple[j].bt;
                ind = j;
              }
            }
          }

          //	console.log(ind);

          state = ind;
        }
      }
    }
    // for(var i=0;i<50;i++){
    //   console.log("i "+que[i]);
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
    for (var i = 0; i < 50; i++) {
      console.log(final_ans[i] + " final_ans");
    }

    var wt = [];

    for (var i = 0; i < n; i++) {
      //	console.log(cmp_time[i]+" "+tuple_temp[i].art);
      tat[i] = cmp_time[i] - tuple_temp[i].art;
      //	console.log(tat[i]+" "+tuple_temp[i].bt);
      wt[i] = tat[i] - tuple_temp[i].bt;
      //console.log(wt[i]);
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
    console.log(que);
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
          algorithm={"SRTF Algorithm"}
        />
      );
    } else {
      return (
        <InputTable
          onPress={(state) => this.getAnswer(state)}
          from_history={false}
          algorithm={"SRTF Algorithm"}
        />
      );
    }
  }
}
