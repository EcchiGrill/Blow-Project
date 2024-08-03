let state = {
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
  },
  chatsPage: {
    chats: [
      {
        id: 1,
        username: "Ryo",
        avatar:
          "https://i.pinimg.com/564x/be/c6/ce/bec6ce7cd23e943519e9d7bb3c359d0a.jpg",
        status: true,
      },
      {
        id: 2,
        username: "Nijika",
        avatar:
          "https://i.pinimg.com/564x/06/9f/bf/069fbf8ea7e830f49b296018ff387f32.jpg",
        status: false,
      },
      {
        id: 3,
        username: "Rita",
        avatar:
          "https://i.pinimg.com/564x/dc/9f/dd/dc9fdda3f427bb7c42d8cb70b9233255.jpg",
        status: true,
      },
    ],
    messages: {
      msgIn: [
        { id: 1, text: "Hi Bocchi!", date: "10:19" },
        { id: 2, text: "Rofls", date: "10:20" },
        {
          id: 3,
          text: ">.<",
          date: "10:20",
        },
      ],
      msgOut: [
        { id: 1, text: "Hiii!", date: "10:19" },
        { id: 2, text: "gdfgdfgdf", date: "10:21" },
        {
          id: 3,
          text: "<3",
          date: "10:21",
          img: "https://i.pinimg.com/564x/46/f1/8e/46f18ebf029176c2ef86692a7f54fd6d.jpg",
        },
      ],
    },
  },
};

export default state;
