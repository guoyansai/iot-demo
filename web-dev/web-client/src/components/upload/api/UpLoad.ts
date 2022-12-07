import As from '@/utils/As';

export default {
  upLoadPicture(data: any) {
    return As.resApi({
      url: '/upload/picture',
      method: 'POST',
      data,
    });
  },
};
