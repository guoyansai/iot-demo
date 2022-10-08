import { defineStore } from 'pinia';
import useUserStore from './user';
import adminStore from './admin';
import modelStore from './model';
import { TIotModel } from './templateModel';

interface TestObject {
  label: string;
  phone: number;
}
export default defineStore({
  id: 'app',
  state: () => {
    const user = useUserStore();
    const model = modelStore();
    const admin = adminStore();
    return {
      model,
      title: 'vue3-template',
      user,
      admin,
      obj: undefined as TestObject | undefined,
    };
  },
  getters: {
    userRole: (state) => state.user.role,
    storeIotModel: (state) => state.model.storeIotModel,
  },
  actions: {
    changeTitle() {
      this.title = 'vue3-template！';
    },
    initModel() {
      this.model.storeIotModel = TIotModel;
    },
  },
});
