export const navLinks = [
  {
    label: "Home",
    route: "/",
    icon: "/assets/icons/home.svg",
  },
  {
    label: "Text Tools",
    route: "/activity/add/text_tools",
    icon: "/assets/icons/text_tools.svg",
  },
  {
    label: "Hash Generators",
    route: "/activity/add/hash",
    icon: "/assets/icons/hash.svg",
  },
  {
    label: "Color Tools",
    route: "/activity/add/color",
    icon: "/assets/icons/color.svg",
  },
  {
    label: "Coding Tools",
    route: "/activity/add/coding",
    icon: "/assets/icons/coding.svg",
  },
  {
    label: "Random Password",
    route: "/activity/add/rpassword",
    icon: "/assets/icons/rpassword.svg",
  },
  {
    label: "Profile",
    route: "/profile",
    icon: "/assets/icons/profile.svg",
  },
  {
    label: "Buy Credits",
    route: "/credits",
    icon: "/assets/icons/bag.svg",
  },
];

export const plans = [
  {
    _id: 1,
    name: "Free",
    icon: "/assets/icons/free-plan.svg",
    price: 0,
    credits: 20,
    inclusions: [
      {
        label: "20 Free Credits",
        isIncluded: true,
      },
      {
        label: "Basic Access to Services",
        isIncluded: true,
      },
      {
        label: "Priority Customer Support",
        isIncluded: false,
      },
      {
        label: "Priority Updates",
        isIncluded: false,
      },
    ],
  },
  {
    _id: 2,
    name: "Pro Package",
    icon: "/assets/icons/free-plan.svg",
    price: 40,
    credits: 120,
    inclusions: [
      {
        label: "120 Credits",
        isIncluded: true,
      },
      {
        label: "Full Access to Services",
        isIncluded: true,
      },
      {
        label: "Priority Customer Support",
        isIncluded: true,
      },
      {
        label: "Priority Updates",
        isIncluded: false,
      },
    ],
  },
  {
    _id: 3,
    name: "Premium Package",
    icon: "/assets/icons/free-plan.svg",
    price: 199,
    credits: 2000,
    inclusions: [
      {
        label: "2000 Credits",
        isIncluded: true,
      },
      {
        label: "Full Access to Services",
        isIncluded: true,
      },
      {
        label: "Priority Customer Support",
        isIncluded: true,
      },
      {
        label: "Priority Updates",
        isIncluded: true,
      },
    ],
  },
];

export const ActivityTypes = {
  case_convertor: {
    type: "text_tools",
    title: "Case Convertor",
    subTitle: "Effortlessly convert between text cases",
    config: {
      fields: [
        {
          name: "text",
          label: "Enter your text",
          type: "textarea",
          placeholder: "Type or paste text here...",
          validation: { required: true, minLength: 1 },
        },
        {
          name: "option",
          label: "Convert to",
          type: "select",
          options: ["uppercase", "lowercase", "titlecase", "camelcase", "snakecase"],
          defaultValue: "uppercase",
          validation: { required: true },
        },
      ],
    },
  },

  lorem_ipsum: {
    type: "text_tools",
    title: "Lorem Ipsum Generator",
    subTitle: "Easy to generate Lorem Ipsum for your placeholder text",
    icon: "lorem_ipsum.svg",
    config: {
      fields: [
      {
        name: "paragraphs",
        label: "Number of Paragraphs",
        type: "number",
        defaultValue: 3,
        validation: { required: true }
      },
      {
        name: "wordsPerParagraph",
        label: "Words per Paragraph",
        type: "number",
        defaultValue: 50,
        validation: { required: true }
      },
      {
        name: "includeHTML",
        label: "Include HTML Tags",
        type: "checkbox",
        defaultValue: false,
        validation: { required: true }
      },
    ],
    }
  },

  remove_whitespace: {
    type: "text_tools",
    title: "Whitespace Remover",
    subTitle: "Remove annoying whitespaces and optimize your text",
    icon: "remove_whitespace.svg",
    config: {
      fields: [
      {
        name: "text",
        label: "Enter Text",
        type: "textarea",
        placeholder: "Paste your text here...",
        validation: { required: true }
      },
      {
        name: "removeExtraSpaces",
        label: "Remove Extra Spaces",
        type: "checkbox",
        defaultValue: true,
        validation: { required: true }
      },
      {
        name: "trimLines",
        label: "Trim Each Line",
        type: "checkbox",
        defaultValue: true,
        validation: { required: true }
      },
      {
        name: "removeNewLines",
        label: "Remove New Lines",
        type: "checkbox",
        defaultValue: false,
        validation: { required: true }
      },
    ],
    }
  },

  word_counter: {
    type: "text_tools",
    title: "Word Counter",
    subTitle: "Count words, sentences and characters in your text easily",
    icon: "word_counter.svg",
    config:{
      fields: [
      {
        name: "text",
        label: "Enter Text",
        type: "textarea",
        placeholder: "Paste text to analyze...",
        validation: { required: true }
      },
      {
        name: "includeSpaces",
        label: "Include Spaces in Count",
        type: "checkbox",
        defaultValue: false,
        validation: { required: true }
      },
    ],
    }
  },
} as const;


export type ActivityTypeKey = keyof typeof ActivityTypes


export const aspectRatioOptions = {
  "1:1": {
    aspectRatio: "1:1",
    label: "Square (1:1)",
    width: 1000,
    height: 1000,
  },
  "3:4": {
    aspectRatio: "3:4",
    label: "Standard Portrait (3:4)",
    width: 1000,
    height: 1334,
  },
  "9:16": {
    aspectRatio: "9:16",
    label: "Phone Portrait (9:16)",
    width: 1000,
    height: 1778,
  },
};

export const defaultValues = {
  title: "",
  aspectRatio: "",
  color: "",
  prompt: "",
  publicId: "",
};

export const creditFee = -1;