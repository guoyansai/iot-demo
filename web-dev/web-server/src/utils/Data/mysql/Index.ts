import type Idb from '../type';

const Sql: any = require('../Sql');
const As: any = require('../../As');
class DbMySQL {
  config: any;
  mysql: any;
  pool: any;
  constructor(config: any) {
    this.config = config;
    this.mysql = require('mysql');
    // 建立数据库连接池
    this.pool = this.mysql.createPool(this.config);
  }

  getErr(sql: Idb, err: any) {
    var errs = err?.message || null;
    this.createTabel(sql);
    return errs;
  }
  getResult(rows: any) {
    var result = rows ?? null;
    return result;
  }
  query(sql: Idb, callback: any) {
    As.clog(666.101, sql, callback);
    this.pool.getConnection((error: any, connection: any) => {
      if (error) {
        this.getErr(sql, error);
        As.clog(666.102, error, connection);
      } else {
        connection.query(Sql.makeSql(sql), (err: any, rows: any) => {
          As.clog(666.103, err, rows);
          callback(this.getErr(sql, err), this.getResult(rows));
          connection.release();
        });
      }
    });
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

  createTabel(sql: Idb) {
    if (this.config.create) {
      const conn = this.mysql.createConnection({
        host: this.config.host,
        user: this.config.user,
        password: this.config.password,
      });
      conn.connect((err: any) => {
        if (err) {
          As.clog(666.9901, 'Database Connection Failed !!!', err);
        } else {
          As.clog(666.9902, 'connected to Database');
          conn.query(
            `CREATE DATABASE IF NOT EXISTS ${this.config.database};`,
            (err: any) => {
              if (err) {
                throw err;
              } else {
                As.clog(666.9903, 'Database Created Successfully !');
              }
              this.pool = this.mysql.createPool(this.config);
              this.pool.getConnection((error: any, connection: any) => {
                if (error) {
                  As.clog(666.1012, error, connection);
                } else {
                  connection.query(
                    Sql.createSql(sql, 'mysql'),
                    (err: any, rows: any) => {
                      As.clog(666.1013, err, rows);
                      connection.release();
                    }
                  );
                }
              });
            }
          );
        }
      });
    }
  }
}

export default DbMySQL;
module.exports = DbMySQL;
