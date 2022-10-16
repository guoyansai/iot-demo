import { defineStore } from 'pinia';

type admin = {
  name: string;
  level: number;
};
let adminer: admin = {
  name: 'asai',
  level: 10,
};
const Login = (): Promise<admin> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(adminer);
    }, 2000);
  });
};

export default defineStore('admin', {
  state() {
    return {
      admin: <admin>adminer,
      desc: 'asaicc',
    };
  },
  getters: {
    adminName(): string {
      return this.admin.name;
    },
    adminLevel(): number {
      return this.admin.level;
    },
  },
  actions: {
    async setAdmin() {
      const result = await Login();
      this.admin = result;
      this.setName('阿赛');
    },
    setName(str: string) {
      this.admin.name = str;
    },
    addLevel(number: number) {
      this.admin.level += number;
    },
  },
});
