import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  chats: [
    {
      usertag: 2,
      username: "Nijika",
      avatar:
        "https://i.pinimg.com/564x/06/9f/bf/069fbf8ea7e830f49b296018ff387f32.jpg",
      status: false,
    },
    {
      usertag: 1,
      username: "Ryo",
      avatar:
        "https://i.pinimg.com/564x/be/c6/ce/bec6ce7cd23e943519e9d7bb3c359d0a.jpg",
      status: true,
    },

    {
      usertag: 3,
      username: "Rita",
      avatar:
        "https://i.pinimg.com/564x/dc/9f/dd/dc9fdda3f427bb7c42d8cb70b9233255.jpg",
      status: true,
    },
    {
      usertag: 4,
      username: "Seika",
      avatar:
        "https://i.pinimg.com/564x/59/c7/b5/59c7b5a2156420bf645a3ca2da51fa45.jpg",
      status: true,
    },
  ],
  "messages-1": [
    { id: 1, text: "Hi Bocchi!", date: "10:19", state: "in" },
    { id: 3, text: "Rofls", date: "10:20", state: "in" },
    {
      id: 6,
      text: "<3",
      date: "10:21",
      img: "https://i.pinimg.com/564x/46/f1/8e/46f18ebf029176c2ef86692a7f54fd6d.jpg",
      state: "out",
    },
    {
      id: 4,
      text: ">.<",
      date: "10:20",
      state: "in",
    },
    { id: 2, text: "Hiii!", date: "10:19", state: "out" },
    { id: 5, text: "gdfgdfgdf", date: "10:21", state: "out" },
  ],
  "messages-2": [
    {
      id: 1,
      text: "Konbanwaaa!!",
      date: "21:39",
      state: "out",
    },
    {
      id: 2,
      text: "",
      date: "21:39",
      img: "https://i.pinimg.com/564x/b6/e7/0a/b6e70a2780558f5651bada98bcbf8468.jpg",
      state: "out",
    },
    {
      id: 4,
      text: "",
      date: "23:51",
      img: "https://i.pinimg.com/736x/53/da/32/53da32becd006fc51e328d84322f7f5a.jpg",
      state: "in",
    },
    { id: 3, text: "...", date: "23:50", state: "in" },
  ],
  "messages-3": [
    { id: 1, text: "Yooo Bocchii!", date: "13:11", state: "in" },
    { id: 2, text: "<3", date: "13:13", state: "out" },
    {
      id: 4,
      text: ":__",
      date: "14:23",
      img: "https://i.pinimg.com/736x/71/e1/54/71e1540083e43efa9fbbabbe59297b09.jpg",
      state: "out",
    },
    {
      id: 3,
      text: ":3",
      date: "14:11",
      img: "https://i.pinimg.com/564x/36/1a/bd/361abdd8e803a699d580f4f3ae764b7a.jpg",
      state: "in",
    },
  ],

  "messages-4": [
    { id: 1, text: "Yooo!!", date: "15:16", state: "in" },
    {
      id: 2,
      text: "",
      date: "16:13",
      img: "https://i.pinimg.com/564x/f3/ed/86/f3ed863a4d9d6251223aec47a53e7bf7.jpg",
      state: "out",
    },
  ],
  newMessageText: "",
};

export const chatsSlice = createSlice({
  name: "chatsPage",
  initialState,
  reducers: {
    sendMessage: (state, action) => {
      let userMessages = `messages-${action.usertag}`;
      let msgIds = [];

      state[userMessages].map((msg) => {
        return msgIds.push(msg.id);
      });

      let maxMsgId = Math.max(...msgIds);

      let date = new Date();

      let msg = {
        id: ++maxMsgId,
        text: state.newMessageText,
        date: date.toLocaleTimeString([], { timeStyle: "short" }),
        state: "out",
      };

      state[userMessages].push(msg);
      state.newMessageText = "";
    },
    updateNewMessageText: (state, action) => {
      state.newMessageText = action.text;
    },
  },
});

export const { sendMessage, updateNewMessageText } = chatsSlice.actions;
