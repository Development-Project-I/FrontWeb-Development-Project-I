export const OPEN_MODAL = {
  CREATE_USER: "createUser",
  ADD_STOCK_ITEM: "addStockItem",
  CREATE_LESSON: "createLesson",
} as const;

export type OpenModalKey = (typeof OPEN_MODAL)[keyof typeof OPEN_MODAL];

export interface AppLocationState {
  openModal?: OpenModalKey;
}
