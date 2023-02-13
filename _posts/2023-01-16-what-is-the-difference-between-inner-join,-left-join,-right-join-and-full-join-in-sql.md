---
layout: blog
title: SQL 中 inner join, left join, right join, full join 的差异
tags: [sql]
categories: [sql]
summary: 理解 SQL 中 inner join, left join, right join, full join

---

# 为什么要用 join

主要涉及到连表查询，join 方式可以很快速的把多张表合并起来。

合并的方式就分：inner join, left join, right join, full join。

# 各个含义
## inner join

```text
SELECT table1.column1, table2.column2...
  FROM table1
 INNER JOIN table2
    ON table1.common_field = table2.common_field;
```

OR 二次查询

```text
SELECT column1, column2
    FROM (
        SELECT column1, uid
        FROM table1
        WHERE x1=y1
    ) a
    INNER JOIN (
        SELECT column2, uid
        FROM table1
        WHERE x2=y2
    ) b
    ON a.uid = b.uid
```

这个含义就是取两组查询数据的相交部分，并最终返回。

比如：查询出来的数据是

```text

uid column1     uid column2
1   x1          1   y1
2   x2          3   y2
```
最终得到的结果是：
```text
uid column1 column2
1   x1      y1
```
## left join

完全返回左边的条件查出来的数据，如果同时满足右边的条件，那么就合并右边的数据。

同上面那个数据，可以得到这样的结果：

```text
uid column1 column2
1   x1      y1
2   x2      NULL
```

## right join

刚好跟 left join 想法，本质上是一个意思。

```text
uid column1 column2
1   x1      y1
3   NULL    y2
```

## FULL join

就是把能合并的合并，不能合并单独放一条，没有的数据就置空。

```text
uid column1 column2
1   x1      y1
2   x2      NULL
3   NULL    y2
```
