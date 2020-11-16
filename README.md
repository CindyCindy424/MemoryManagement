# MemoryManagement
### 操作系统课程  内存管理项目
#### 请求调页存储管理模拟
Tongji SSE OS_Assignment_02
1850477 邓欣凌 软件学院

> demo: https://cindycindy424.github.io/MemoryManagement/My_index.html

***

#### 项目目的

-  页面、页表、地址转换 
-  页面置换过程 
-  加深对请求调页系统的原理和实现过程的理解

#### 开发环境

- Windows  
- VS Code
- HTML、CSS、JavaScript

#### 项目需求

##### 基本任务

假设每个页面可存放10条指令，分配给一个作业的内存块为4。模拟一个作业的执行过程，该作业有320条指令，即它的地址空间为32页，目前所有页还没有调入内存。

##### 模拟要求

+ 模拟过程：

  - 在模拟过程中，如果所访问指令在内存中，则<u>显示其物理地址</u>，并转到下一条指令；

  - 如果没有在内存中，则发生缺页，此时需要<u>记录缺页次数，并将其调入内存</u>。
  - 如果4个内存块中已装入作业，则需进行<u>页面置换</u>。

+ 指令访问次序：

  - 50%的指令是顺序执行的，25%是均匀分布在前地址部分，25％是均匀分布在后地址部分
  - 具体实施方法：
    - 在0－319条指令之间，随机选取一个起始执行指令，如序号为`m`
    - 顺序执行下一条指令，即序号为`m+1`的指令

    - 通过随机数，跳转到前地址部分`0 ~ m-1`中的某个指令处，其序号为`m1`

    - 顺序执行下一条指令，即序号为`m1+1`的指令
    - 通过随机数，跳转到后地址部分`m1+2 ~ 319`中的某条指令处，其序号为`m2`
    - 顺序执行下一条指令，即`m2+1`处的指令。
    - 重复跳转到前地址部分、顺序执行、跳转到后地址部分、顺序执行的过程，直到执行完`320`条指令。

+ 所有`320`条指令执行完成后，计算并显示作业执行过程中发生的`缺页率`。

  - 注：最终执行的320条指令不要求全部不同，只要符合跳转规则即可

+ 置换算法：

  - FIFO算法
  - LRU算法

***

#### 算法性能比较

##### Ⅰ. FIFO算法

- 优点：实现较为简单
- 缺点：性能较差，容易产生抖动现象

##### Ⅱ. LRU算法

- 优点：利用了`程序局部性原理`，性能较好，最接近“最佳算法OPT”
- 缺点：需要额外空间记录每个页面进入内存的最后时间

***

#### 逻辑层设计

##### 实现逻辑流程图

<img src="https://github.com/CindyCindy424/MemoryManagement/blob/master/img/image-20200617233438702.png" width="40%" height="40%" alt="image-20200617233438702" style="zoom: 40%;" />




##### 数据结构设计

<img src="https://github.com/CindyCindy424/MemoryManagement/blob/master/img/image-20200617234726511.png" width="40%" height="40%" alt="image-20200617234726511" style="zoom:40%;" />

##### 内存管理模拟

- 用memory[]数组模拟系统分配给该程序的4个内存块
- 用随机数确定第一条起始指令
- 用数字编号简单模拟指令内容
- 本项目不涉及指令页面调入内存后的修改或访问操作

##### 调入调出策略

- 为了更突出对置换算法性能的比较，本项目采取了较为简单的调入调出策略
- 调入策略：“请求调页”，即只调入发生缺页时所需的页面
- 调出策略：“请求调出”，即只调出被置换的页面

##### 算法实现

###### Ⅰ. FIFO算法

- 算法含义：先进先出置换算法(FIFO)，每次选择淘汰的页面是最早进入内存的页面
- 算法实现：将用一个指针`pointer`记录当前内存块中最早进入内存的页面

###### Ⅱ. LRU算法

- 算法含义：最近最久未使用算法(LRU,Least Recently Used)，每次淘汰最近最久未使用的页面
- 算法实现：页表中设置`Access`项，记录该页面上次被访问的时间，发生页面置换时找到访问时间最早的页面进行替换

##### 主要函数列表

|      | 函数名             | 功能                                                         |
| ---- | ------------------ | ------------------------------------------------------------ |
| 1    | init( )            | 初始化                                                       |
| 2    | IsInside( )        | 判断指令是否已经在内存中，若不在返回其所在的页号，否则返回-1 |
| 3    | FIFO( )            | 实现FIFO算法                                                 |
| 4    | LRU( )             | 实现LRU算法                                                  |
| 5    | Pos( )             | LRU算法中，比较当前                                          |
| 6    | chooseAlgorithm( ) | 根据用户在页面点击的元素选择置换算法                         |
| 7    | start( )           | 鼠标点击后 开始执行算法                                      |

***

#### UI界面设计

##### 总界面

![image-20200617230712878](https://github.com/CindyCindy424/MemoryManagement/blob/master/img/image-20200617230712878.png)



##### 选择算法

<img src="https://github.com/CindyCindy424/MemoryManagement/blob/master/img/image-20200617230736603.png" width="33%" height="33%" alt="image-20200617230736603" style="zoom: 33%;" />



##### 模拟结果

<img src="https://github.com/CindyCindy424/MemoryManagement/blob/master/img/image-20200617230908633.png" width="33%" height="33%" alt="image-20200617230908633" style="zoom:33%;" />

##### 细节信息展示

- 将运行信息展示在表格中，用Frame01~04四个列表示每次指令执行时，该内存块是否有页面调入、具体是第几个页面，最后一栏显示执行该条指令时是否发生缺页。如果发生缺页，则展示该页面被置换进入第几个内存块。

![image-20200617230943445](https://github.com/CindyCindy424/MemoryManagement/blob/master/img/image-20200617230943445.png)

***

#### 总结

- 项目进行过程中，加深了我对于置换算法的理解和认识。例如在进行LRU算法实现时，最初我打算开辟一个长度为4（总内存块数目）的数组记录每个内存块的最近访问时间，后面突然意识到LRU算法应当记录的是每个页面被访问的时间，而非每个内存块被访问的时间。
- 尝试用 html+css+JavaScript 实现项目需求，是我的第一次尝试，感觉非常有成就感。但是页面设计方面还有很多的不足，需要继续加油
