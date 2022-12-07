# SQLite数据库创建表与增删改查

## 创建表
- 注意：sqlite_开头的表名是保留表名，供SQLite内部使用
### 创建正式表
- 关键字：`CREATE TABLE`
```sql
CREATE TABLE default_table
(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  value VARCHAR
);
```
### 创建临时表
- 关键字：`CREATE TEMP TABLE`或者`CREATE TEMPORARY TABLE`
```sql
CREATE TEMP TABLE temp_table
(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  value VARCHAR
);
```
### `IF NOT EXISTS`
- 背景：数据库中已经存在一张名称为table的表
- 操作：再创建一张名称为table的表
- 结果
   - 不使用`IF NOT EXISTS`时：报错`[SQLITE_ERROR] SQL error or missing database (table default_table already exists)`
   - 使用`IF NOT EXISTS`时：不报错，也不创建表。
### `schema-name`
`schema-name`表示要创建的表所属的数据库。只能填main, temp和附加数据库。其中main对应正式表；temp对应临时表；附加数据库对应在某一个附加数据库中创建的表。

要把数据库attached_to_sqlite_study.db作为当前数据库的附加库，只需要执行下述命令即可。如果附加库已存在，则直接关联上，否则先创建一个数据库，再做关联。
```sql
-- 把数据库attached_to_sqlite_study.db作为当前数据库的附加库，并取别名(schema-name)为attached
ATTACH DATABASE 'attached_to_sqlite_study.db' AS 'attached';
```
### `select-stmt`
- CREATE TABLE ... AS SELECT语句根据查询语句的结果，创建与填充表内容。
- 假如已经存在表default_table，
```sql
CREATE TABLE IF NOT EXISTS select_table AS SELECT * FROM default_table WHERE id < 5;
```
- 注意：通过查询语句创建出来的表中有rowid没有主键和约束，每个列的默认值都是NULL，同时排序方式为BINARY
### column-def和table-constraint
除了CREATE TABLE ... AS SELECT类操作外，创建表必须包含列信息。创建没有列信息的数据表`CREATE TABLE no_column_table();`会报错。 另外部分约束是针对多列或者整个表而言（table-constraint），可以集中写在列信息后面。表约束也可以用于约束某一列。约束的检查出现在增（INSERT）和改（UPDATE和部分ALERT）时，删和查的时候一般不会检查约束的限制。
- 包括了列名（column-name）、类型（type-name）和列约束（column-constraint）。其中只有列名是必须的。
- 类型：SQLite中，列的类型不会被用来限制存入数据的类型。实际上SQLite采用的是动态类型。
- 列约束：可选的列约束包括主键、空判断、逻辑判断、默认值、排序方式、外键、生成列等。
- 列约束和表约束限制了数据的取值范围，可以通过命令`PRAGMA ignore_check_constraints=ON`暂时忽略。

### 数据类型
SQLite中包含5个主要存储类型NULL，INTEGER，REAL，TEXT和BLOB；还有5个主要声明类型：NUMERIC，INTEGER，，REAL，TEXT和BLOB。

为了兼容其他SQL数据库，SQLite还有些其他类型，但是实际上都是上面这五个类型。比如：BOOLEAN：其实是INTEGER类型，1代表true；0代表false。

### DEFAULT语句
DEFAULT语句为一列提供了默认值，如果插入一行数据时没有填该列，则该列被DEFAULT语句对应的值填充，否则填充NULL。默认值本身也可以是NILL。DEFAULT后面可以接表达式、具体值和时间。
- 表达式里面还有比较丰富的结构，时间可以填CURRENT_TIME、CURRENT_DATE和CURRENT_TIMESTAMP，格式分别为HH:MM:SS、YYYY-MM-DD和YYYY-MM-DD HH:MM:SS 。
### COLLATE语句
排序语句用于关键字的排序依据。可以配置为BINARY（默认）、NOCASE和RTRIM。

- BINARY：使用memcmp()比较数据。
- NOCASE：即不区分大小写的对比模式。除了把大写字母视为小写字母外，和BINARY相同。
- RTRIM：除了会忽略末尾的空格外，和BINARY相同。
### (GENERATED ALWAYS)AS语句
`GENERATED ALWAYS AS`用于修饰生成的列，可以简写为AS。生成的列的值，由同一行其他列的值计算而得到。生成的列可以是虚拟列VIRTUAL（默认）或者是存储列STORED。生成列可以包含其他生成列，但是不能直接或间接地包括自身。

下面的命令创建了一个名为generate_table的表。注意：生成的列不需要都在末尾，可以在表的任意位置。
```sql
CREATE TABLE IF NOT EXISTS generate_table(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rand INTEGER DEFAULT (random()%10),
    -- 生成虚拟列
    generated_virtual INTEGER GENERATED ALWAYS AS ( id + rand ) VIRTUAL,
    -- 生成存储列
    generated_stored INTEGER GENERATED ALWAYS AS ( id + rand ) STORED,
    -- 生成虚拟列
    generated_default INTEGER GENERATED ALWAYS AS ( generated_virtual + generated_stored )
);
```
### PRIMARY KEY
PRIMARY KEY代表表的主键，一张表只能有一个主键。主键的性质如下：
- 主键可以由一个或者多个列构成，当PRIMARY KEY用作列约束时，代表主键只由这一列构成。
- 对于没有ROWID的表来说，主键是必须存在的；而对于其他表来说，是不一定存在的。
- 如果主键仅由一列构成，同时这一列的类型是INTEGER，则主键列的组合不能重复。
- NULL也可以作为主键，而且NULL被认为不同于其它所有值，包括其它NULL。在SQL标准下，主键不应该被允许传NULL，但是由于历史BUG，SQLite支持传NULL。
### UNIQUE约束
UNIQUE和PRIMARY KEY的含义相似，即不能相同。两者通常都是通过创建唯一索引（CREATE UNIQUE INDEX）达到去重的目的。仅无ROWID表上的INTEGER PRIMARY KEY和PRIMARY KEYs例外。INTEGER PRIMARY KEY是RowId的拷贝，而PRIMARY KEYs由多个列构成。
- 注意：这里的INTEGER PRIMARY KEY不包含特殊情况：INTEGER PRIMARY KEY DESC。
### Check约束
Check约束用于在插入和更新数据时检查数据是否符合要求。Check约束的表达式结果都会被转换为NUMERIC类型，转换方法和Cast命令用的相同。如果是0（包括整型0和浮点类型0.0）则发生约束冲突，即不符合要求；如果是其他值（包括NULL），则代表符合要求。Check约束既可以约束当前列，也可以约束其他列，也可以约束列之间的关系等。

下面的命令创建了一个名为check_table的表。其中列rand10被rand10 > 0和rand100 > rand10两个Check约束限制；而列rand100被约束NULL限制。由于返回值为NULL代表符合约束条件，所以相当于列rand100没有被约束
```sql
CREATE TABLE IF NOT EXISTS check_table(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rand10 INTEGER CHECK ( rand10 > 0 ) CHECK ( rand100 > rand10 ) DEFAULT (random()%10),
    rand100 INTEGER CHECK ( NULL ) DEFAULT (random()%100)
);
```
多次插入默认行后，出现了多个报错，它们分为两种，如下所示
```sql
[SQLITE_CONSTRAINT_CHECK]  A CHECK constraint failed (CHECK constraint failed: rand10 > 0)
[SQLITE_CONSTRAINT_CHECK]  A CHECK constraint failed (CHECK constraint failed: rand10 > 0)
```
### NOT NULL约束
NOT NULL约束限制了一列的值不能是NULL。和Check约束一样，NOT NULL约束在插入和更新数据时检测，因此如果出现数据库损坏等问题，查出的数据也有可能是NULL。

### conflict-clause语句
PRIMARY KEY, NOT NULL, UNIQUE等语句给数据提出了要求，conflict-clause用于指定数据和要求冲突时的处理方式。可配置的处理方式有ABORT（默认）、ROLLBACK、FAIL、IGNORE和REPLACE。当遇到适用的冲突时，它们有不同的处理方式，如下。
#### ABORT
1. 中止当前SQL语句；
2. 返回SQLITE_CONSTRAINT异常；
3. 回退当前SQL语句所做的任何更改，但是由同一事务中先前SQL语句引起的更改被保留，并且该事务保持活动。
#### ROLLBACK
1. 中止当前SQL语句；
2. 返回SQLITE_CONSTRAINT异常；
3. 除了在每个命令上创建的隐含事务外，如果没有事务处于活动状态，则与ABORT算法相同。
#### FAIL
1. 中止当前SQL语句；
2. 返回SQLITE_CONSTRAINT异常；
3. 不会回退先前对失败的SQL语句所做的更改，也不会结束事务。
FAIL行为仅适用于唯一性、NOT NULL和CHECK约束。违反外键约束会导致ABORT。
#### IGNORE
1. 跳过包含该约束冲突的一行，并继续处理SQL语句的后续行，就像没有出错一样；
2. IGNORE不返回唯一性、NOT NULL和UNIQUE约束错误。但是处理外键约束的方法与ABORT类似。
#### REPLACE
1. 在插入或更新当前行之前删除导致约束冲突的预先存在的行，并且命令继续正常执行；
2. 如果发生NOT NULL约束冲突，如果该列有默认值，则将NULL值替换为该列的默认值，否则则使用ABORT算法。
3. 如果发生CHECK约束或外键约束冲突，则使用类似ABORT的方法
### ROWID
ROWID是默认存在的一列，类型时有符号64位整型。从3.8.2 (2013-12-06)版本开始，SQLite支持了没有ROWID的表
- 以上内容整理自：https://blog.csdn.net/AuspiciousChan/article/details/125075753

## 删除表
SQLite 的 DROP TABLE 语句用来删除表定义及其所有相关数据、索引、触发器、约束和该表的权限规范。

DROP TABLE 语句的基本语法如下。您可以选择指定带有表名的数据库名称，如下所示：
```sql
DROP TABLE database_name.table_name;
```
## Insert 语句
SQLite 的 INSERT INTO 语句用于向数据库的某个表中添加新的数据行。

INSERT INTO 语句有两种基本语法，如下所示：
```sql
INSERT INTO TABLE_NAME [(column1, column2, column3,...columnN)]  
VALUES (value1, value2, value3,...valueN);
```
使用一个表来填充另一个表
您可以通过在一个有一组字段的表上使用 select 语句，填充数据到另一个表中。下面是语法：
```sql
INSERT INTO first_table_name [(column1, column2, ... columnN)] 
   SELECT column1, column2, ...columnN 
   FROM second_table_name
   [WHERE condition];
```
## Select 语句
SQLite 的 SELECT 语句用于从 SQLite 数据库表中获取数据，以结果表的形式返回数据。这些结果表也被称为结果集。

SQLite 的 SELECT 语句的基本语法如下：
```sql
SELECT column1, column2, columnN FROM table_name;
```
在这里，column1, column2...是表的字段，他们的值即是您要获取的。如果您想获取所有可用的字段，那么可以使用下面的语法：
```sql
SELECT * FROM table_name;
```
设置输出列的宽度
有时，由于要显示的列的默认宽度导致 .mode column，这种情况下，输出被截断。此时，您可以使用 .width num, num.... 命令设置显示列的宽度，如下所示：
```sql
sqlite>.width 10, 20, 10
sqlite>SELECT * FROM COMPANY;
```
### WHERE 子句
```sql
SELECT column1, column2, columnN 
FROM table_name
WHERE [condition1] AND [condition2]...AND [conditionN];

SELECT column1, column2, columnN 
FROM table_name
WHERE [condition1] OR [condition2]...OR [conditionN]
```
## Update 语句
SQLite 的 UPDATE 查询用于修改表中已有的记录。可以使用带有 WHERE 子句的 UPDATE 查询来更新选定行，否则所有的行都会被更新。

带有 WHERE 子句的 UPDATE 查询的基本语法如下：
```sql
UPDATE table_name
SET column1 = value1, column2 = value2...., columnN = valueN
WHERE [condition];
```
## Delete 语句
SQLite 的 DELETE 查询用于删除表中已有的记录。可以使用带有 WHERE 子句的 DELETE 查询来删除选定行，否则所有的记录都会被删除。

带有 WHERE 子句的 DELETE 查询的基本语法如下：
```sql
DELETE FROM table_name
WHERE [condition];
```
## Limit 子句
SQLite 的 LIMIT 子句用于限制由 SELECT 语句返回的数据数量。

带有 LIMIT 子句的 SELECT 语句的基本语法如下：
```sql
SELECT column1, column2, columnN 
FROM table_name
LIMIT [no of rows]
```
## Order By
SQLite 的 ORDER BY 子句是用来基于一个或多个列按升序或降序顺序排列数据。

ORDER BY 子句的基本语法如下：
```sql
SELECT column-list 
FROM table_name 
[WHERE condition] 
[ORDER BY column1, column2, .. columnN] [ASC | DESC];
```
## Group By
SQLite 的 GROUP BY 子句用于与 SELECT 语句一起使用，来对相同的数据进行分组。

在 SELECT 语句中，GROUP BY 子句放在 WHERE 子句之后，放在 ORDER BY 子句之前。

下面给出了 GROUP BY 子句的基本语法。GROUP BY 子句必须放在 WHERE 子句中的条件之后，必须放在 ORDER BY 子句之前。
```sql
SELECT column-list
FROM table_name
WHERE [ conditions ]
GROUP BY column1, column2....columnN
ORDER BY column1, column2....columnN
```
## Having 子句
HAVING 子句允许指定条件来过滤将出现在最终结果中的分组结果。

WHERE 子句在所选列上设置条件，而 HAVING 子句则在由 GROUP BY 子句创建的分组上设置条件。

下面是 HAVING 子句在 SELECT 查询中的位置：
```sql
SELECT
FROM
WHERE
GROUP BY
HAVING
ORDER BY
```
在一个查询中，HAVING 子句必须放在 GROUP BY 子句之后，必须放在 ORDER BY 子句之前。下面是包含 HAVING 子句的 SELECT 语句的语法：
```sql
SELECT column1, column2
FROM table1, table2
WHERE [ conditions ]
GROUP BY column1, column2
HAVING [ conditions ]
ORDER BY column1, column2
```
## Distinct 关键字
SQLite 的 DISTINCT 关键字与 SELECT 语句一起使用，来消除所有重复的记录，并只获取唯一一次记录。

有可能出现一种情况，在一个表中有多个重复的记录。当提取这样的记录时，DISTINCT 关键字就显得特别有意义，它只获取唯一一次记录，而不是获取重复记录。

用于消除重复记录的 DISTINCT 关键字的基本语法如下：
```sql
SELECT DISTINCT column1, column2,.....columnN 
FROM table_name
WHERE [condition]
```
- 以上内容参考：https://www.cnblogs.com/Toney-01-22/p/9911672.html