---
layout: blog
title: 搭建wiki系统（confluence）
tags: [wiki, confluence]
categories: [wiki]
summary: confluence是我见到过的最好用的企业内部wiki系统。
---
说到confluence有很多人会很陌生，但如果你之前接触过或使用过的话，你可能就再也不会考虑去用其他的wiki系统了。

闲话少说，我们切入正题。开始内部安装wiki的步骤啦～

### 说明

以下是我个人的安装经验。我安装的是Confluence版本是：5.4.4。

### 前提：

1. 你要会翻墙，不然就会卡在密钥那边了。
2. 你要有耐心以及持续google的动力。根据一个线索一直向下查找。

### 安装步骤：

1. 下载Confluence，官网地址是：https://www.atlassian.com/software/confluence/download. 但是，我建议是在国内找一个可供下载的地址（比如百度云盘），因为下载很慢。
2. 准备好两个东西：一个是mysql-datadriver（数据库驱动），比如：mysql-connector-java-5.1.26-bin.jar，二是破解文件：atlassian-extras-2.4.jar
额外的：中文语言包。中文语言包是要付费才能使用，但其实如果你知道语言包的地址的话，很容易就download下来啦。
这里我给出这个中文语言包地址：https://translations.atlassian.com/download/Confluence/5.4.4/zh_CN/Confluence-5.4.4-language-pack-zh_CN.jar
看到这里，其实任何一个版本的语言包都是可以正常下载的，不信你试试？
3. 创建confluence数据库和对应用户：     
    {% highlight sh %}
    # 创建confluence数据库，且需要保证内容也为utf8（默认是latin）
    create database confluence character set utf8 COLLATE utf8_bin;
    # 创建confluence用户，并赋予操作它confluence下的所有权限
    GRANT ALL PRIVILEGES ON confluence.* TO 'confluence'@'localhost' IDENTIFIED BY 'confluence';
    {% endhighlight%}
4. 安装confluence: chmod +x ./atlassian-confluence-5.4.4-x64.bin && ./atlassian-confluence-5.4.4-x64.bin    
    默认安装在：/opt/atlassian/confluence下。
5. 把mysql-connector-java-5.1.26-bin.jar和atlassian-extras-2.4.jar，Confluence-5.4.4-language-pack-zh_CN.jar（如果有的话）放到：/opt/atlassian/confluence/confluence/WEB-INF/lib/目录下
6. 更改confluence下的：conf/server.xml  
    {% highlight xml %}
    <!--<Context path="" docBase="../confluence" debug="0" reloadable="false" useHttpOnly="true">--> 
    # 把上面这句话注释掉，然后变成下面的这个样子：
    <Context path="" docBase="../confluence" debug="0" reloadable="true">
    # 然后在下面增加这句话：
    <Resource name="jdbc/confluence" auth="Container" type="javax.sql.DataSource"
                          username="confluence"
                          password="confluence"
                          driverClassName="com.mysql.jdbc.Driver"
                          url="jdbc:mysql://localhost:3306/confluence?autoReconnect=true"
                          maxActive="15"
                          maxIdle="7"
                          validationQuery="Select 1" />
    {% endhighlight %}
7. 确定8000和8090端口是否为占用（lsof -i:8000 或 lsof -i:8090）。
8. 如果被占用了，记得更改conf/server.xml对应配置    
    在confluence目录下执行：./bin/shutdown.sh 等一会后，执行：./bin/startup.sh
9. 打开：http://ipaddress:8090/
10. 然后你还需要申请一下atlassian的评估版密钥（需要完全翻墙）
11. ok，应该没有需要继续讲的了。

### 注意

如果之前安装过confluence，你需要先删除掉：

{% highlight sh %}
cd ${confluence_home}
./uninstall
cd -
rm -rf confluence # rm -rf /opt/atlassian
rm -rf /var/atlassian
# mysql 部分
mysql -h localhost -u root -p
> drop database confluence;
{% endhighlight %}
