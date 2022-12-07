import type Idb from '../type';

const Sql: any = require('../Sql');
const As: any = require('../../As');
const sqlite3: any = require('sqlite3');

class DbSQLite3 {
  config: any;
  pool: any;
  sqlite3: any;
  constructor(config: any) {
    this.config = config;
    this.sqlite3 = sqlite3.verbose();
    this.pool = new this.sqlite3.Database(this.config.database, (err: any) => {
      if (err) throw err;
    });
  }
  getErr(sql: Idb, err: any) {
    var errs = err?.message || null;
    As.clog(666.3005, errs);
    this.createTable(sql);
    return errs;
  }
  getResult(rows: any) {
    var result = rows ?? 'OK';
    return result;
  }
  query(sql: Idb, callback: any) {
    try {
      if (sql.type === 'select') {
        // 直接返回一个obj
        // this.pool.each(Sql.makeSql(sql), (err: any, rows: any) => {
        //   As.clog(666.103, err, rows);
        //   callback(this.getErr(err), this.getResult(rows));
        // });
        this.pool.all(Sql.makeSql(sql), (err: any, rows: any) => {
          // As.clog(666.104, err, rows);
          callback(this.getErr(sql, err), this.getResult(rows));
        });
      } else {
        this.pool.run(Sql.makeSql(sql), (err: any, rows: any) => {
          As.clog(666.105, err, rows);
          callback(this.getErr(sql, err), this.getResult(rows));
        });
      }
    } catch (e) {
      callback(this.getErr(sql, e), this.getResult('sql err'));
    }
  }
  sqlDb(sql: Idb) {
    return new Promise((resolve, reject) => {
      try {
        this.query(sql, (err: any, result: any) => {
          if (err) {
            reject(As.resFail(err));
          } else if (!result || (Array.isArray(result) && !result.length)) {
            resolve(As.resEmpty(sql.type + ' is null'));
          } else {
            resolve(As.resSuccess(result));
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  createTable(sql: Idb) {
    if (this.config.create) {
      this.pool.run(Sql.createSql(sql, 'sqlite'), (err: any, rows: any) => {
        As.clog(666.107, err, rows);
      });
    }
  }
}

export default DbSQLite3;
module.exports = DbSQLite3;
