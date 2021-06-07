import React from "react";
import InputTable from "../models/table";

export default class Rr extends InputTable {
  constructor(props) {
    super(props);
  }
  getIoEnabledAnswer = (state) => {
    var newState = state;
    var backend_url = 'http://192.168.2.4:8000/rr/io';
    fetch(backend_url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(state)
    }).then((res) => res.json())
    .then((data) => {
      newState.queueAnimationArray = data.readyQue;
      newState.tatarr = data.tatarr;
      newState.waitingarr = data.wtarr;
      newState.complitionarr = data.comparr;
      newState.avgtat = data.avgtat;
      newState.avgwaiting = data.avgwaiting;
      newState.ganntChartArray = data.ganntChartArray;
      newState.gotAnswer = true;
      newState.isChartGenerated = false;
      this.setState({
        newState,
      });
    })
    .catch((err) => {
      console.log(err);
    });
  };
  getAnswer = (state) => {
    if (state.isIoEnabled) {
      this.getIoEnabledAnswer(state);
      return;
    }
    var backend_url = 'http://192.168.2.4:8000/rr';
    fetch(backend_url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(state)
    }).then((res) => res.json())
    .then((data) => {
      state.queueAnimationArray = data.readyQue;
      state.tatarr = data.tatarr;
      state.waitingarr = data.wtarr;
      state.complitionarr = data.comparr;
      state.avgtat = data.avgtat;
      state.avgwaiting = data.avgwaiting;
      state.ganntChartArray = data.ganntChartArray;
      state.gotAnswer = true;
      state.isChartGenerated = false;
      this.setState({
        state
      });
    })
    .catch((err) => {
      console.log(err);
    });
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
