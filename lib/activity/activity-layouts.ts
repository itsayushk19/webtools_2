export const ActivityLayouts = {
  case_convertor: {
    layout: [
      {
        type: "row",
        fields: ["text"],
      },
      {
        type: "row",
        fields: ["option"],
      },
    ],
  },

  lorem_ipsum: {
    layout: [
      {
        type: "grid",
        columns: 2,
        fields: ["paragraphs", "includeHTML"],
      },
    ],
  },

  word_counter: {
    layout: [
      {
        type: "row",
        fields: ["text"],
      },
      {
        type: "row",
        fields: ["includeSpaces"],
      },
    ],
  },
} as const;
