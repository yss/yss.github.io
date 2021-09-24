---
layout: blog
title: Node.js Server 接入 Prometheus
tags: [node.js]
categories: [node.js]
summary: 一直以来 Node.js Server 服务相关的监控严重缺失

---

### 背景
目前 Node.js Server 服务相关的监控严重缺失，特别是在 Service 部署的机器。

早期，Service 部署的机器主要是通过接入 open-falcon ，但现在 open-falcon 将会下线。

然后，公司监控层面主体也已经迁移到了 Prometheuse，所以我们需要尽快迁移到 Prometheus。

### 目标
1. 通过这篇文章能对 Prometheus 以及服务层面的监控有一个整体的理解。
2. 明确监控需要收集的一些指标数据。为打造一个通用的 Prometheus Client 库做准备。
### Prometheus 的理解
一般我们认为 Prometheus 是一个监控报警的工具。

但其实它更多指的是一个监控体系。

下面这个是官方文档里给的 Prometheus 架构图：

![prometheus architecture](/static/img/prometheus_architecture.png)

怎么理解呢？

#### 关于Prometheus Server
这个是最核心的。但是在架构图上并没有把数据收集部分完整的表述出来。

而这部分可能是我们最关心的一点。这里画一个简单的图描述一下。

![prometheus server](/static/img/prometheus-cs.png)

具体就是：

1. 我们再每台机器上运行 Prometheus Client 都会启动一个 HTTP Server。
2. 然后，Prometheus Server 会从每台机器上去请求这个 HTTP Server 来获取数据。
3. 最后，再把数据存储在 TSDB里。


之后，其他所有的处理，其实都是围绕着 Prometheus Server 来做的事情。

比如：Service Discovery（服务发现），就是要找到某个服务对应的所有机器地址。我们这边是直接使用的 service 机器对应数据。

#### Prometheus Server 请求频率
目前问到的就是 Prometheus Server 是每隔 15s 拉一次数据。

### 关于 Metric Types
Metric 中文翻译就是指标。

Prometheus 包含的 Metrics 主要有：Counter、Gauge、Histogram、Summary。

#### Counter
一个累加计数的指标。它的值只能一直增加 或者 在重启的时候重置为 0。通常用于统计总的请求数、总共完成的任务之类的。

#### Gauge
一个简单的计数指标。一般用来记录当前的一个值，比如：当前的内存使用率、当前的并发请求数。

#### Histogram
一个区间的样本观测值的指标。主要是用来汇总给定的一个大区间内，各个子区间的数值，然后生成一个柱状图指标的能力。

比如，统计1分钟内的各个请求时长分布，我给的一个[1, 3, 5, 8] buckets，然后计算的时候，如果某一个请求时长是 2s，那么那就归属于 1-3 的区间。以此类推就可以得出类似这样的柱状图数据：

![prometheus histogram](/static/img/prometheus-histogram.png)

#### Summary
一个汇总的样本观测值的指标。一般会用来记录一组数据，然后取出各个比例的数量占比。

比如，统计1分钟内的请求时长数据。我们要看的是 50%，90%，99%的指标，其中 50% 的这个值指的就是 取第 50% 这个位置的数值，使得这一分钟内有 50% 的请求时长小于等于这个值。

具体文档在这里：https://prometheus.io/docs/concepts/metric_types/#metric-types

还有一个更细致的翻译文档：https://fuckcloudnative.io/prometheus/2-concepts/metric_types.html

### 方案
上面说了这么多主要是让我们能对 Prometheus 有一些直观上的理解。

针对我们现在的情况，更多的是要封装一个针对 Node.js Server 的 Prometheus Client。

目前从官方看到的就是已经有一个 Node.js 实现库：https://github.com/siimon/prom-client 。

我们应该基于这个库之上去做封装。

### 需要做的事情
封装的意义在于尽可能的降低使用者的使用成本。然后，我们具体需要做的就是：

1. 定义好哪些是需要默认收集的信息。
2. 我们应该如何去做自定义的一些数据收集。

### 关于 Cluster 模式
prom-client 库的文档使用的第一条就重点提到了 Cluster 模式下的使用，所以这个点是必须得说的。

我们知道 cluster 是 Node.js 为了更充分的利用系统 CPU 资源的一个库。它是通过一个 Master 进程 fork 多个 Worker 进程的方式来做到。

而 Prometheus 要收集的数据是整个机器的，如果在每个进程去启动，很多数据就不准确了。所以，prom-client 要求在 Cluster 下，使用 Master 进程做数据的聚合，然后在接收到 Prometheus 的数据请求后，会要求 Workers 通过进程通信方式把数据发送给 Master 进程。

![prometheus node](/static/img/prometheus-node.png)

目前从我们 Node.js 服务的启动看，都采用是 PM2 。然后有人可能会直接使用 PM2 的 Cluster 模式，但在 PM2 下它是不提供这种在 Master 执行的方式，所以需要自己写 Cluster 模式代码。

### 默认的 Metrics
prom-client 定义的默认 Metrics 有：

1. processCpuTotal ：包括：process_cpu_user_seconds_total、process_cpu_system_seconds_total、process_cpu_seconds_total
1. processStartTime：process_start_time_seconds
1. osMemoryHeap：process_resident_memory_bytes、process_virtual_memory_bytes、process_heap_bytes
1. processOpenFileDescriptors：process_open_fds
1. processMaxFileDescriptors：process_max_fds
1. eventLoopLag：包括：nodejs_eventloop_lag_min_seconds、nodejs_eventloop_lag_max_seconds、nodejs_eventloop_lag_p50_seconds等
1. processHandles：nodejs_active_handles、nodejs_active_handles_total
1. processRequests：nodejs_active_requests、nodejs_active_requests_total
1. heapSizeAndUsed：nodejs_heap_size_total_bytes、nodejs_heap_size_used_bytes、nodejs_external_memory_bytes
1. heapSpacesSizeAndUsed：nodejs_heap_space_size_total_bytes、nodejs_heap_space_size_used_bytes、nodejs_heap_space_size_available_bytes
1. version：nodejs_version_info
1. gc：nodejs_gc_duration_seconds

目前看都是有用的信息。

所以，应该作为默认的行为开启。

### 自定义的 Metrics

目前基础架构已经定义了一套统一的名字。相同的地方，我们也还是和他们保持一致。

但我们只能用其中 commons-rest ，这主要是用来统计服务整体 QPS 的。

然后 QPS 的计算目前确定的是直接用的：每个周期的整个请求数 / 周期间隔（15s）

这里直接贴一下 commons-rest 里的指标和说明：
