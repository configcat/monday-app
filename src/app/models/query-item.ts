export interface QueryItems {
  items: [QueryItem];
}

export interface QueryItem {
  id: string;
  board: {
    id: string;
  };
  name: string;
}
