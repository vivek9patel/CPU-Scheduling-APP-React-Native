import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import home from "../screens/home";
import fcfs from "../screens/fcfs";
import sjf from "../screens/sjf";
import srtf from "../screens/srtf";
import rr from "../screens/rr";
import ljf from "../screens/ljf";
import lrtf from "../screens/lrtf";
import prio_p from "../screens/prio_p";
import prio_np from "../screens/prio_np";
import history from "../models/history";
const screens = {
  "CPU Scheduling Algorithms": {
    screen: home,
  },
  "FCFS Algorithm": {
    screen: fcfs,
  },
  "SJF Algorithm": {
    screen: sjf,
  },
  "SRTF Algorithm": {
    screen: srtf,
  },
  "Round Robin Algorithm": {
    screen: rr,
  },
  "LJF Algorithm": {
    screen: ljf,
  },
  "LRTF Algorithm": {
    screen: lrtf,
  },
  "PRIORITY SCHEDULING(P)": {
    screen: prio_p,
  },
  "PRIORITY SCHEDULING(NP)": {
    screen: prio_np,
  },
  "Input History": {
    screen: history,
  },
};
const screenStack = createStackNavigator(screens);
export default createAppContainer(screenStack);
