import As from '@/utils/As';

export default {
  add(data: any) {
    return As.resApi({
      url: '/project/add',
      method: 'POST',
      data,
    });
  },
  edit(data: any) {
    return As.resApi({
      url: '/project/edit',
      method: 'POST',
      data,
    });
  },

  del(id: any) {
    return As.resApi({ url: '/project/del', method: 'GET', params: { id } });
  },

  read(id: any) {
    return As.resApi({ url: '/project/read', method: 'GET', params: { id } });
  },

  list() {
    return As.resApi({ url: '/project/list', method: 'GET' });
  },
};
