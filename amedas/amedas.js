
// // loading imageを別positionをloadingするときに、doading imageを表示
// // commentを入れる

// XX 前の設定を覚える
// XX Dynamicにボタンを追加、選べるようにする(pointと名前の対比表)
//  https://www.jma.go.jp/jma/kishou/know/amedas/ame_master.zip
// awk -F, '{print "{location:\""$5 "\",id:\"" $2"\"},"}' < ameda-point.csv >/tmp/44
// XX 気象庁がweb pageでもデーター欠落しているか確認

// // cityを選べるようにする
// // hum, pressureもできるようにする (ない都市はその旨表示)

var point = "44116" // default point, Fuchu

const graphDays = 4;

const points =
      [
	  {
	      location: "Tokyo",
	      id: "44132"
	  },
	  {
	      location: "Fuchu",
	      id: "44116"
	  },
	  {
	      location: "Hachioji",
	      id: "44112"
	  },
	  {
	      location: "Yokohama",
	      id: "46106"
	  },
	  {
	      location: "Haneda",
	      id: "44166"
	  },
	  {
	      location: "Miura",
	      id: "46211"
	  },
      ];


const colorTable = [
    "orange",
    "green",
    "blue",
    "red",
    "purple",
    "yellow",
    "grey",
    "navy",
    "silver",
    "brown",
    "darkblue",
    "darkorange",
];



function downloadAmedasbyDate(date) {
    return new Promise(function (resolve, reject) {
	const year = date.getFullYear();
	var month = date.getMonth() + 1;
	if (month < 10) {
	    month = '0' + month;
	}
	var day = date.getDate()
	if (day < 10) {
	    day = '0' + day;
	}
	var hour = date.getHours()
	hour = parseInt(hour / 3) * 3;
	if (hour < 10) {
	    hour = '0' + hour;
	}
	var url = "https://www.jma.go.jp/bosai/amedas/data/point/"+point+"/"+ year + month + day + "_"+ hour + ".json"
	//console.log(url);
	var request = new XMLHttpRequest();
	request.open("get", url, true);
	request.onload = function (event) {
	    if (request.readyState === 4) {
		if (request.status === 200) {
		    const downloadData = JSON.parse(request.responseText);
		    Object.keys(downloadData).forEach(function (key) {
			if(downloadData[key] != undefined) {
			    if(downloadData[key].temp != undefined) {
				temp[key] = downloadData[key].temp[0];
			    }
			    if (downloadData[key].humidity != undefined) {
				hum[key] = downloadData[key].humidity[0];
			    }
			    if(downloadData[key].pressure != undefined) {
				pressure[key] = downloadData[key].pressure[0];
			    }
			}
		    });
		} else {
		    console.log(request.statusText); // => Error Message
		}
	    }
	    resolve();
	};
	request.onerror = function (event) {
	    console.log(event.type); // => "error"
	};
	request.send(null);
    });
}
///////////////////////////////////////////////////////////////////////
async function downloadAmedas() {
    // // 3時間おきのデータを取得する(0)まで
    // // 今の所 downloadAmedas は url hard codeなのでそれをなくす
    const nowDate = new Date();
    const now =Date.parse(nowDate);
    for (let t = (now - 1000 * 60 * 60 * 24 * graphDays); now > t ; t = t + 1000 * 60 * 60 * 3) {
	await downloadAmedasbyDate(new Date(t));
	// wait入れてあげるべきかも
    }
}
var myChartData;
var myChartOptions;
var labels = [], graphData = [];

var timesConst = [];
for (let h = 0; h <= 23; h++) {
    for (let m = 0; m < 59; m = m + 10) {
	hh = h;
	if ( hh < 10) {
	    hh = '0' + hh;
	}
	mm = m;
	if (mm < 10) {
	    mm = '0' + mm;
	}
	hhmm = hh + "" + mm
	timesConst.push(hhmm);
    }
}
timesConst = timesConst.reverse();
function updateData(draw_mode) {
    gcolor = "red";
    day = 0
    color = -1;
    var times = timesConst.slice();
    var previousData = 0;
    graphData =[];
    Object.keys(data).forEach(function (key) {
	// 20210227162000
	//        1000000
	// 20210227
	newday = parseInt(key / 1000000) - (parseInt(key / 100000000) * 100);
	//console.log(newday);
	if (parseInt(key / 1000000) - (parseInt(key / 100000000) * 100) != day && day != 0) {
	    if (color != -1) {
		myChartData.datasets.push(
		    { label: day,
		      type: "line",
		      backgroundColor: colorTable[color],
		      fill: false,
		      borderColor: colorTable[color],
		      data: graphData});
	    }
	    graphData = [];
	    day = newday;
	    color++;
	    times = timesConst.slice();
	}
	var hhmm = parseInt(key / 100) - (parseInt(key / 1000000) * 10000);
	if (hhmm < 10) {
	    hhmm = "0" + hhmm ;
	}
	if (hhmm < 100) {
	    hhmm = "0" + hhmm ;
	}
	if (hhmm < 1000) {
	    hhmm = "0" + hhmm ;
	}
	time = times.pop()
	// XX 本当は線形補正したい(chartがデータnullならっしてくれないか？
	// nullがデータけつらくぽくて良いかも
	// または、表示したりなかったりの交互
	while (time != hhmm && time != undefined) {
	    graphData.push(null);
	    time = times.pop()
	}
	graphData.push(data[key]);
	day = newday;
	previousData = data[key]
    });
    myChartData.datasets.push(
	{ label: day,
	  type: "line",
	  fill: false,
	  backgroundColor: colorTable[color],
	  borderColor: colorTable[color],
	  borderWidth: 1,
	  data: graphData});
    labels =[];
    myChartData.datasets = myChartData.datasets.reverse();
    for (let h = 0; h <= 23; h++) {
	for (let m = 0; m < 59; m = m + 10) {
	    hh = h;
	    if ( hh < 10) {
		hh = '0' + hh;
	    }
	    mm = m;
	    if (mm < 10) {
		mm = '0' + mm;
	    }
	    hhmm = hh +":"+ mm
	    if (mm == "00") {
		labels.push(hhmm);
	    } else{
		//tmpLabels.push(hhmm);
		labels.push(hhmm);
	    }
		
	}
    }
    myChartData.labels = labels;
}

function drawBarChart(draw_mode) {
    // 3)chart.jsのdataset用の配列を用意
    myChartData =
	{
	    labels: [],
	    datasets: []
	};
    updateData(draw_mode)
    const ctx = document.getElementById("myChart").getContext("2d");
    window.myChart = new Chart(ctx, {
	type: 'bar',
	data: myChartData,
	options: {
	    maintainAspectRatio: false,
	    scales: {
		xAxes: [{
		    ticks: {
			maxTicksLimit:28,
		    }
		}]
	    }
	}
    });
}
function updateChart(draw_mode) {
    updateData(draw_mode)
    window.myChart.update();
}

function addLoading() {
    let container = document.getElementById("container");

    var loading1 = document.createElement("center");
    loading1.setAttribute("id", "loading");
    container.appendChild(loading1);

    var loading2 = document.createElement("p");
    loading2.setAttribute("class", "line-height");
    loading1.appendChild(loading2);

    var loading3 = document.createElement("i");
    loading3.setAttribute("class", "fa fa-circle-o-notch fa-spin fa-4x fa-fw");
    loading3.setAttribute("style", "color: cornflowerblue");
    loading2.appendChild(loading3);

    var loading4 = document.createElement("div");
    loading4.innerHTML = "loading data from Japan Meteorological Agency...";
    loading2.appendChild(loading4);
}


var temp = [];
var hum  = [];
var pressure = [];
var data = [];
var dataMode = "temp";

async function main() {
    temp = [];
    hum = [];
    pressure = [];
    let loadingId = document.getElementById("loading");
    if (loadingId == undefined) {
	await addLoading();
    }
    
    Promise.all([
	downloadAmedas()
    ]).then(results => {
	updateDataModeButtons();
	let loadingId = document.getElementById("loading");
	if (loadingId != undefined) {
	    loadingId.remove();
	}
	drawBarChart();
    });
}

function updateDataModeButtons() {
    const elementTemp = document.getElementById("temp");
    const elementHum = document.getElementById("hum");
    const elementPressure = document.getElementById("pressure");
    if (dataMode == "temp") {
	elementTemp.style.backgroundColor = 'red';
	elementHum.style.backgroundColor = 'white';
	elementPressure.style.backgroundColor = 'white';
	data = Object.assign({}, temp);
    } else if (dataMode == "hum") {
	elementTemp.style.backgroundColor = 'white';
	elementHum.style.backgroundColor = 'red';
	elementPressure.style.backgroundColor = 'white';
	data = Object.assign({}, hum);
    } else {
	elementTemp.style.backgroundColor = 'white';
	elementHum.style.backgroundColor = 'white';
	elementPressure.style.backgroundColor = 'red';
	data = Object.assign({}, pressure);
    }
}


document.getElementById('temp').addEventListener('click', function() {
    if (dataMode != "temp") {
	dataMode = "temp";
	myChart.destroy();
	updateDataModeButtons();
	drawBarChart();
    }
});

document.getElementById('hum').addEventListener('click', function() {
    if (dataMode != "hum" && hum != []) {
	dataMode = "hum";
	myChart.destroy();
	updateDataModeButtons();
	drawBarChart();
    }
});

document.getElementById('pressure').addEventListener('click', function() {
    if (dataMode != "pressure" && pressure != []) {
	dataMode = "pressure";
	myChart.destroy();
	updateDataModeButtons();
	drawBarChart();
    }
});

document.getElementById('pressure').addEventListener('click', function() {
    if (dataMode != "pressure" && pressure != []) {
	dataMode = "pressure";
	myChart.destroy();
	updateDataModeButtons();
	drawBarChart();
    }
});


for (let i in points) {
    const val = points[i];
    const location = val.location;
    const id = val.id;

    const addButton = document.createElement('input');
    addButton.classList.add('addition');
    addButton.type = 'button';
    addButton.id = location;
    addButton.value = location;
    if (id == point) {
	addButton.style.backgroundColor = 'red';
    } else {
	addButton.style.backgroundColor = 'white';
    }
    document.getElementById("location").appendChild(addButton);

    document.getElementById(location).addEventListener('click', ()=> {
	if (point != id && pressure != []) {
	    point = id;
	    updatePointButtons();
	    myChart.destroy();
	    main();
	}
    });
}


//<button id="Tokyo" style="background-color:red">Tokyo</button>


function updatePointButtons() {
    for (let i in points) {
	const val = points[i];
	const location = val.location;
	const id = val.id;
	const elementLocationButton = document.getElementById(location);
	if (id == point) {
	    elementLocationButton.style.backgroundColor = 'red';
	} else {
	    elementLocationButton.style.backgroundColor = 'white';
	}
    }
}

main();
