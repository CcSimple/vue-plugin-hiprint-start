export default {
  panels: [
    {
      index: 0,
      height: 210,
      width: 210,
      printElements: [
        {
          options: {
            left: 50,
            top: 20,
            height: 13,
            width: 120,
            title: "姓名",
            field: "name",
            testData: "这是模板",
            color: "#f00808",
            textDecoration: "underline",
            textAlign: "center",
          },
          printElementType: { title: "文本", type: "text" },
        },
      ],
    },
  ],
};
