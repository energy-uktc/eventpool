export const ALL_EVENTS = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "Board Games",
    startDate: new Date(2021, 7, 23, 0, 0),
    endDate: new Date(2021, 7, 24, 13, 54),
    createdBy: "an7ccbea-c1b1-46c2-aed5-3ad53abb28ba",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Cinema night",
    description: "Хайде да ходим да гледаме Цар лъв. После ще хапнем пица и тинтири минтири",
    startDate: new Date(2021, 7, 29, 20, 0),
    location: {
      title: "Some Location Object",
    },
    createdBy: "an7ccbea-c1b1-46c2-aed5-3ad53abb28ba",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Villa for the Weekend",
    startDate: new Date(2021, 6, 21),
    endDate: new Date(2021, 6, 23),
    createdBy: "an7ccbea-c1b1-46c2-aed5-3ad53abb28ba",
    createdAt: new Date(2021, 3, 21),
    lastUpdate: new Date(2021, 3, 21),
    activities: [
      {
        id: "58694a0f-3da1-471f-bd96-145571e29d73",
        title: "Каяци",
        description: "Да се спуснем с каяци по Струма",
      },
      {
        id: "58694a0f-3da1-471f-bd96-145571e29d74",
        title: "Рилски манстир",
        description: "Разходка до Рилския манастир",
      },
    ],
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f27",
    title: "Cinema night 2",
    description: "Хайде да ходим да гледаме Цар лъв. После ще хапнем пица и тинтири минтири",
    startDate: new Date(2021, 6, 3, 20, 0),
    location: {
      title: "Some Location Object",
    },
    createdBy: "an7ccbea-c1b1-46c2-aed5-3ad53abb28ba",
  },
];

export const ACTIVE_EVENTS = () => {
  return ALL_EVENTS.filter((event) => {
    if (event.startDate.getTime() > Date.now()) {
      return true;
    }
    if (event.endDate && event.endDate.getTime() > Date.now()) {
      return true;
    }
    return false;
  });
};
