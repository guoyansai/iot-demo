import Api from '@/utils/Api';

export default {
  clog(...arg: any) {
    console.log(...arg);
  },
  jsonParse(str: any) {
    if (str && typeof str === 'string') {
      return JSON.parse(str);
    }
    return str;
  },

  resOk(code: any) {
    return code === 909;
  },
  resApi(apiConfig: any) {
    return new Promise((resolve, reject) => {
      // apiConfig.url = '/api' + apiConfig.url;
      Api(apiConfig)
        .then((res: any) => {
          if (res) {
            if (this.resOk(res.code)) {
              resolve(res.data);
            } else {
              if (res.data) {
                reject(new Error(res.data));
              }
            }
          } else {
            reject(new Error('empty!'));
          }
        })
        .catch((err: any) => {
          if (err.code && err.data) {
            reject(new Error(err.data));
          } else {
            reject(err);
          }
        });
    });
  },
};
