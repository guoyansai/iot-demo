const DataSql: any = {
  mysql: require('./mysql/Index'),
  sqlite: require('./sqlite/Index'),
  file: require('./file/Index'),
  excel: require('./excel/Index'),
};
module.exports = function (type: string = 'file', config: any = {}) {
  const dbTmp = DataSql[type];
  if (dbTmp) {
    return new dbTmp(config);
  }
  return {};
};
