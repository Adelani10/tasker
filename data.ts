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
  {
    id: "5",
    text: "Buy birthday gift for Sarah",
    completed: false,
    isToday: true,
  },
  {
    id: "6",
    text: "Review pull requests on GitHub",
    completed: true,
    isToday: true,
  },
  {
    id: "7",
    text: "Schedule car maintenance",
    completed: false,
    isToday: false,
  },
  {
    id: "8",
    text: "Clean workspace and organize files",
    completed: false,
    isToday: false,
  },
  {
    id: "9",
    text: "Read 20 pages of a book",
    completed: true,
    isToday: false,
  },
];

const dummyPeriod: string[] = ["Today", "Upcoming"];

export { dummyPeriod, dummyTasks };
