# MySQL8数据库的安装与使用

## 下载MYSQL8数据库
- 网址：https://www.mysql.com/downloads/
### 社区版和企业版的区别：
1. 商业版本组织管理和测试环节控制更严格，稳定性方面，比社区版更稳定
2. MySQL是成熟产品，商业版和社区办性能方面相差不大
3. 商业版不遵守GPL协议，社区版GPL协议可以免费使用
4. 使用商业版可以购买相关服务，享受7*24小时技术支持以及定时不定等服务，但是用户必须为此支付费用
5. 社区版本的维护费用只能靠社区提供，无法像商业版获得保障以及补丁解决服务，但是社区办完全免费，所以质量和时效性无法与商业版相比

## 解压zip包到任意目录
- 建议在D盘的mysql8文件夹下
## 添加bin目录到环境变量-系统变量的path中
- 如：D:\mysql8\bin
## 在mysql8根目录配置my.ini文件
```ini
[mysqld]
# 设置3306端口
port=3306

# 设置mysql的安装目录
basedir=D:\\mysql8   # 此处要用双斜杠\\

# 设置mysql数据库的数据的存放目录
datadir=D:\\mysql8\\data   # 此处要用双斜杠\\

# 允许最大连接数
max_connections=200

# 允许连接失败的次数。这是为了防止有人从该主机试图攻击数据库系统
max_connect_errors=10

# 服务端使用的字符集默认为UTF8
character-set-server=utf8

# 创建新表时将使用的默认存储引擎
default-storage-engine=INNODB

# 默认使用“mysql_native_password”插件认证
default_authentication_plugin=mysql_native_password

[mysql]
# 设置mysql客户端默认字符集
default-character-set=utf8

[client]
# 设置mysql客户端连接服务端时默认使用的端口
port=3306
default-character-set=utf8
```
## 以管理员身份运行cmd安装
- 必须
## 初始化数据库
- 在MySQL安装目录的 bin 目录下执行命令：
```cmd
mysqld   --initialize   --console
```
- 执行完成后，会打印 root 用户的初始默认密码，注意记录一下
- 没记也没事，删掉初始化的`data`目录，执行一遍初始化命令，再重新生成
## 安装MySQL服务
- 在MySQL安装目录的 bin 目录下执行命令：
```cmd
mysqld --install [服务名]
```
- 后面的服务名可以不写，默认的名字为 mysql。当然，如果你的电脑上
- 需要安装多个MySQL服务，可以用不同的名字，比如 mysql5 和 mysql8
## 卸载MySQL服务
```cmd
sc delete MySQL/mysqld -remove
```
## 启动MySQL服务
```cmd
net start mysql
```
## 停止MySQL服务
```cmd
net stop mysql
```
## 更改密码
- 在MySQL安装目录的 bin 目录下执行命令：
```cmd
mysql -u root -p
```
- 窗口会提示输入密码，记住了上面安装时的密码，输入即可登录成功，进入MySQL命令模式。
- 执行下面改密码命令
```cmd
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '新密码';  
```
## 其他命令
- 查看一下默认安装的数据库：
```cmd
show databases;
```
- 查看mysql数据库中的表：
```cmd
use mysql;
show tables;
```
- 查询user中有多少字段：
```cmd
desc user;
```
- 查询user表的部分信息：
```cmd
 select user,host,authentication_string from mysql.user;
```