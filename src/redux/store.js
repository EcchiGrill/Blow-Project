let store = {
  _state: {
    profilePage: {
      posts: [
        { id: 1, text: "This is my first post!", likeCount: 5 },
        {
          id: 2,
          text: "No bitches??",
          img: "https://i.pinimg.com/736x/45/7f/5c/457f5c7f1435df48e9c7765eda8c1748.jpg",
          likeCount: 13,
        },
      ],
      newPostText: "",
    },
    chatsPage: {
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
    },
  },

  _callSubscriber() {
    return console.log("State Changed");
  },

  setState(value) {
    this._state = value;
  },

  getState() {
    return this._state;
  },

  dispatch(action) {
    if (action.type === "ADD-POST") {
      let postIds = [];

      this._state.profilePage.posts.map((post) => {
        return postIds.push(post.id);
      });

      let maxPostId = Math.max(...postIds);

      let post = {
        id: ++maxPostId,
        text: action.text,
        img: "",
        likeCount: 0,
      };
      this._state.profilePage.posts.push(post);
      this._state.profilePage.newPostText = "";
      this._callSubscriber(this._state);
    } else if (action.type === "UPDATE-NEW-POST-TEXT") {
      this._state.profilePage.newPostText = action.postRef;
      this._callSubscriber(this._state);
    } else if (action.type === "SEND-MESSAGE") {
      let userMessages = `messages-${action.usertag}`;
      let msgIds = [];

      this._state.chatsPage[userMessages].map((msg) => {
        return msgIds.push(msg.id);
      });

      let maxMsgId = Math.max(...msgIds);

      let date = new Date();

      let msg = {
        id: ++maxMsgId,
        text: action.text,
        date: date.toLocaleTimeString([], { timeStyle: "short" }),
        state: "out",
      };

      this._state.chatsPage[userMessages].push(msg);
      this._state.chatsPage.newMessageText = "";
      this._callSubscriber(this._state);
    } else if (action.type === "UPDATE-NEW-MESSAGE-TEXT") {
      this._state.chatsPage.newMessageText = action.msgRef;
      this.sortFavoriteChats();
      this._callSubscriber(this._state);
    }
  },
  sortFavoriteChats() {
    this._state.chatsPage.chats.sort((user1, user2) => {
      return (
        this._state.chatsPage[`messages-${user2.usertag}`].length -
        this._state.chatsPage[`messages-${user1.usertag}`].length
      );
    });
  },

  subscriber(observer) {
    this._callSubscriber = observer;
  },
};

store.sortFavoriteChats();

export default store;
window.store = store;
