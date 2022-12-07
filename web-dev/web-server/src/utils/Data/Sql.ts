import type Idb from './type';

const As: any = require('../As');

module.exports = {
  joinSql(sql: Idb, type: 'where' | 'order' | 'value' | 'set' | 'field') {
    var val = sql[type];
    var tmp = '';
    if (Array.isArray(val)) {
      const len: number = val.length;
      if (len > 0) {
        if (type === 'where') {
          tmp = ' where ';
          let tmpx: any = '';
          let tmpEnd = '';
          for (let i = 0; i < len; i++) {
            let el = val[i];
            if (el === 'or' || el === 'and') {
              tmpEnd = ')';
              if (tmpx) {
                tmp += ')';
              }
              tmpx = el;
              i++;
              el = val[i];
              if (el === 'or' || el === 'and') {
                tmp += ' ' + tmpx;
                tmpx = el;
                i++;
                el = val[i];
              }
              tmp += ' (' + el[0] + ' ' + el[1] + ' ' + el[2];
            } else {
              tmp +=
                ' ' + tmpx + ' ' + el[0] + ' ' + el[1] + " '" + el[2] + "'";
            }
          }
          tmp += tmpEnd;
          return tmp;
        } else if (type === 'order') {
          tmp = ' order by';
          for (let i = 0; i < len; i++) {
            let el = val[i];
            if (i > 0) {
              tmp += ',';
            }
            tmp += ' ' + el[0] + ' ' + el[1];
          }
          return tmp;
        } else if (type === 'value') {
          tmp = " values ('";
          for (let i = 0; i < len; i++) {
            let el = val[i] as any[];
            if (i > 0) {
              tmp += "'),('";
            }
            tmp += el.join("','");
          }
          tmp += "')";
          return tmp;
        } else if (type === 'set') {
          tmp = ' set ';
          for (let i = 0; i < len; i++) {
            let el = val[i] as [string, any][];
            if (i > 0) {
              tmp += ',';
            }
            tmp += el[0] + "='" + el[1] + "'";
          }
          return tmp;
        } else if (type === 'field') {
          tmp = ' (';
          for (let i = 0; i < len; i++) {
            let el = val[i] as string;
            if (i > 0) {
              tmp += ',';
            }
            tmp += el;
          }
          tmp += ')';
          return ' (' + val.join(',') + ')';
        }
      } else {
        if (['value', 'set'].includes(type)) {
          // 不能为空
        }
      }
    } else if (val) {
      if (type === 'where') {
        return ' where ' + val;
      } else if (type === 'order') {
        return ' order by ' + val;
      } else if (type === 'value') {
        return ' values (' + val + ')';
      } else if (type === 'set') {
        return ' set ' + val;
      } else if (type === 'field') {
        return ' (' + val + ')';
      }
    }
    return '';
  },
  makeSql(sql: Idb) {
    // sqlite查询sql的时候，有些指定的语句不支持order与limit
    var sqls = sql.type;
    if (sqls === 'insert') {
      sqls += ' into';
      sqls += ' ' + sql.table;
      sqls += this.joinSql(sql, 'field');
      sqls += this.joinSql(sql, 'value');
    } else if (sqls === 'delete') {
      sqls += ' from ' + sql.table;
      sqls += this.joinSql(sql, 'where');
    } else if (sqls === 'update') {
      sqls += ' ' + sql.table;
      sqls += this.joinSql(sql, 'set');
      sqls += this.joinSql(sql, 'where');
    } else if (sqls === 'select') {
      sqls += sql.field ? ' ' + sql.field : ' *';
      sqls += ' from ' + sql.table;
      sqls += this.joinSql(sql, 'where');
      sqls += this.joinSql(sql, 'order');
      sqls += sql.limit ? ' limit ' + sql.limit : '';
    }
    As.clog(666.111, sqls);
    return sqls;
  },
  createSql(sql: Idb, type: string = 'mysql') {
    let sqlStr: any;
    let autoId: string;
    if (type === 'sqlite') {
      autoId = 'AUTOINCREMENT';
    } else {
      autoId = 'AUTO_INCREMENT';
    }
    sqlStr = `create table if not exists ${sql.table} (`;
    if (!sql.field || !sql.field.includes('id')) {
      sqlStr += `id INTEGER PRIMARY KEY ${autoId},`;
    }
    if (sql.field) {
      let fieldValue: any[];
      if (typeof sql.field === 'string') {
        fieldValue = sql.field.split(',');
      } else {
        fieldValue = sql.field;
      }
      fieldValue.forEach((el: string) => {
        sqlStr += `${el} text,`;
      });
    }
    sqlStr += `asdate text default(CURRENT_TIMESTAMP))`;
    As.clog(666.1007, sqlStr);
    return sqlStr;
  },
};
