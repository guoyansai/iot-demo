import Idb from '../type';

const As: any = require('../../As');

const fs: any = require('fs');

class DbFile {
  config: any;
  fileDir: string;
  fileExt: string;
  constructor(config: any) {
    this.config = config;
    this.fileDir = config.dir;
    this.fileExt = config.ext;
  }

  toAbsolutePath(relativePath: string) {
    if (!relativePath || !relativePath.startsWith(this.fileDir)) {
      relativePath = this.fileDir + relativePath;
    }
    relativePath = process.cwd() + '\\' + relativePath.replace(/\//, '\\');
    return relativePath;
  }

  toDirPath(relativePath: string) {
    if (relativePath.endsWith(this.fileExt)) {
      const pathArr = relativePath.split('/');
      pathArr.pop();
      const dirPath = pathArr.join('/') + '//';
      return dirPath;
    }
    return relativePath;
  }

  async ensureDir(relativePath: string) {
    const absPath = this.toAbsolutePath(this.toDirPath(relativePath));
    if (this.config.create) {
      try {
        await fs.promises.stat(absPath);
      } catch (e) {
        // {recursive: true} 这个配置项是配置自动创建多层文件夹
        await fs.promises.mkdir(absPath, { recursive: true });
      }
    }
    return absPath;
  }

  getFile(file: string) {
    let filePath: string = file;
    if (!filePath.startsWith(this.fileDir)) {
      filePath = this.fileDir + filePath;
    }
    if (!filePath.endsWith(this.fileExt)) {
      filePath += this.fileExt;
    }
    this.ensureDir(filePath);
    return this.toAbsolutePath(filePath);
  }

  write(file: string, data: any) {
    try {
      const filePath = this.getFile(file);
      let fd = fs.openSync(filePath, 'w');
      fs.writeFileSync(fd, data);
      fs.closeSync(fd);
      return 'ok';
    } catch (e) {
      return e;
    }
  }

  del(file: string) {
    try {
      const filePath = this.getFile(file);
      fs.unlinkSync(filePath);
      return 'ok';
    } catch (e) {
      return e;
    }
  }

  read(file: string, char: string = 'utf8') {
    try {
      const filePath = this.getFile(file);
      const data = fs.readFileSync(filePath, char) || '';
      return [
        {
          data,
          file: filePath.split('\\').pop(),
        },
      ];
    } catch (e) {
      return e;
    }
  }

  list(dir: string) {
    try {
      const fileList: any = [];
      try {
        const files = fs.readdirSync(this.toAbsolutePath(this.fileDir + dir));
        (files || []).forEach((file: any) => {
          const readData: any = this.read(dir + file);
          fileList.push(readData[0]);
        });
      } catch (e) {
        this.ensureDir(this.fileDir + dir);
      }
      return fileList;
    } catch (e) {
      return e;
    }
  }

  sqlDb(sql: Idb) {
    return new Promise((resolve, reject) => {
      try {
        As.clog(666.9001, sql);
        let res: any;
        const dir = sql.table + '/';
        if (sql.type === 'insert') {
          const file = (sql.value as string[][])[0][0];
          const data = (sql.value as string[][])[0][1];
          res = this.write(dir + file, data);
        } else if (sql.type === 'delete') {
          const file = (sql.where as string[][])[0][2];
          res = this.del(dir + file);
        } else if (sql.type === 'update') {
          const file = (sql.where as string[][])[0][2];
          const data = (sql.set as string[][])[0][1];
          res = this.write(dir + file, data);
        } else if (sql.type === 'select') {
          if (sql.where) {
            const file = (sql.where as string[][])[0][2];
            res = this.read(dir + file);
            console.log(666.9002, res);
            let resObj: any = {};
            resObj[(sql.field as string[])[0]] = res[0].file;
            resObj[(sql.field as string[])[1]] = res[0].data;
            res = [resObj];
          } else {
            res = this.list(dir);
            if (res) {
              res = res.map((el: any) => {
                let resObj: any = {};
                resObj[(sql.field as string[])[0]] = el.file;
                resObj[(sql.field as string[])[1]] = el.data;
                return resObj;
              });
            }
          }
        }
        if (res) {
          resolve(As.resSuccess(res));
        } else {
          reject(As.resEmpty('sql err'));
        }
      } catch (e) {
        reject(As.resFail(e));
      }
    });
  }
}

export default DbFile;
module.exports = DbFile;
