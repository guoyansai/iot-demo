import type Idb from '../type';
import XLSX from 'xlsx';

const As: any = require('../../As');
class DbExcel {
  config: any;
  dbconfig: any;
  pool: any;
  constructor(config: any) {
    this.config = config;
    this.dbconfig = config;
    this.pool = XLSX.readFile(this.dbconfig.database);
  }
  getWhere(el: any, elc: any) {
    return el[elc[0]] === elc[1];
  }
  getOrder(a: any, b: any, elc: any) {
    if (elc[1] === 'asc') {
      return a[elc[0]] - b[elc[0]];
    } else {
      return b[elc[0]] - a[elc[0]];
    }
  }
  readSheet(where: any, order: any, top: number = 0, sheetName: any = '') {
    const workSheet = this.pool.Sheets[sheetName || this.pool.SheetNames[0]];
    let vals = XLSX.utils.sheet_to_json(workSheet);
    if (where && where.length && vals.length) {
      where.forEach((elc: any) => {
        vals = vals.filter((el: any) => this.getWhere(el, elc));
      });
    }
    if (order && order.length && vals.length) {
      order.forEach((elc: any) => {
        vals = vals.sort((a: any, b: any): number => this.getOrder(a, b, elc));
      });
    }
    if (top > 0 && vals.length > top) {
      vals = vals.slice(0, top);
    }
    return vals;
  }

  addData(data: any, sheetName: any = '') {
    const workSheet = this.pool.Sheets[sheetName || this.pool.SheetNames[0]];
    let headerArr: any = XLSX.utils.sheet_to_json(workSheet, {
      header: 1,
      range: 'A1:ZZ1',
    });
    XLSX.utils.sheet_add_json(workSheet, data, {
      header: headerArr[0],
      skipHeader: true,
      origin: -1,
    });
    XLSX.writeFile(this.pool, this.dbconfig.database);
  }

  editData(data: any, where: any, sheetName: any = '') {
    const workSheet = this.pool.Sheets[sheetName || this.pool.SheetNames[0]];
    let headerArr: any = XLSX.utils.sheet_to_json(workSheet, {
      header: 1,
      range: 'A1:ZZ1',
    });
    const header = headerArr[0];
    const vals: any = this.readSheet('', '', 0, sheetName);
    let valIndex: any = vals.findIndex((el: any) => {
      let tVal = true;
      if (where && where.length) {
        where.forEach((elc: any) => {
          tVal = tVal && this.getWhere(el, elc);
        });
      }
      return tVal;
    });
    if (valIndex > -1) {
      valIndex += 2;
      XLSX.utils.sheet_add_json(workSheet, data, {
        header,
        skipHeader: true,
        origin: 'A' + valIndex,
      });
      XLSX.writeFile(this.pool, this.dbconfig.database);
    } else {
      console.log(where + '查无数据');
    }
  }

  deleteData(where: any, sheetName: any = '') {
    const workSheet = this.pool.Sheets[sheetName || this.pool.SheetNames[0]];
    const vals: any = this.readSheet('', '', 0, sheetName);
    let valIndex: any = vals.findIndex((el: any) => {
      let tVal = true;
      if (where && where.length) {
        where.forEach((elc: any) => {
          tVal = tVal && this.getWhere(el, elc);
        });
      }
      return tVal;
    });
    if (valIndex > -1) {
      valIndex += 1;
      this.delete_row(workSheet, valIndex);
      XLSX.writeFile(this.pool, this.dbconfig.database);
    } else {
      console.log(where + '查无数据');
    }
  }
  ec(r: any, c: number) {
    return XLSX.utils.encode_cell({ r: r, c: c });
  }
  delete_row(ws: any, row_index: number) {
    var variable = XLSX.utils.decode_range(ws['!ref']);
    for (var R = row_index; R < variable.e.r; ++R) {
      for (var C = variable.s.c; C <= variable.e.c; ++C) {
        ws[this.ec(R, C)] = ws[this.ec(R + 1, C)];
      }
    }
    variable.e.r--;
    ws['!ref'] = XLSX.utils.encode_range(variable.s, variable.e);
  }

  getErr(err: any) {
    var errs = err?.message || null;
    return errs;
  }
  getResult(rows: any) {
    var result = rows ?? 'OK';
    return result;
  }
  query(sql: Idb, callback: any) {
    return new Promise((resolve: any, reject: any) => {
      try {
        if (sql.type === 'insert') {
          let data = {};
          // let vals=sql.value??''.split(',')
          sql.field ?? ''.split(',').forEach((el: any) => {});
          this.addData(data, sql.table);
        } else if (sql.type === 'delete') {
          let where = {};
          this.deleteData(where, sql.table);
        } else if (sql.type === 'updata') {
          let data = {};
          let where = {};
          this.editData(data, where, sql.table);
        } else if (sql.type === 'select') {
          let where = {};
          let order = {};
          let top = 0;
          this.readSheet(where, order, top, sql.table);
        }
        resolve('OK');
      } catch (e) {
        reject(e);
      }
    });
  }

  sqlDb(sql: Idb) {
    As.clog(666.789, sql);
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
}

export default DbExcel;
module.exports = DbExcel;
