import { GameState } from "./game-state.js";
import { Assets } from "pixi.js";

export function createStateManager() {
  let currentState = GameState.MENU;

  return {
    getState() {
      return currentState;
    },

    setState(newState) {
      currentState = newState;
      console.log("State changed to:", newState);
    },

    is(state) {
      return currentState === state;
    },
  };
}
