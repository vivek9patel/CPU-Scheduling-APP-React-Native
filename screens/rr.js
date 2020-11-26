import React from "react";
import InputTable from "../models/table";

export default class Rr extends InputTable {
  constructor(props) {
    super(props);
  }
  getIoEnabledAnswer = (state) => {
    var newState = state;
    var tuple = [];
    var n = state.tableData.length;
    console.log(state.tableData);
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
    console.log(tuple);

    // var tuple = [
    //   {pid:1,bt1:6,art:0,io:10,bt2:4},
    //   {pid:2,bt1:9,art:2,io:15,bt2:6},
    //   {pid:3,bt1:3,art:4,io:5,bt2:2},
    // ];

    var total_bt = [];
    var artt = [];
    var total_btt = [];
    for (var i = 0; i < tuple.length; i++) {
      total_bt[i] = tuple[i].bt1 + tuple[i].io + tuple[i].bt2;
      total_btt[i] = total_bt[i];
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
    var rt = [];
    for (var i = 0; i < n; i++) {
      rt.push(tuple[i].bt);
    }

    var final_ans = [];
    var visited = [];
    var main_que = [];
    for (var i = 0; i < tuple.length; i++) {
      visited[i] = 0;
    }
    var tq = 3;
    var que = [];
    var btco = [];
    for (var i = 0; i < n; i++) {
      btco[i] = 0;
    }
    var last = 1000;
    for (var i = 0; i < 50; i++) {
      for (var j = 0; j < n; j++) {
        if (tuple[j].art <= i && visited[j] === 0) {
          var flag = 0;
          for (var g = 0; g < main_que.length; g++) {
            if (main_que[g] == j) {
              flag = 1;
            }
          }
          if (flag === 0) main_que.push(j);
        }
      }
      if (last != 1000) {
        main_que.push(last);
      }

      var state = -1;
      if (main_que.length !== 0) {
        state = main_que[0];
        visited[state] = 1;
      }
      main_que.shift();

      if (state == -1) {
        final_ans.push("/");
        var smit = [];
        que.push(smit);
      } else {
        if (btco[state] === 0) {
          var to = Math.min(tuple[state].bt1, tq);
          //	console.log(to);
          for (var j = 0; j < to; j++) {
            final_ans.push(tuple[state].pid);
          }
          last = state;
          tuple[state].bt1 -= to;
          if (tuple[state].bt1 === 0) {
            btco[state] = 1;
            last = 1000;
            tuple[state].art = i + to + tuple[state].io;
            visited[state] = 0;
          }
          for (var j = i; j < i + to; j++) {
            var smit = [];
            for (var g = 0; g < n; g++) {
              if (tuple[g].art <= j) {
                smit.push(tuple[g].pid);
              }
            }
            que.push(smit);
          }
          //	console.log(last);
          i += to - 1;
        } else {
          //	console.log(i + " "+ state);

          var to = Math.min(tuple[state].bt2, tq);
          for (var j = 0; j < to; j++) {
            final_ans.push(tuple[state].pid);
          }
          last = state;
          tuple[state].bt2 -= to;
          if (tuple[state].bt2 === 0) {
            btco[state] = 1;
            last = 1000;
            tuple[state].art = 1000;
            visited[state] = 1;
          }
          for (var j = i; j < i + to; j++) {
            var smit = [];
            for (var g = 0; g < n; g++) {
              if (tuple[g].art <= j) {
                smit.push(tuple[g].pid);
              }
            }
            que.push(smit);
          }

          i += to - 1;
        }
      }
    }
    console.log(que.length);
    for (var i = 0; i < 50; i++) {
      console.log(i + " " + final_ans[i]);
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
    console.log(total_wt / n + " " + total_tat / n);
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
    //   { pid: 1, bt: 5, art: 0 },
    //   { pid: 2, bt: 3, art: 1 },
    //   { pid: 3, bt: 1, art: 2 },
    //   { pid: 4, bt: 2, art: 3 },
    //   { pid: 5, bt: 3, art: 4 },
    // ];
    // var tuple_temp = [
    //   { pid: 1, bt: 5, art: 0 },
    //   { pid: 2, bt: 3, art: 1 },
    //   { pid: 3, bt: 1, art: 2 },
    //   { pid: 4, bt: 2, art: 3 },
    //   { pid: 5, bt: 3, art: 4 },
    // ];
    var tq = parseInt(state.time_Quantam);
    var tuple_temp = tuple;
    // console.log(tuple, tuple_temp);
    n = tuple.length;
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
    var store = [];
    var vis = [];
    for (var j = 0; j < n; j++) {
      vis[j] = 0;
    }
    var visited = [];
    for (var i = 0; i < n; i++) {
      visited[i] = 0;
    }
    var que = [];
    var fl = 0;
    var val = 0;
    var count = 0;
    for (var i = 0; i < 50; i++) {
      count++;
      for (var j = 0; j < n; j++) {
        if (tuple[j].art <= i && vis[j] != 1) {
          store.push(j);
          vis[j] = 1;
        }
      }
      if (fl == 1 && tuple[val].bt > 0) {
        store.push(val);
      }

      if (store.length === 0) {
        var smit = [];
        for (var h = 0; h < n; h++) {
          if (tuple[h].art <= i && visited[h] === 0) {
            smit.push(tuple[h].pid);
          }
        }
        que.push(smit);
        final_ans.push("/");
      } else {
        fl = 1;
        for (var j = i; j < i + tq; j++) {
          var smit = [];
          for (var h = 0; h < n; h++) {
            if (tuple[h].art <= j && visited[h] === 0) {
              smit.push(tuple[h].pid);
            }
          }
          que.push(smit);
        }
        val = store[0];
        store.shift();
        var brt = tuple[val].bt;
        for (var t = 0; t < Math.min(brt, tq); t++) {
          final_ans.push(tuple[val].pid);
        }

        brt -= tq;
        tuple[val].bt -= tq;
        if (tuple[val].bt <= 0) {
          visited[val] = 1;
          console.log(val);
        }
        i += tq - 1;
      }
    }
    for (var i = 0; i < 50; i++) {
      console.log("que " + que[i]);
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
      //	console.log(cmp_time[i]+" "+tuple[i].art);
      tat[i] = cmp_time[i] - tuple[i].art;
      //	console.log(tat[i]+" "+rt[i]);
      wt[i] = tat[i] - rt[i];
      //	console.log(wt[i]);
    }
    for (var i = 0; i < n; i++) {
      total_wt = total_wt + wt[i];
      total_tat = total_tat + tat[i];
    }

    //console.log(total_wt/n+" "+total_tat/n);
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
    // var que = [];
    // for (let i = 0; i < 50; i++) {
    //   que.push(["-Dummy"]);
    // }
    state.queueAnimationArray = que;
    state.tatarr = tat;
    state.waitingarr = wt;
    state.complitionarr = cmp_time;
    state.avgtat = (total_tat * 1.0) / n;
    state.avgwaiting = (total_wt * 1.0) / n;
    state.ganntChartArray = final_ans;
    state.gotAnswer = true;
    state.isChartGenerated = false;
    this.setState({ state });
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
          algorithm={"Round Robin Algorithm"}
          isRoundRobinAlgo={true}
        />
      );
    } else {
      return (
        <InputTable
          onPress={(state) => this.getAnswer(state)}
          from_history={false}
          algorithm={"Round Robin Algorithm"}
          isRoundRobinAlgo={true}
        />
      );
    }
  }
}
