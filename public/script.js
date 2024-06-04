updateLeaderboard(); // 頁面載入時更新排行榜
var light = document.getElementById("light");
var count = 0;
var sound = "sound/1.mp3";
var car = [
    "imgs/0.png",
    "imgs/1.png",
    "imgs/2.png",
    "imgs/3.png",
    "imgs/4.png",
    "imgs/5.png",
];
var addlight = function () {
    document.onclick = function() {
        console.log("Mouse clicked during addlight");
    };
    document.onkeydown = function() {
        console.log("Key pressed during addlight");
    };
    var start = document.getElementById("start");
    var title = document.getElementById("title");
    start.style.display = "none";
    title.style.display = "block";
    var a = new Audio(sound);
    a.load()
    a.play()
    count = (count + 1) % car.length;
    light.src = car[count];
    if(count!==5) setTimeout(addlight,1000);
    else{
        //隨機時間1.000~5.000秒restart，並顯示時間到螢幕上
        setTimeout(restart,Math.floor(Math.random()*3000)+2000);
    }
}

function restart(){
    //新增time計時器到畫面上並開始計時直到按下滑鼠
    var startt = document.getElementById("start");
    var time = document.getElementById("time");
    var title = document.getElementById("title");
    title.style.display = "none";
    time.style.display = "block";
    count = 0;
    light.src = car[count];
    var start = new Date().getTime();
    var end = new Date().getTime();
    var diff = 0;
    var click = false;
    var timer = setInterval(function(){
        if(click){
            clearInterval(timer);
        }else{
            end = new Date().getTime();
            diff = (end-start)/1000;
            time.innerHTML = diff.toFixed(3);
        }
    }, 100);
    var stopTimer = function(){
        if(click) return;
        click = true;
        clearInterval(timer); // 立即清除計時器
        end = new Date().getTime();
        diff = (end-start)/1000;
        time.innerHTML = diff.toFixed(3);
        document.onclick = null;
        document.onkeydown = null;
        swal({
            title: "Your reaction time is " + diff.toFixed(3) + " seconds.",
            text: "Enter your name to save your score:",
            content: "input",
            button: {
                text: "Submit",
                closeModal: true,
            },
            className: "custom-swal",
        })
        .then(name => {
            setTimeout(function() {
                startt.style.display = "block";
                time.style.display = "none";
                document.onclick = addlight;
                document.onkeydown = addlight;
            },200);

            //將時間與使用者名稱傳送到後端
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/api/insert", true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    console.log(xhr.responseText);
                    updateLeaderboard();
                }
            };
            var data = JSON.stringify({ "name": name, "time": diff.toFixed(3) });
            xhr.send(data);
        });
    }
    time.onclick = stopTimer;
    document.onclick = stopTimer;
    document.onkeydown = stopTimer;
}
function updateLeaderboard() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/quotes", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            var leaderboardList = document.getElementById("leaderboard-list").getElementsByTagName('tbody')[0];
            leaderboardList.innerHTML = ''; // 清空排行榜
            data.data.sort((a, b) => a.time - b.time) // 按時間從小到大排序
                .forEach((item, index) => {
                    var row = leaderboardList.insertRow();
                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2);
                    cell1.textContent = index + 1; // 名次
                    cell2.textContent = item.name; // 名字
                    cell3.textContent = item.time; // 時間
                });
        }
    };
    xhr.send();
}
document.getElementById('toggle-leaderboard').onclick = function(event){
    var leaderboard = document.getElementById('leaderboard');
    if (leaderboard.style.display === 'none') {
        leaderboard.style.display = 'block';
    } else {
        leaderboard.style.display = 'none';
    }
    event.stopPropagation();// 阻止事件冒泡
};
document.getElementById('menu').onclick = function(event){
    var leaderboard = document.getElementById('leaderboard');
    if (leaderboard.style.display === 'none') {
        leaderboard.style.display = 'block';
    } else {
        leaderboard.style.display = 'none';
    }
    event.stopPropagation();// 阻止事件冒泡
};
document.onclick = addlight;
document.onkeydown = addlight;