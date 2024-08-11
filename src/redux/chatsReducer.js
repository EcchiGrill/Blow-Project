const SEND_MSG = "SEND-MESSAGE";
const UPDATE_NEW_MSG_TEXT = "UPDATE-NEW-MESSAGE-TEXT";

const chatsReducer = (state, action) => {
  switch (action.type) {
    case SEND_MSG:
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
      return state;

    case UPDATE_NEW_MSG_TEXT:
      state.newMessageText = action.text;
      return;

    default:
      return state;
  }
};

export const sendMessageActionCreator = (usertag) => {
  return { type: SEND_MSG, usertag: usertag };
};

export const updateNewMessageTextActionCreator = (value) => {
  return { type: UPDATE_NEW_MSG_TEXT, text: value };
};

export default chatsReducer;
