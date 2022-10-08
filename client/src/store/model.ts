import { defineStore } from "pinia";
import type { IIotModel } from "./type";

export default defineStore("model", {
  state() {
    return {
      storeIotModel: undefined as IIotModel | undefined,
    };
  },
});
