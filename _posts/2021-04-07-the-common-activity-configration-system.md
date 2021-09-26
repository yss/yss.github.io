---
layout: blog
title: 通用的活动配置系统
tags: [project]
categories: [project]
summary: 活动里经常需要用到很多的配置，之前每次都需要搞一个，费时费力，用一次就大概率不再用了

---

### 背景
我们的一些活动会有一些内容需要配置，需要有一个配置后台来让产品、运营来使用，因此开发了一些配置后台，包括：定金活动配置后台和特训班预约配置后台。这些活动的共同点是都是根据年级、科目等筛选条件不同展示不同的内容。目前的实现与活动的逻辑耦合紧密，活动的逻辑如果修改配置后台页需要修改，新的活动需要开发新的配置后台。因此我们希望提炼其中的通用逻辑，设计一个通用的活动配置系统，对于未来类似的活动无需修改代码，用配置的方式生成活动内容配置表单。

#### 参考定金配置：
https://xxx/tutor-web-renewal-deposit-config/#/

定金链接实际是按年级分组，先按年级获取一套配置，再按科目、难度、产品线获取文案

#### 问题：

1. 通过活动ID不够灵活，需要预先分组，无法应对临时需要对某一年级科目做特殊配置的场景；
2. 某些筛选条件下的特例，目前在定金配置中通过表单联动的方式生成了很多的字段，配置后台和C端代码耦合度高；

### 目标

1. 通过配置的方式生成适用于某个活动的配置表单模版，可配置项包含筛选项和内容配置。
2. 引入一种优先级机制，根据筛选项的精确程度，精确度高的内容配置覆盖精确度低的。

### 方案
#### 系统架构

![通用配置系统架构](/static/img/configuration-structure.png)

#### 1. 活动模版管理
本质是通过一个表单去配置出另外一个表单。首先选择活动需要关注那些筛选项，初期先提供年级、科目、难度。然后编辑需要配置的字段，类似于eagle通用配置里的编辑器配置。

前端主要包括活动模版列表页、详情页，以及活动模版编辑表单，提供对活动模版进行增删改查的能力。

单条活动模版配置的数据结构如下：

包含两个部分：

1. filters：gradeId、subjectId、levelId与名称的的映射会维护在代码里。活动模版配置对每种筛选项保存一个boolean值，表示是否在内容配置表单中展示这一类筛选项的一系列checkbox。
2. content：类似于tutor-web-config-page中，根据所选的控件类型，后续在内容配置表单中展示对应的表单控件。

```js
{
    id: 0,
    name: '',
    filters: { // 活动配置中是否使用哪些筛选项
        grades: number[] // gradeId数组，表示后续内容配置表单中的可选项
        subjects: number[]
        levels: number[]
    }
    fields: [ // 参考tutor-web-config-page
        {
            type: "text" | "image" | "video" | "number" | "datetime" | "textarea" | "compose"
            label: string
            name: string
            required: boolean
            placeholder: string
        }
    ]
}
```

#### 2.内容配置管理
管理某一templateId下的所有内容配置条目，即管理某一个活动下的所有配置，这个层面上对应现有的定金配置后台，提供增删改查内容配置条目的能力

前端主要包括内容配置列表页、详情页，以及内容配置表单。

每一条内容配置条目的数据结构如下：

筛选项是多选，因此使用数组存储。特殊逻辑是如果没有勾选任何一项，按照全选处理

```js
{ 
    id: 0,
    name: '',
    templateId: 0,
    filters: {
         gradeIds: [1],
         subjectIds: [3],
         levelIds: [1,2,3,4,5,6], // 全选
    },
    fields: {/*...*/}
}
```

#### 3. 存储
数据库名暂定 generator

##### 1.活动模版

templates

id	BIGINT	
name	VARCHAR(255)	活动模版名称
ldap	VARCHAR(255)	创建者Idap
content	TEXT	活动模版配置数据的JSON字符串
url	VARCHAR(255)	
status	

##### 2. 活动内容配置

generations

id	BIGINT	
name	VARCHAR(255)	活动内容配置名称
templateId	BIGINT	活动模版ID
ldap	VARCHAR(255)	创建者Idap
content	TEXT	活动内容配置数据的JSON字符串
status	

#### 4. Node服务

tutor-we-basis提供一套API来管理活动模版和活动内容配置的增删改查。

活动模版

GET /generators/templates/{id}
POST /generators/templates/
PUT /generators/templates/{id}
DELETE /generators/templates/{id}
活动内容配置

GET /generators/generations/{id}
POST /generators/generations/
PUT /generators/generations/{id}
DELETE /generators/generations/{id}
TODO：详细接口文档

##### 数据查询方式
GET /generators/templates/{id}/generations

提供三种方式供C端代码查询配置：

1. 查询未进行merge操作的原始记录列表
2. 查询merge后的单条记录的接口
3. 按多个筛选项的值查找：如?gradeIds=1,2,3

##### 默认值合并计算

问题：比如用户添加了一个配置条目，其中的一些内容配置字段留作空值，希望默认取另一个配置条目里的值，例外一些字段取自己的特殊配置。如何去取这个默认值？

方案：

查询符合条件的配置条目得到一个列表。一般我们创建的时候先创建更通用的默认配置，后创建特殊配置，所以可以按创建时间的先后顺序排序（相当于按id大小排序），对列表中的配置条目的content对象进行merge操作，后创建的配置条目优先级更高，将会覆盖更早创建的配置条目的对应字段。普通对象会递归合并，数组和其他对象和值会被直接覆盖。

例如：

按?gradeId=1的参数查询

```js
[
    { // 默认配置
        id: 0,
        gradeIds: [1,2,3,4,5,6],
        content: {
            a: "1",
            b: "2",
            c: {
                d: "2",
                e: "3"
            },
        }
    },
    {
        id: 1,
        gradeIds: [1],
        content: {
            a: "",
            b: "7"
            c: {
                d: "8",
                e: ""
            },
        }
    }
]
```

合并得到结果

```js
{
    id: 1,
    gradeIds: [1], // 筛选项取最新一条数据的筛选项
    content: {
        a: "1",
        b: "7",
        c: {
            d: "8",
            e: "3"
        },
    }
}
```
