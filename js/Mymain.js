$(document).ready(function () {
    var document = window.document

    // 获取“开始”按钮
    var startBtn = document.getElementById("start-Btn")

    var overall_memory_blocks = 4 //内存块数
    var overall_instructions = 320 //总指令数
    var instruction_per_page = 10 //每页存放指令数
    var overall_pages = 32  //总页数

    // 需要改变的标签元素
    var FIFO_missPageSpan = document.getElementById("FIFO_miss_page_count") //FIFO缺页数量
    var FIFO_missPageRateSpan = document.getElementById("FIFO_miss_page_rate") //FIFO缺页率
    var LRU_missPageSpan = document.getElementById("LRU_miss_page_count") //LRU缺页数量
    var LRU_missPageRateSpan = document.getElementById("LRU_miss_page_rate") //LRU缺页率

    var memory = [] // 内存
    var insCount = 0 // 记录执行的指令个数
    var algorithmTag = 0 //FIFO为0，LRU为1
    var missingPage_FIFO = 0 // FIFO缺页个数
    var missingPage_LRU = 0 // LRU缺页个数
    var Record = new Array(overall_pages) //LRU_记录最近一次调入内存的时间（以第几条ins计算）

    //页表数据结构
    var page = {
        PageNumber: -1,  //页号，0~31
        InMemory: 0, //不在内存中为-1，在内存中为内存块号
        Access: -1,  //访问信息
    }
    var PageTable = [] //页表


    //初始化随机指令
    function init() {
        console.log("初始化随机指令")
        memory = new Array(overall_memory_blocks) //内存块
        PageTable = new Array(overall_pages) //页表

        insCount = 0 // 记录执行的指令个数
        /*missingPage_FIFO = 0 // 缺页个数
        missingPage_LRU = 0 // 缺页个数*/

        /*运行信息显示*/
        FIFO_missPageSpan.textContent = missingPage_FIFO
        FIFO_missPageRateSpan.textContent = missingPage_FIFO / overall_instructions
        LRU_missPageSpan.textContent = missingPage_LRU
        LRU_missPageRateSpan.textContent = missingPage_LRU / overall_instructions
    }


    //判断指令是否已经在内存中，若不在返回其所在的页号，否则返回-1
    function IsInside(ins) {
        for (let i = 0; i < memory.length; ++i) {
            var j = Math.floor(ins / instruction_per_page)//该指令所在页号
            if (j === memory[i]) {
                console.log("在第" + memory[i] + "页")
                return -1 //找到
            }
        }
        return j //返回页号
    }



    function NotFull() {
        for(let i = 0; i < memory.length; ++i){
            if(memory[i] === undefined){
                return i; //返回第一个空内存块
            }
        }
        return -1; //全部已满
    }


    function FIFO(){
        console.log("执行FIFO算法")
        missingPage_FIFO = 0 // 缺页个数
        algorithmTag = 0 //选择FIFO算法
        var pointer = 0 //指向内存中最先进入内存的页面
        var dir = 11 //指令执行方向
        var ins = -1  //当前指令
        var flag = 0 //发生缺页置1
        var notfull = -1 
        /*指令执行方向分三类：
          11 :执行下一条指令，且上一步是向下跳转，循环起始点
          -1:跳转到0——m-1中随机一条
          22 :执行下一条指令，且上一步是向上跳转
          1 :跳转到m+2——319中随机一条*/

        //随机数确定第一条执行的指令
        ins = Math.round( Math.random() * (overall_instructions  - 1) )


          while( insCount < overall_instructions ){
              var currentIns = ins  //记录本次循环执行的指令
              flag = 0 
              notfull = -1

            //确定跳转方向和下一条指令
            if(dir === 11){
                //顺序执行指令
                 ins++  //顺序执行下一条指令
                 //更新方向
                 dir = -1
                }
            else if(dir === -1){
                //向前跳转
                if (ins < 2) {
                    situation = 1
                    continue
                }
                ins = Math.floor(Math.random() * (ins - 1))
                //切换至顺序执行
                dir = 22
            }
            else if(dir === 22){
                //顺序执行指令，且上一步是向上跳转
                ins++
                dir=1
            }
            else if(dir === 1){
                if (ins > overall_instructions - 2) {
                    situation = -1
                    continue
                }
                ins = Math.floor(
                    Math.random() * (overall_instructions - (ins + 2)) + (ins + 2)
                )
                //切换至顺序执行
                dir = 11
            }
            //越界处理
            if (ins < 0) {
                ins = -1
                dir = 1
                continue
            } else if (ins >= overall_instructions) {
                ins = overall_instructions + 1
                dir = -1
                continue
            }

            if(IsInside(currentIns) !== -1){
                //当前指令不在内存中，发生缺页
                flag = 1
                if(NotFull() !== -1){
                    //还有空的内存块
                    notfull = NotFull()
                    memory[NotFull()] = Math.floor(currentIns / instruction_per_page)
                }
                else{
                    //内存块已经占满
                    memory[pointer] = Math.floor(currentIns / instruction_per_page)
                    pointer = ( ++pointer ) % 4
                    FIFO_missPageSpan.textContent = missingPage_FIFO
                    FIFO_missPageRateSpan.textContent = missingPage_FIFO / overall_instructions
                }
                missingPage_FIFO++ 
            }
            insCount++
            
            //界面显示调整
            console.log("当前执行第" + currentIns + "条指令")
            var row = document.getElementById("memory_table").insertRow()
            row.insertCell(0).innerHTML ="🎉" + insCount
            row.insertCell(1).innerHTML ="💡 NO. " + currentIns
            row.insertCell(2).innerHTML = 
                memory[0] == undefined ? "Empty" : memory[0]
            row.insertCell(3).innerHTML =
                memory[1] == undefined ? "Empty" : memory[1]
            row.insertCell(4).innerHTML =
                memory[2] == undefined ? "Empty" : memory[2]
            row.insertCell(5).innerHTML =
                memory[3] == undefined ? "Empty" : memory[3]
            if(flag === 1){
                if(notfull !== -1){
                    row.insertCell(6).innerHTML = "⚠缺页 " + " 🔗调入第" + ((notfull)+1) + "个内存块"
                }else{
                    row.insertCell(6).innerHTML = "⚠缺页 " + " 🔗调入第" + ((pointer-1 >= 0 ? pointer -1 :3)+1) + "个内存块"
                }
                
            }else{
                row.insertCell(6).innerHTML = "✔ 指令"+ currentIns + "已在内存中" 
            }
          }
    }

    

    function Pos(){
        var T0 = Record[memory[0]]
        var T1 = Record[memory[1]]
        var T2 = Record[memory[2]]
        var T3 = Record[memory[3]]
        var min = Math.min(T0,T1,T2,T3)
        for(let r = 0; r < overall_memory_blocks; r++){
            if(Record[memory[r]] === min){
                return r  //返回最近最少访问的内存块号(0~3)
            }
        }
    }

    
    function LRU(){
    console.log("执行LRU算法")
    missingPage_LRU = 0 // 缺页个数
    algorithmTag = 1 //选择LRU算法
    var dir = 11 //指令执行方向
    var ins = -1  //当前指令
    var flag = 0 //发生缺页置1
    var pos 
    /*指令执行方向分三类：
      11 :执行下一条指令，且上一步是向下跳转，循环起始点
      -1:跳转到0——m-1中随机一条
      22 :执行下一条指令，且上一步是向上跳转
      1 :跳转到m+2——319中随机一条*/

    //随机数确定第一条执行的指令
    ins = Math.round( Math.random() * (overall_instructions  - 1) )


      while( insCount < overall_instructions ){
          var currentIns = ins  //记录本次循环执行的指令
          flag = 0
          pos = -1

        //确定跳转方向和下一条指令
        if(dir === 11){
            //顺序执行指令
             ins++  //顺序执行下一条指令
             //更新方向
             dir = -1
            }
        else if(dir === -1){
            //向前跳转
            if (ins < 2) {
                situation = 1
                continue
            }
            ins = Math.floor(Math.random() * (ins - 1))
            //切换至顺序执行
            dir = 22
        }
        else if(dir === 22){
            //顺序执行指令，且上一步是向上跳转
            ins++
            dir=1
        }
        else if(dir === 1){
            if (ins > overall_instructions - 2) {
                situation = -1
                continue
            }
            ins = Math.floor(
                Math.random() * (overall_instructions - (ins + 2)) + (ins + 2)
            )
            //切换至顺序执行
            dir = 11
        }
        //越界处理
        if (ins < 0) {
            ins = -1
            dir = 1
            continue
        } else if (ins >= overall_instructions) {
            ins = overall_instructions + 1
            dir = -1
            continue
        }

        if(IsInside(currentIns) !== -1){
            //当前指令不在内存中，发生缺页
            flag = 1
            if(NotFull() !== -1){
                //还有空的内存块
                pos = NotFull()
                memory[NotFull()] = Math.floor(currentIns / instruction_per_page)
            }
            else{
                //内存块已经占满
                pos = Pos()
                memory[pos] = Math.floor(currentIns / instruction_per_page)
                LRU_missPageSpan.textContent = missingPage_LRU
                LRU_missPageRateSpan.textContent = missingPage_LRU / overall_instructions
            }
            missingPage_LRU++ 
        }
        insCount++
        Record[Math.floor(currentIns / instruction_per_page)] = insCount
        
        //界面显示调整
        console.log("当前执行第" + currentIns + "条指令")
        var row = document.getElementById("memory_table").insertRow()
        row.insertCell(0).innerHTML ="🎈" + insCount
        row.insertCell(1).innerHTML ="💡NO. " + currentIns
        row.insertCell(2).innerHTML = 
            memory[0] == undefined ? "Empty" : memory[0]
        row.insertCell(3).innerHTML =
            memory[1] == undefined ? "Empty" : memory[1]
        row.insertCell(4).innerHTML =
            memory[2] == undefined ? "Empty" : memory[2]
        row.insertCell(5).innerHTML =
            memory[3] == undefined ? "Empty" : memory[3]
        if(flag === 1){
            row.insertCell(6).innerHTML = "⚠缺页 " + "🔗调入第" + (pos+1) + "个内存块"
        }else{
            row.insertCell(6).innerHTML = "✔ 指令"+ currentIns + "已在内存中" 
        }
      }
}


    function chooseAlgrithm() {
        var ratio = document.querySelector("input:checked")
        console.log("选择算法")
        if (ratio.value === "FIFO") {
            FIFO()
        } else if (ratio.value === "LRU") {
            LRU()
        }
    }

    //点击按钮模拟过程函数
    function start() {
        // 禁用“开始”按钮
        startBtn.disabled = true
        console.log("成功点击按钮")
        //初始化
        init()

        $("#memory_table  tr:not(:first)").hide()
        // 选择算法并
        chooseAlgrithm()
        startBtn.disabled = false //重新启用开始按钮
    }

    //监听点击按钮事件
    $("#start-Btn").click(start)
})
