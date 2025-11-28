import { Task } from "./types";

const dummyTasks: Task[] = [
  { id: "1", text: "Grocery Shopping", completed: true, isToday: true },
  {
    id: "2",
    text: "Finish project proposal",
    completed: false,
    isToday: true,
  },
  { id: "3", text: "Call plumber", completed: false, isToday: false },
  {
    id: "4",
    text: "Prepare presentation for client meeting",
    completed: false,
    isToday: false,
  },
];


const dummyPeriod: string[] = ["Today", "Upcoming"]


export {dummyPeriod, dummyTasks}