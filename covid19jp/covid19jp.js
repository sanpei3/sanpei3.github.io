// 2) CSVから２次元配列に変換

var dataStartDay;
var data = [];

function mmddyy2yymmmdd(str) {
    var s = str.split("/");
    return  "20" + s[2] + "-" + s[0] + "-" + s[1];
}

function csv2Array(str) {
    var lines = str.split("\n");
    for (var i = 0; i < lines.length; ++i) {
	// dataStartDay を自動計算したい
	var cells = lines[i].split(",");
	if (cells[0] == "Province/State") {
	    dataStartDay = mmddyy2yymmmdd(cells[4]);
	}
	data.push(cells);
    }
    return;
}

function csv2ArrayGlobal(str) {
    var lines = str.split("\n");
    var offsetdays = 0;
    for (var i = 0; i < lines.length; ++i) {
	var cells = lines[i].split(",");
	// dataStartDay との差分だけ、4コメからの先に配列の先頭にダミーを入れる
	if (cells[0] == "Province/State") {
	    targetStartDay = mmddyy2yymmmdd(cells[4]);
	    offsetdays = (Date.parse(targetStartDay) -
			  Date.parse(dataStartDay)) / 1000/ 60 / 60 /24;
	}
	if (cells[0] != "Province/State") {
	    cells[0] = cells[1];
	    for (var j = 1; j <= offsetdays; j++) {
		cells.splice(4, 0, 0)
	    }
	}
	data.push(cells);
    }
    return;
}

function csv2ArrayUSState(str) {
    var lines = str.split("\n");
    var offsetdays = 0;
    for (var i = 0; i < lines.length; ++i) {
	var cells = lines[i].split(",");
	// dataStartDay との差分だけ、4コメからの先に配列の先頭にダミーを入れる
	if (cells[0] == "Province/State") {
	    targetStartDay = mmddyy2yymmmdd(cells[4]);
	    offsetdays = (Date.parse(targetStartDay) -
			  Date.parse(dataStartDay)) / 1000/ 60 / 60 /24;
	    continue;
	}
	if (cells[0] != "Province/State") {
	    cells[0] = cells[0] + "_US";
	    for (var j = 1; j <= offsetdays; j++) {
		cells.splice(4, 0, 0)
	    }
	}
	data.push(cells);
    }
    return;
}

function csv2ArrayUSCounty(str) {
    var lines = str.split("\n");
    var offsetdays = 0;
    for (var i = 0; i < lines.length; ++i) {
	var cells = lines[i].split(",");
	// dataStartDay との差分だけ、4コメからの先に配列の先頭にダミーを入れる
	if (cells[0] == "UID") {
	    targetStartDay = mmddyy2yymmmdd(cells[11]);
	    offsetdays = (Date.parse(targetStartDay) -
			  Date.parse(dataStartDay)) / 1000/ 60 / 60 /24;
	    continue;
	}
	if (cells[0] != "UID") {
	    cells[0] = cells[5] + "_" + cells[6] + "_US";
	    cells.splice(4, 11 - 1, "0")
	    for (var j = 1; j <= offsetdays; j++) {
		cells.splice(4, 0, 0)
	    }
	}
	data.push(cells);
    }
    return;
}

function getTzOffset() {
    var date = new Date();
    return tzoff = (date.getHours() - date.getUTCHours() + 24) % 24;
}

function calculate(row, i, draw_mode) {
    if (draw_mode == 0) {
	// Daily New cases
	// XX add average graph
	return data[row][i]- data[row][i- 1];
    } else if (draw_mode == 1) {
	// Double Days
	const days = 6;
	var d = days * Math.log(2.0, 2.0) / Math.log((data[row][i] - data[row][start_day])/ (data[row][i - days]- data[row][start_day]), 2.0);
	if (isNaN(d) || d == Infinity) {
	    return 0;
	} else {
	    return d;
	}
    } else if (draw_mode == 2) {
	// K value
	var k = 1 - (data[row][i- 7] - data[row][start_day])/(data[row][i] - data[row][start_day]);
	if (isNaN(k) || k == Infinity || i - 7 < start_day) {
	    return 0;
	} else {
	    return k
	}
    } else if (draw_mode == 3) {
	// Total cases
	return data[row][i] - data[row][start_day];
    }
}

//
// create table
pref_table = 
    [
	{
	    pref: "Tokyo",
	    defaultenable: true,
	    color: window.chartColors.red
	},
	{
	    pref: "Kanagawa",
	    defaultenable: true,
	    color: window.chartColors.yellow,
	},
	{
	    pref: "Fukuoka",
	    defaultenable: true,
	    color: window.chartColors.blue,
	},
	{
	    pref: "Ibaraki",
	    defaultenable: false,
	    color: window.chartColors.blue,
	},
	{
	    pref: "Chiba",
	    defaultenable: false,
	    color: window.chartColors.blue,
	},
	{
	    pref: "Saitama",
	    defaultenable: false,
	    color: window.chartColors.blue,
	},
	{
	    pref: "US",
	    defaultenable: true,
	    color: window.chartColors.blue,
	},
	{
	    pref: "India",
	    defaultenable: true,
	    color: window.chartColors.blue,
	},
	{
	    pref: "Brazil",
	    defaultenable: true,
	    color: window.chartColors.blue,
	},
	{
	    pref: "Serbia",
	    defaultenable: false,
	    color: window.chartColors.blue,
	},
	{
	    pref: "Philippines",
	    defaultenable: false,
	    color: window.chartColors.blue,
	},
	{
	    pref: "Minnesota_US",
	    defaultenable: true,
	    color: window.chartColors.blue,
	},
	{
	    pref: "New York_US",
	    defaultenable: false,
	    color: window.chartColors.blue,
	},
	{
	    pref: "California_US",
	    defaultenable: false,
	    color: window.chartColors.blue,
	},
	{
	    pref: "Washington_US",
	    defaultenable: false,
	    color: window.chartColors.blue,
	},
	{
	    pref: "Florida_US",
	    defaultenable: false,
	    color: window.chartColors.blue,
	},
	{
	    pref: "Georgia_US",
	    defaultenable: false,
	    color: window.chartColors.blue,
	},
	{
	    pref: "Rice_Minnesota_US",
	    defaultenable: false,
	    color: window.chartColors.blue,
	},
	{
	    pref: "Hennepin_Minnesota_US",
	    defaultenable: false,
	    color: window.chartColors.blue,
	},
    ];

var showFlag = {};
var prefColor = {};
pref_table.forEach(function(val) {
    const pref = val.pref;
    const defaultenable = val.defaultenable;
    showFlag[pref] = defaultenable;
    prefColor[pref] = val.color;
});

var color = Chart.helpers.color;
var tmpLabels = [], tmpData = [];
var tmpData_avgCases = [];
var tmpDoubleEvery = [], tmpDouble2Days = [], tmpDouble3Days = [],
    tmpDoubleOneWeek =[];

function updateData(draw_mode) {
    var start_i = start_day;
    myChartData.datasets = [];
    tmpLabels = [];
    tmpDoubleEvery = [];
    tmpDouble2Days = [];
    tmpDouble3Days = [];
    tmpDoubleOneWeek =[];
    headerFlag = false;
    for (var row in data) {
	if (data[row][0] == "Province/State" && headerFlag == false) {
	    for (var i = start_i; i < data[row].length; i++) {
		tmpLabels.push(data[row][i]);
	    }
	    myChartData.labels = tmpLabels;
	    headerFlag = true;
	}
	pref_table.forEach(function(val) {
	    const pref = val.pref;
	    const defaultenable = val.defaultenable;
	    const gcolor = val.color;
	    if (data[row][0] == pref && showFlag[pref]) {
		tmpData = [];
		tmpData_avgCases = [];
		for (var i = start_i; i < data[row].length; i++) {
		    a = calculate(row, i, draw_mode);
		    if ( a >=0) {
			tmpData.push(a)
		    } else {
			tmpData.push(0)
		    }
		    if (draw_mode == 0) {
			if (i + 1 == data[row].length && (data[row][i] - data[row][i - 1]) == 0) {
			    tmpData_avgCases.push("NULL")
			} else {
			    b = (data[row][i] - data[row][i - 6]) / 7;
			    if ( b >=0) {
				tmpData_avgCases.push(b)
			    } else {
				tmpData_avgCases.push(0)
			    }
			}
		    }
		}
		if (draw_mode == 0) {
		    myChartData.datasets.push(
			{ label: pref,
			  type: "bar",
			  backgroundColor: color(gcolor).alpha(0.5).rgbString(),
			  borderColor: gcolor,
			  borderWidth: 1,
			  data: tmpData});
		    prefAvgLabel = pref + "_avg";
		    myChartData.datasets.push(
			{ label: prefAvgLabel, data: tmpData_avgCases, fill: false,
			  type: "line",
			  borderColor: gcolor})
		} else {
		    myChartData.datasets.push(
			{ label: pref, data: tmpData, fill: false,
			  type: "line",
			  borderColor: gcolor})
		}
	    }
	});	    		// 
    }
    if (draw_mode == 4) {
	var newCases = 10;
	for (var i = start_i; i < data[0].length; i++) {
	    newCases = newCases * 1.41421356237309504880;
	    tmpDouble2Days.push(newCases);
	}
	myChartData.datasets.push(
	    { label: "CASES DOUBLE 2 DAYS", data: tmpDouble2Days,fill: false,
	      type: "line",
	      borderColor: window.chartColors.gray});
	var newCases = 10;
	for (var i = start_i; i < data[0].length; i++) {
	    newCases = newCases * 1.2599210498;
	    tmpDouble3Days.push(newCases);
	}
	myChartData.datasets.push(
	    { label: "CASES DOUBLE 3 DAYS", data: tmpDouble3Days,fill: false,
	      type: "line",
	      borderColor: window.chartColors.gray});
	var newCases = 10;
	for (var i = start_i; i < data[0].length; i++) {
	    newCases = newCases * 1.1040895136738;
	    tmpDoubleOneWeek.push(newCases);
	}
	myChartData.datasets.push(
	    { label: "CASES DOUBLE 1 Week", data: tmpDoubleOneWeek,fill: false,
	      type: "line",
	      borderColor: window.chartColors.gray});
    }
}
const  myChartOptionsLogarithmic =
      {
	  yAxes: [{
	      type: 'logarithmic',
	      ticks: {
		  min: 10, //minimum tick
		  max: 1000, //maximum tick
	      },
	  }],
      };

const  myChartOptionsLinear =
      {
	  yAxes: [{
	      type: 'linear',
	      ticks: {
		  beginAtZero: true,
		  min: 0,
	      }
	  }],
      };

var myChartData;
var myChartOptions;
function drawBarChart(draw_mode) {
    // 3)chart.jsのdataset用の配列を用意
    myChartData =
	{
	    labels: [],
	    datasets: []
	};
    updateData(draw_mode)
    myChartOptions = {
	scales: myChartOptionsLinear
    };
    // 4)chart.jsで描画
    var ctx = document.getElementById("myChart").getContext("2d");
    window.myChart = new Chart(ctx, {
	type: 'bar',
	data: myChartData,
	options: myChartOptions,
    });
}


function updateBarChart(draw_mode) {
  // 3)chart.jsのdataset用の配列を用意
    updateData(draw_mode)
    if (draw_mode == 3) {
	myChartOptions.scales = myChartOptionsLogarithmic;
	console.log(myChartOptions.scales);
    } else {
    	myChartOptions.scales = myChartOptionsLinear;
    }
    // 4)chart.jsで描画
    window.myChart.update();
}
flatpickr('#calendar', {
//    mode: "range",
    minDate: dataStartDay,
    maxDate: "today",
    dateFormat: "Y-m-d",
    defaultDate: "2020-05-20",
}
	 );

function getUpdateDate(url, elementId) {
    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.onload = function() {
	update_str = JSON.parse(req.responseText)[0].commit.committer.date;
	var ts = Date.parse(update_str);
	ts = parseInt(ts) + getTzOffset() * 60 * 60;
	const dt = new Date(ts);
	var update_date = document.getElementById(elementId);
	update_date.innerHTML = dt;
    }
    req.send(null);
}

function readJapan() {
    return new Promise(function (resolve, reject) {
	var req = new XMLHttpRequest();
	var filePath = 'https://raw.githubusercontent.com/sanpei3/covid19jp/master/time_series_covid19_confirmed_Japan.csv';
	req.open("GET", filePath, true);
	req.onload = function() {
	    // 2) CSVデータ変換の呼び出し
	    csv2Array(req.responseText);
	    resolve();
	}
	req.send(null);
	getUpdateDate("https://api.github.com/repos/sanpei3/covid19jp/commits?path=time_series_covid19_confirmed_Japan.csv&page=1&per_page=1", "update_date_jp");
    });
}

function readGlobal() {
    return new Promise(function (resolve, reject) {
	var req = new XMLHttpRequest();
	var filePath = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';
	req.open("GET", filePath, true);
	req.onload = function() {
	    // 2) CSVデータ変換の呼び出し
	    csv2ArrayGlobal(req.responseText);
	    resolve();
	}
	req.send(null);
	getUpdateDate("https://api.github.com/repos/CSSEGISandData/COVID-19/commits?path=csse_covid_19_data%2Fcsse_covid_19_time_series%2Ftime_series_covid19_confirmed_global.csv&page=1&per_page=1", "update_date_global");
    });
}

function readUS_State() {
    return new Promise(function (resolve, reject) {
	var req = new XMLHttpRequest();
	var filePath = 'https://raw.githubusercontent.com/sanpei3/covid19jp/master/time_series_covid19_confirmed_US_State.csv'
	req.open("GET", filePath, true);
	req.onload = function() {
	    // 2) CSVデータ変換の呼び出し
	    csv2ArrayUSState(req.responseText);
	    resolve();
	}
	req.send(null);
	getUpdateDate("https://api.github.com/repos/sanpei3/covid19jp/commits?path=time_series_covid19_confirmed_US_State.csv&page=1&per_page=1", "update_date_us_state");
    });
}
function readUS_County() {
    return new Promise(function (resolve, reject) {
	var req = new XMLHttpRequest();
	var filePath = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv';
	req.open("GET", filePath, true);
	req.onload = function() {
	    // 2) CSVデータ変換の呼び出し
	    csv2ArrayUSCounty(req.responseText);
	    resolve();
	}
	req.send(null);
	getUpdateDate("https://api.github.com/repos/CSSEGISandData/COVID-19/commits?path=csse_covid_19_data%2Fcsse_covid_19_time_series%2Ftime_series_covid19_confirmed_US.csv&page=1&per_page=1", "update_date_us_county");
    });
}

async function main() {
    // 1) ajaxでCSVファイルをロード
    await readJapan();
    await readGlobal();
    await readUS_State();
    await readUS_County();
    await drawBarChart(draw_mode);
    var update_str;
}


var draw_mode = 0;
var start_day = 130;

document.getElementById('daily_new_cases').addEventListener('click', function() {
    if (draw_mode != 0) {
	draw_mode = 0;
	updateBarChart(draw_mode);
	var element = document.getElementById("daily_new_cases");element.style.backgroundColor = 'red';	 
	var element = document.getElementById("double_days");element.style.backgroundColor = 'white';	 
	var element = document.getElementById("k_value");element.style.backgroundColor = 'white';	 
	var element = document.getElementById("total_cases");element.style.backgroundColor = 'white';	 
    }
});
document.getElementById('double_days').addEventListener('click', function() {
    if (draw_mode != 1) {
	draw_mode = 1;
	updateBarChart(draw_mode);
	var element = document.getElementById("daily_new_cases");element.style.backgroundColor = 'white';	 
	var element = document.getElementById("double_days");element.style.backgroundColor = 'red';	 
	var element = document.getElementById("k_value");element.style.backgroundColor = 'white';	 
	var element = document.getElementById("total_cases");element.style.backgroundColor = 'white';	 
    }
});
document.getElementById('k_value').addEventListener('click', function() {
    if (draw_mode != 2) {
	draw_mode = 2;
	updateBarChart(draw_mode);
	var element = document.getElementById("daily_new_cases");element.style.backgroundColor = 'white';	 
	var element = document.getElementById("double_days");element.style.backgroundColor = 'white';	 
	var element = document.getElementById("k_value");element.style.backgroundColor = 'red';	 
	var element = document.getElementById("total_cases");element.style.backgroundColor = 'white';	 
    }
});
document.getElementById('total_cases').addEventListener('click', function() {
    if (draw_mode != 3) {
	draw_mode = 3;
	updateBarChart(draw_mode);
	var element = document.getElementById("daily_new_cases");element.style.backgroundColor = 'white';	 
	var element = document.getElementById("double_days");element.style.backgroundColor = 'white';	 
	var element = document.getElementById("k_value");element.style.backgroundColor = 'white';	 
	var element = document.getElementById("total_cases");element.style.backgroundColor = 'red';	 
    }
});

function func2() {
    var input_message = document.getElementById("calendar").value;
    var ts = Date.parse(input_message);
    var ts_start = Date.parse(dataStartDay);
    ts = parseInt((ts - ts_start) /1000 / 60 / 60 / 24) + 4; // 4 is pre cell
    start_day = parseInt(ts);
    updateBarChart(draw_mode);
}

document.getElementById("calendar")
    .addEventListener("change", function(event) {
	func2();
    });

pref_table.forEach(function(val) {
    const pref = val.pref;
    const defaultenable = val.defaultenable;
    const gcolor = val.color;
    const addButton = document.createElement('input');
    addButton.classList.add('addition');
    addButton.type = 'button';
    addButton.id = pref;
    addButton.value = pref;
    if (defaultenable) {
	addButton.style.backgroundColor = gcolor;
    } else {
	addButton.style.backgroundColor = 'white';
    }
    document.body.appendChild(addButton);
    document.getElementById(pref).addEventListener('click', ()=> {
	var element = document.getElementById(pref);
	if (showFlag[pref]) {
	    element.style.backgroundColor = 'white';
	} else {
	    element.style.backgroundColor = prefColor[pref];
	}
	showFlag[pref] = !(showFlag[pref]);
	updateBarChart(draw_mode);
    }, false);
});

document.getElementById('AllClear').addEventListener('click', function() {
    pref_table.forEach(function(val) {
	const pref = val.pref;
	if (showFlag[pref]) {
	    var element = document.getElementById(pref);
	    element.style.backgroundColor = 'white';
	    showFlag[pref] = false;
	}
    });
    updateBarChart(draw_mode);
});
main();
