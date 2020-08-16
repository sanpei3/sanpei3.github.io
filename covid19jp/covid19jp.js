// 2) CSVから２次元配列に変換

var dataStartDay = "2020-01-15";
var JapanDataSource = "JAG";
var data = [];
var dataCases = {};
var dataCasesJAG = [];
var dataCasesToyokeizai = [];
var dataDeath = [];
var dataRecoverd = [];
var yaxesType = "Logarithmic";
var draw_mode = 0;
var start_day = 130;
var start_date = "2020-05-25";
var showFlag = {};
var buttonArea = {};
var showFlagAlreadySet = false;
var addPref = [];
var rowForDataDeath = 0;
var rowForDataRecoverd = 0;
var psccKeys = [];
var dataPopulation = [];
var loadFiles = 0;
var doubleInitial = 100;

var colorTable = [
//    "red",
//    "yellow",
    "purple",
    "grey",
    "blue",
    "orange",
//    "navy",
    "silver",
    "brown",
    "darkblue",
    "darkorange",
];

const graphTable = ["daily_new_cases", // 0
		    "double_days",     // 1
		    "k_value",         // 2
		    "total_cases",     // 3
		    "daily_deaths",    // 4
		    "total_deaths",    // 5
		    "daily_recoverd",  // 6
		    "total_recoverd",  // 7
		    "current_number_of_patients",  // 8
		    "daily_new_cases_per_100000",  // 9
		    "E_R_number",                  // 10
//		    "total_cases_per_100000",
		   ];


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
	    defaultenable: false,
	    color: window.chartColors.yellow,
	},
	{
	    pref: "Chiba",
	    defaultenable: false,
	},
	{
	    pref: "Saitama",
	    defaultenable: false,
	},
	{
	    pref: "Ibaraki",
	    defaultenable: false,
	},
	{
	    pref: "Osaka",
	    defaultenable: false,
	},
		{
	    pref: "Aichi",
	    defaultenable: false,
	},
	{
	    pref: "Fukuoka",
	    defaultenable: false
	},
	{
	    pref: "Japan",
	    defaultenable: false,
	},
	{
	    pref: "US",
	    defaultenable: false,
	},
	{
	    pref: "China",
	    defaultenable: false,
	},
	{
	    pref: "India",
	    defaultenable: false,
	},
	{
	    pref: "Brazil",
	    defaultenable: false,
	},
	{
	    pref: "Serbia",
	    defaultenable: false,
	},
	{
	    pref: "Greece",
	    defaultenable: false,
	},
	{
	    pref: "Philippines",
	    defaultenable: false,
	},
	{
	    pref: "Minnesota_US",
	    defaultenable: false,
	},
	{
	    pref: "New York_US",
	    defaultenable: false,
	},
	{
	    pref: "California_US",
	    defaultenable: false,
	},
	{
	    pref: "Washington_US",
	    defaultenable: false,
	},
	{
	    pref: "Florida_US",
	    defaultenable: false,
	},
	{
	    pref: "Georgia_US",
	    defaultenable: false,
	},
	{
	    pref: "Rice_Minnesota_US",
	    defaultenable: false,
	},
	{
	    pref: "Hennepin_Minnesota_US",
	    defaultenable: false,
	},
	{
	    pref: "San Francisco_California_US",
	    defaultenable: false,
	},
    ];
var prefColor = {};
var colorIndex = 0;

function createButton(pref, gcolor) {
    const addButton = document.createElement('input');
    addButton.classList.add('addition');
    addButton.type = 'button';
    addButton.id = pref;
    addButton.value = pref;
    if (showFlag[pref]) {
	addButton.style.backgroundColor = prefColor[pref];
    } else {
	addButton.style.backgroundColor = 'white';
    }
    document.getElementById(buttonArea[pref]).appendChild(addButton);
    document.getElementById(pref).addEventListener('click', ()=> {
	var element = document.getElementById(pref);
	showFlagAlreadySet = true;
	updateLocationHash();
	if (showFlag[pref]) {
	    element.style.backgroundColor = 'white';
	} else {
	    element.style.backgroundColor = prefColor[pref];
	}
	showFlag[pref] = !(showFlag[pref]);
	updateBarChart(draw_mode);
    }, false);
}

async function initialize() {
    var urlHash = location.hash.replace(/^#/, "").split(/&/);
    
    await urlHash.forEach(function(i) {
	var s = i.split(/=/, 2);
	if (s[0] == "dm") {
	    draw_mode = s[1];
	    updateGraphButtons(0, draw_mode)
	} else if (s[0] == "sd") {
	    start_date = s[1]
	} else if (s[0] == "jd") {
	    JapanDataSource = s[1]
	    updateDataSourceButtons();
	} else if (s[0] == "ya") {
	    yaxesType = s[1];
	    if (yaxesType == "Logarithmic" && (draw_mode == 9 || draw_mode == 10)) {
		yaxesType = "Linear";
	    }
	    updateYAxesButtons();
	} else if (s[0] == "c") {
	    showFlagAlreadySet = true;
	    if (s[1] == "") {
		return;
	    }
	    var cs = s[1].split(/,/);
	    cs.forEach(function(c) {
		c = decodeURI(c);
		var findFlag = false;
		showFlag[c] = true;
		pref_table.forEach(function(val) {
		    const pref = val.pref;
	    	    if (c == pref) {
			findFlag = true;
		    }
		});
		if (findFlag == false) {
		    pref_table.push(
			{
			    pref: c,
			    defaultenable: true,
			},
		    );
		    addPref.push(c);
		}
	    });
	} else if (s[0] == "d") {
	    showFlagAlreadySet = true;
	    var cs = s[1].split(/,/);
	    cs.forEach(function(c) {
		c = decodeURI(c);
		var findFlag = false;
		showFlag[c] = false;
		pref_table.forEach(function(val) {
		    const pref = val.pref;
	    	    if (c == pref) {
			findFlag = true;
		    }
		});
		if (findFlag == false) {
		    pref_table.push(
			{
			    pref: c,
			    defaultenable: false,
			},
		    );
		    addPref.push(c);
		}
	    });
	}
	// logarithm
	// draw_modeはdraw_mode切り替えボタンを動的に作る必要あり
    });
    await pref_table.forEach(function(val) {
	const pref = val.pref;
	const defaultenable = val.defaultenable;
	if (! (showFlagAlreadySet)) {
	    showFlag[pref] = defaultenable;
	}
	if (val.color != undefined) {
	    prefColor[pref] = val.color;
	} else {
	    prefColor[pref] = colorTable[colorIndex % colorTable.length];
	    colorIndex = colorIndex + 1;
	}
    });
    await pref_table.forEach(function(val) {
	const pref = val.pref;
	const gcolor = val.color;
	createButton(pref, gcolor);
    });
}

function updateLocationHash () {
    var cs = "";
    var ds = "";
    if (showFlagAlreadySet) {
	cs = "&c=";
	for (let i in showFlag) {
	    // XX なぜか空白のiがある、原因は別途検討
	    if (i == "") {
		continue;
	    }
	    if (showFlag[i]) {
		cs = cs + i + ",";
	    }
	}
	cs = cs.replace(/,$/, "");
    }
    var dsFlag = false;
    if (addPref.length >= 1) {
	ds = "&d=";
	for (const i of addPref) {
	    // XX なぜか空白のiがある、原因は別途検討
	    if (i == "") {
		continue;
	    }
	    if (showFlag[i] == false) {
		ds = ds + i + ",";
		dsFlag = true;
	    }
	}
	ds = ds.replace(/,$/, "");
    }
    if (!dsFlag) {
	ds = "";
    }
    window.location.hash = "dm=" + draw_mode + "&sd=" + start_date + "&ya=" + yaxesType + "&jd=" + JapanDataSource + cs + ds;
}

function mmddyy2yymmmdd(str) {
    var s = str.split("/");
    return  "20" + s[2] + "/" + s[0] + "/" + s[1];
}

function dateParse(date) {
    return Date.parse(date.replace(/-/g , "/")  + " 00:00:00");
}

function csv2Array(str) {
    var lines = str.split("\n");
    for (var i = 0; i < lines.length; ++i) {
//	var cells = lines[i].split(",");
	var cells = Papa.parse(lines[i]).data[0];
	if (cells == undefined) {
	    return;
	}
	if (cells[0] == "Province/State") {
//	    dataStartDay = mmddyy2yymmmdd(cells[4]);
	} else {
	    psccKeys.push(cells[0]);
	    buttonArea[cells[0]] = "prefecture";
	}
	dataCasesJAG.push(cells);
    }
    return;
}

function csv2ArrayJpPopulation(str) {
    var lines = str.split("\n");
    for (var i = 0; i < lines.length; ++i) {
//	var cells = lines[i].split(",");
	var cells = Papa.parse(lines[i]).data[0];
	if (cells == undefined) {
	    return;
	}
	dataPopulation[cells[0]] = cells[1].replace(",", "");
    }
    return;
}

function csv2ArrayGlobal(str) {
    var lines = str.split("\n");
    var offsetdays = 0;
    var cellsChina = [];
    var cellsCanada = [];
    var cellsAustralia = [];
    for (var i = 0; i < lines.length; ++i) {
//	var cells = lines[i].split(",");
	var cells = Papa.parse(lines[i]).data[0];
	if (cells == undefined) {
	    break;
	}
	// dataStartDay との差分だけ、4コメからの先に配列の先頭にダミーを入れる
	if (cells[0] == "Province/State") {
	    targetStartDay = mmddyy2yymmmdd(cells[4]);
	    offsetdays = (dateParse(targetStartDay) -
			  dateParse(dataStartDay)) / 1000/ 60 / 60 /24;
	}
	if (cells[0] == "") {
	    cells[0] = cells[1].replace(",", "");
	    for (var j = 1; j <= offsetdays; j++) {
		cells.splice(4, 0, 0);
	    }
	    dataCasesJAG.push(cells);
	    dataCasesToyokeizai.push(cells);
	    psccKeys.push(cells[0]);
	    buttonArea[cells[0]] = "country";
	}
	if (cells[1] == "China") {
	    for (var j = 1; j <= offsetdays; j++) {
		cells.splice(4, 0, 0);
	    }
	    if (cellsChina.length == 0) {
		cells[0] = cells[1];
		cellsChina = cells;
	    } else {
		for (var j = 4; j < cells.length; j++) {
		    cellsChina[j] = parseInt(cellsChina[j]) + parseInt(cells[j]);
		}
	    }
	}
	if (cells[1] == "Canada") {
	    for (var j = 1; j <= offsetdays; j++) {
		cells.splice(4, 0, 0);
	    }
	    if (cellsCanada.length == 0) {
		cells[0] = cells[1];
		cellsCanada = cells;
	    } else {
		for (var j = 4; j < cells.length; j++) {
		    cellsCanada[j] = parseInt(cellsCanada[j]) + parseInt(cells[j]);
		}
	    }
	}
	if (cells[1] == "Australia") {
	    for (var j = 1; j <= offsetdays; j++) {
		cells.splice(4, 0, 0);
	    }
	    if (cellsAustralia.length == 0) {
		cells[0] = cells[1];
		cellsAustralia= cells;
	    } else {
		for (var j = 4; j < cells.length; j++) {
		    cellsAustralia[j] = parseInt(cellsAustralia[j]) + parseInt(cells[j]);
		}
	    }
	}
	    
    }
    dataCasesJAG.push(cellsChina);
    dataCasesJAG.push(cellsCanada);
    dataCasesJAG.push(cellsAustralia);
    dataCasesToyokeizai.push(cellsChina);
    dataCasesToyokeizai.push(cellsCanada);
    dataCasesToyokeizai.push(cellsAustralia);
    psccKeys.push("China");
    buttonArea["China"] = "country";
    psccKeys.push("Canada");
    buttonArea["Canada"] = "country";
    psccKeys.push("Australia");
    buttonArea["Australia"] = "country";
    return;
}

function csv2ArrayGlobalDeath(str) {
    var lines = str.split("\n");
    var offsetdays = 0;
    var cellsChina = [];
    var cellsCanada = [];
    var cellsAustralia = [];
    for (var i = 0; i < lines.length; ++i) {
//	var cells = lines[i].split(",");
	var cells = Papa.parse(lines[i]).data[0];
	if (cells == undefined) {
	    break;
	}
	// dataStartDay との差分だけ、4コメからの先に配列の先頭にダミーを入れる
	if (cells[0] == "Province/State") {
	    targetStartDay = mmddyy2yymmmdd(cells[4]);
	    offsetdays = (dateParse(targetStartDay) -
			  dateParse(dataStartDay)) / 1000/ 60 / 60 /24;
	}
	if (cells[0] == "") {
	    cells[0] = cells[1].replace(",", "");
	    for (var j = 1; j <= offsetdays; j++) {
		cells.splice(4, 0, 0)
	    }
	    dataDeath.push(cells);
	}
	if (cells[1] == "China") {
	    for (var j = 1; j <= offsetdays; j++) {
		cells.splice(4, 0, 0);
	    }
	    if (cellsChina.length == 0) {
		cells[0] = cells[1];
		cellsChina = cells;
	    } else {
		for (var j = 4; j < cells.length; j++) {
		    cellsChina[j] = parseInt(cellsChina[j]) + parseInt(cells[j]);
		}
	    }
	}
	if (cells[1] == "Canada") {
	    for (var j = 1; j <= offsetdays; j++) {
		cells.splice(4, 0, 0);
	    }
	    if (cellsCanada.length == 0) {
		cells[0] = cells[1];
		cellsCanada = cells;
	    } else {
		for (var j = 4; j < cells.length; j++) {
		    cellsCanada[j] = parseInt(cellsCanada[j]) + parseInt(cells[j]);
		}
	    }
	}
	if (cells[1] == "Australia") {
	    for (var j = 1; j <= offsetdays; j++) {
		cells.splice(4, 0, 0);
	    }
	    if (cellsAustralia.length == 0) {
		cells[0] = cells[1];
		cellsAustralia= cells;
	    } else {
		for (var j = 4; j < cells.length; j++) {
		    cellsAustralia[j] = parseInt(cellsAustralia[j]) + parseInt(cells[j]);
		}
	    }
	}
    }
    dataDeath.push(cellsChina);
    dataDeath.push(cellsCanada);
    dataDeath.push(cellsAustralia);
    return;
}

function csv2ArrayUSState(str) {
    var lines = str.split("\n");
    var offsetdays = 0;
    for (var i = 0; i < lines.length; ++i) {
//	var cells = lines[i].split(",");
	var cells = Papa.parse(lines[i]).data[0];
	if (cells == undefined) {
	    return;
	}
	// dataStartDay との差分だけ、4コメからの先に配列の先頭にダミーを入れる
	if (cells[0] == "Province/State") {
	    targetStartDay = mmddyy2yymmmdd(cells[4]);
	    offsetdays = (dateParse(targetStartDay) -
			  dateParse(dataStartDay)) / 1000/ 60 / 60 /24;
	    continue;
	}
	if (cells[0] != "Province/State") {
	    cells[0] = cells[0].replace(",", "") + "_US";
	    psccKeys.push(cells[0]);
	    buttonArea[cells[0]] = "us_state";
	}
	for (var j = 1; j <= offsetdays; j++) {
	    cells.splice(4, 0, 0)
	}
	dataCasesJAG.push(cells);
	dataCasesToyokeizai.push(cells);
    }
    return;
}

function csv2ArrayUSStateDeath(str) {
    var lines = str.split("\n");
    var offsetdays = 0;
    for (var i = 0; i < lines.length; ++i) {
//	var cells = lines[i].split(",");
	var cells = Papa.parse(lines[i]).data[0];
	if (cells == undefined) {
	    return;
	}
	// dataStartDay との差分だけ、4コメからの先に配列の先頭にダミーを入れる
	if (cells[0] == "Province/State") {
	    targetStartDay = mmddyy2yymmmdd(cells[4]);
	    offsetdays = (dateParse(targetStartDay) -
			  dateParse(dataStartDay)) / 1000/ 60 / 60 /24;
	    continue;
	}
	if (cells[0] != "Province/State") {
	    cells[0] = cells[0].replace(",", "") + "_US";
	}
	for (var j = 1; j <= offsetdays; j++) {
	    cells.splice(4, 0, 0)
	}
	dataDeath.push(cells);
    }
    return;
}

function csv2ArrayUSCounty(str) {
    var lines = str.split("\n");
    var offsetdays = 0;
    for (var i = 0; i < lines.length; ++i) {
//	var cells = lines[i].split(",");
	var cells = Papa.parse(lines[i]).data[0];
	if (cells == undefined) {
	    return;
	}
	// dataStartDay との差分だけ、4コメからの先に配列の先頭にダミーを入れる
	if (cells[0] == "UID") {
	    targetStartDay = mmddyy2yymmmdd(cells[11]);
	    offsetdays = (dateParse(targetStartDay) -
			  dateParse(dataStartDay)) / 1000/ 60 / 60 /24;
	    continue;
	}
	if (cells[0] != "UID") {
	    cells[0] = cells[5].replace(",", "") + "_" + cells[6].replace(",", "") + "_US";
	    cells.splice(4, 11 - 1, "0")
	    psccKeys.push(cells[0]);
	    buttonArea[cells[0]] = "us_county";
	}
	for (var j = 1; j <= offsetdays; j++) {
	    cells.splice(4, 0, 0)
	}
	dataCasesJAG.push(cells);
	dataCasesToyokeizai.push(cells);
    }
    return;
}

function csv2ArrayUSCountyDeath(str) {
    var lines = str.split("\n");
    var offsetdays = 0;
    for (var i = 0; i < lines.length; ++i) {
//	var cells = lines[i].split(",");
	var cells = Papa.parse(lines[i]).data[0];
	if (cells == undefined) {
	    return;
	}
	// dataStartDay との差分だけ、4コメからの先に配列の先頭にダミーを入れる
	if (cells[0] == "UID") {
	    targetStartDay = mmddyy2yymmmdd(cells[11]);
	    offsetdays = (dateParse(targetStartDay) -
			  dateParse(dataStartDay)) / 1000/ 60 / 60 /24;
	    continue;
	}
	if (cells[0] != "UID") {
	    cells[0] = cells[5].replace(",", "") + "_" + cells[6].replace(",", "") + "_US";
	    cells.splice(4, 11 - 1, "0")
	}
	for (var j = 1; j <= offsetdays; j++) {
	    cells.splice(4, 0, 0)
	}
	dataDeath.push(cells);
    }
    return;
}
function csv2ArrayGlobalRecoverd(str) {
    var lines = str.split("\n");
    var offsetdays = 0;
    var cellsChina = [];
    var cellsCanada = [];
    var cellsAustralia = [];
    for (var i = 0; i < lines.length; ++i) {
//	var cells = lines[i].split(",");
	var cells = Papa.parse(lines[i]).data[0];
	if (cells == undefined) {
	    break;
	}
	// dataStartDay との差分だけ、4コメからの先に配列の先頭にダミーを入れる
	if (cells[0] == "Province/State") {
	    targetStartDay = mmddyy2yymmmdd(cells[4]);
	    offsetdays = (dateParse(targetStartDay) -
			  dateParse(dataStartDay)) / 1000/ 60 / 60 /24;
	}
	if (cells[0] == "") {
	    cells[0] = cells[1].replace(",", "");
	    for (var j = 1; j <= offsetdays; j++) {
		cells.splice(4, 0, 0)
	    }
	    dataRecoverd.push(cells);
	}
	if (cells[1] == "China") {
	    for (var j = 1; j <= offsetdays; j++) {
		cells.splice(4, 0, 0);
	    }
	    if (cellsChina.length == 0) {
		cells[0] = cells[1];
		cellsChina = cells;
	    } else {
		for (var j = 4; j < cells.length; j++) {
		    cellsChina[j] = parseInt(cellsChina[j]) + parseInt(cells[j]);
		}
	    }
	}
	if (cells[1] == "Canada") {
	    for (var j = 1; j <= offsetdays; j++) {
		cells.splice(4, 0, 0);
	    }
	    if (cellsCanada.length == 0) {
		cells[0] = cells[1];
		cellsCanada = cells;
	    } else {
		for (var j = 4; j < cells.length; j++) {
		    cellsCanada[j] = parseInt(cellsCanada[j]) + parseInt(cells[j]);
		}
	    }
	}
	if (cells[1] == "Australia") {
	    for (var j = 1; j <= offsetdays; j++) {
		cells.splice(4, 0, 0);
	    }
	    if (cellsAustralia.length == 0) {
		cells[0] = cells[1];
		cellsAustralia= cells;
	    } else {
		for (var j = 4; j < cells.length; j++) {
		    cellsAustralia[j] = parseInt(cellsAustralia[j]) + parseInt(cells[j]);
		}
	    }
	}
    }
    dataRecoverd.push(cellsChina);
    dataRecoverd.push(cellsCanada);
    dataRecoverd.push(cellsAustralia);
    return;
}

function getTzOffset() {
    var date = new Date();
    return tzoff = (date.getHours() - date.getUTCHours() + 24) % 24;
}

function calculate(row, i, draw_mode) {
    if (draw_mode == 0 || draw_mode == 9 ) {
	// Daily New cases
	// XX add average graph
	var j = data[row][i]- data[row][i- 1];
	var c = dataPopulation[data[row][0]];
	if (draw_mode == 9 &&  c != 0) {
	    return j / c * 100000;
	} else {
	    return j;
	}
    } else if (draw_mode == 1) {
	// Double Days
	var avgD = 0;
	for (var j = 0; j >= -6; j--){
	    const days = 6;
	    var d = days * Math.log(2.0, 2.0) / Math.log((data[row][i + j] - data[row][start_day + j])/ (data[row][i - days + j]- data[row][start_day + j]), 2.0);
	    avgD = avgD + d;
	}
	avgD = avgD / 7;
	if (isNaN(avgD) || avgD == Infinity) {
	    return 0;
	} else {
	    return avgD;
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
    } else if (draw_mode == 4) {
	// Total cases
	return data[row][i]- data[row][i- 1];
    } else if (draw_mode == 5) {
	// Total cases
	return data[row][i] - data[row][start_day];
    } else if (draw_mode == 6) {
	// Total cases
	return data[row][i]- data[row][i- 1];
    } else if (draw_mode == 7) {
	// Total cases
	return data[row][i] - data[row][start_day];
    } else if (draw_mode == 8) {
	// Total cases
	if (rowForDataDeath != 0 && rowForDataRecoverd != 0) {
	    return dataCases[row][i] - dataDeath[rowForDataDeath][i] - dataRecoverd[rowForDataRecoverd][i];
	} else {
	    return 0;
	}
    } else if (draw_mode == 10) {
	// Effective Reproduction Number
	var r = ((data[row][i] - data[row][i - 6]) /
		 (data[row][i - 7] - data[row][i - 7 - 6])) ** (5.0/7.0)
	if (isNaN(r) || r == Infinity || i - 7 - 6 < start_day) {
	    return 0;
	} else {
	    return r
	}
    }

}



var color = Chart.helpers.color;
var tmpLabels = [], tmpData = [];
var tmpData_avgCases = [];
var tmpDoubleEvery = [], tmpDouble2Days = [], tmpDouble3Days = [],
    tmpDoubleOneWeek =[];

function updateData(draw_mode) {
    var start_i = start_day;
    doubleInitial = 100;
    myChartData.datasets = [];
    tmpLabels = [];
    tmpDoubleEvery = [];
    tmpDouble2Days = [];
    tmpDouble3Days = [];
    tmpDoubleOneWeek =[];
    headerFlag = false;
    data = dataCases;
    for (var row in data) {
	// ここで、header行で、lengthが違ったら、追加する
	if (data[row][0] == "Province/State" && headerFlag == true) {
	    if (tmpLabels.length + start_i < data[row].length) {
		var d = 1;
		for (var i = tmpLabels.length + start_i; i < data[row].length; i++) {
		    if (draw_mode == 3) {
			tmpLabels.push(d++);
		    } else {
			tmpLabels.push(data[row][i]);
		    }
		}
		myChartData.labels = tmpLabels;
	    }
	}
	if (data[row][0] == "Province/State" && headerFlag == false) {
	    var d = 1;
	    for (var i = start_i; i < data[row].length; i++) {
		if (draw_mode == 3) {
		    tmpLabels.push(d++);
		} else {
		    tmpLabels.push(data[row][i]);
		}
	    }
	    myChartData.labels = tmpLabels;
	    headerFlag = true;
	}
    }
    if (draw_mode <= 3) {
	data = dataCases;
    } else if (draw_mode >= 4 && draw_mode <= 5) {
	data = dataDeath;
    } else if (draw_mode >= 6 && draw_mode <= 7) {
	data = dataRecoverd;
    } else if (draw_mode == 8) {
	data = data;
    }
    var doubleDaysGraphOffset = 0;
    var maxY = 0;
    for (var row in data) {
	pref_table.forEach(function(val) {
	    const pref = val.pref;
	    const defaultenable = val.defaultenable;
	    const gcolor = prefColor[pref];
	    if (data[row][0] == pref && showFlag[pref]) {
		tmpData = [];
		tmpData_avgCases = [];
		if (draw_mode == 8) {
		    // find row for dataDeath and detaRecoverd
		    rowForDataDeath = 0;
		    rowForDataRecoverd = 0;
		    var findDeathFlag = false;
		    for (var r in dataDeath) {
			if (dataDeath[r][0] == pref) {
			    rowForDataDeath = r;
			    findDeathFlag = true;
			    break;
			}
		    }
		    var findRevocerdFlag = false;
		    for (var r in dataRecoverd) {
			if (dataRecoverd[r][0] == pref) {
			    rowForDataRecoverd = r;
			    findRevocerdFlag = true;
			    break;
			}
		    }
		    if (!findDeathFlag || !findRevocerdFlag) {
			return;
		    }
		}
		for (var i = start_i; i < data[row].length; i++) {
		    a = calculate(row, i, draw_mode);
		    if (draw_mode == 3) {
			if (doubleDaysGraphOffset != 0 && a < doubleInitial) {
			    continue;
			} else if (a < doubleInitial) {
			    continue;
//			    a = doubleInitial;
			}
		    }		   
		    if ( a >=0) {
			tmpData.push(a)
		    } else {
			tmpData.push(0)
		    }
		    if (draw_mode == 3 && doubleInitial < (data[row][i] - data[row][start_day]) && doubleDaysGraphOffset == 0) {
			doubleDaysGraphOffset = i;
		    }
		    if (draw_mode == 0 || draw_mode == 4 || draw_mode == 6 || draw_mode == 9) {
			if (i + 1 == data[row].length && (data[row][i] - data[row][i - 1]) == 0) {
			    tmpData_avgCases.push("NULL")
			} else {
			    b = (data[row][i] - data[row][i - 7]) / 7;
			    if (draw_mode == 9 && c != 0) {
				var c = dataPopulation[data[row][0]];
				b = b / c * 100000;
			    }
			    if ( b >=0) {
				tmpData_avgCases.push(b)
			    } else {
				tmpData_avgCases.push(0)
			    }
			}
		    }
		    if (draw_mode == 99) {
//			if (i + 1 == data[row].length && (data[row][i] - data[row][i - 1]) == 0) {
//			    tmpData_avgCases.push("NULL")
			//			} else {
			{
			    b = 
				((dataCases[row][i] - dataDeath[row][i] - dataRecoverd[row][i]) - 
				 (dataCases[row][i - 6] - dataDeath[row][i - 6] - dataRecoverd[row][i - 6])) /7;
			    

			    if ( b >=0) {
				tmpData_avgCases.push(b)
			    } else {
				tmpData_avgCases.push(0)
			    }
			}
		    }
		}
		if (draw_mode == 3 && doubleInitial < (data[row][start_i + 1] - data[row][start_i])) {
		    doubleInitial = data[row][start_i + 1] - data[row][start_i];
		}
		if (draw_mode == 3 && maxY < (data[row][data[row].length - 1] - data[row][start_i])) {
		    maxY = (data[row][data[row].length - 1] - data[row][start_i]);
		}
		if (draw_mode == 0 || draw_mode == 4 || draw_mode == 6 || draw_mode == 9) {
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
	});
    }
    if (draw_mode == 3) {
	var newCases = doubleInitial;
	for (var i = start_i; i < data[0].length; i++) {
	    newCases = newCases * 1.41421356237309504880;
	    if (newCases < maxY) {
		tmpDouble2Days.push(newCases);
	    }
	}
	myChartData.datasets.push(
	    { label: "CASES DOUBLE 2 DAYS", data: tmpDouble2Days,fill: false,
	      type: "line",
	      borderColor: window.chartColors.gray});
	var newCases = doubleInitial;
	for (var i = start_i; i < data[0].length; i++) {
//	    if (i >= doubleDaysGraphOffset) {
		newCases = newCases * 1.2599210498;
//	    }
	    if (newCases < maxY) {
		tmpDouble3Days.push(newCases);
	    }
	}
	myChartData.datasets.push(
	    { label: "CASES DOUBLE 3 DAYS", data: tmpDouble3Days,fill: false,
	      type: "line",
	      borderColor: window.chartColors.gray});
	var newCases = doubleInitial;
	for (var i = start_i; i < data[0].length; i++) {
	    newCases = newCases * 1.1040895136738;
	    if (newCases < maxY) {
		tmpDoubleOneWeek.push(newCases);
	    }
	}
	myChartData.datasets.push(
	    { label: "CASES DOUBLE 1 Week", data: tmpDoubleOneWeek,fill: false,
	      type: "line",
	      borderColor: window.chartColors.gray});
    }
}
const  myChartOptionsLogarithmicTotalCases =
      {
	  yAxes: [{
	      type: 'logarithmic',
	      ticks: {
		  min: doubleInitial,
		  callback: function (value, index, values) {
		      return Number(value.toString());
	          }
	      },
	      afterBuildTicks: function (chartObj) {
		  chartObj.ticks = [];
		  chartObj.ticks.push(0.1);
		  chartObj.ticks.push(1);
		  chartObj.ticks.push(2);
		  chartObj.ticks.push(3);
		  chartObj.ticks.push(5);
		  chartObj.ticks.push(10);
		  chartObj.ticks.push(20);
		  chartObj.ticks.push(30);
		  chartObj.ticks.push(50);
		  chartObj.ticks.push(100);
		  chartObj.ticks.push(200);
		  chartObj.ticks.push(300);
		  chartObj.ticks.push(500);
		  chartObj.ticks.push(1000);
		  chartObj.ticks.push(2000);
		  chartObj.ticks.push(3000);
		  chartObj.ticks.push(5000);
		  chartObj.ticks.push(10000);
		  chartObj.ticks.push(20000);
		  chartObj.ticks.push(30000);
		  chartObj.ticks.push(50000);
		  chartObj.ticks.push(100000);
		  chartObj.ticks.push(200000);
		  chartObj.ticks.push(300000);
		  chartObj.ticks.push(500000);
		  chartObj.ticks.push(1000000);
		  chartObj.ticks.push(2000000);
		  chartObj.ticks.push(3000000);
		  chartObj.ticks.push(5000000);
	      }
	  }],
      };

const  myChartOptionsLogarithmic =
      {
	  yAxes: [{
	      type: 'logarithmic',
	      ticks: {
		  min: 0,
		  callback: function (value, index, values) {
		      return Number(value.toString());
	          }
	      },
	      afterBuildTicks: function (chartObj) {
		  chartObj.ticks = [];
		  chartObj.ticks.push(0.1);
		  chartObj.ticks.push(1);
		  chartObj.ticks.push(2);
		  chartObj.ticks.push(3);
		  chartObj.ticks.push(5);
		  chartObj.ticks.push(10);
		  chartObj.ticks.push(20);
		  chartObj.ticks.push(30);
		  chartObj.ticks.push(50);
		  chartObj.ticks.push(100);
		  chartObj.ticks.push(200);
		  chartObj.ticks.push(300);
		  chartObj.ticks.push(500);
		  chartObj.ticks.push(1000);
		  chartObj.ticks.push(2000);
		  chartObj.ticks.push(3000);
		  chartObj.ticks.push(5000);
		  chartObj.ticks.push(10000);
		  chartObj.ticks.push(20000);
		  chartObj.ticks.push(30000);
		  chartObj.ticks.push(50000);
		  chartObj.ticks.push(100000);
		  chartObj.ticks.push(200000);
		  chartObj.ticks.push(300000);
		  chartObj.ticks.push(500000);
		  chartObj.ticks.push(1000000);
		  chartObj.ticks.push(2000000);
		  chartObj.ticks.push(3000000);
		  chartObj.ticks.push(5000000);
	      }
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
    if (yaxesType == "Logarithmic") {
	if (draw_mode == 3) {
	    myChartOptions = {
		scales: myChartOptionsLogarithmicTotalCases,
	    };
	} else {
	    myChartOptions = {
		scales: myChartOptionsLogarithmic,
	    };
	}
    } else {
	myChartOptions = {
	    scales: myChartOptionsLinear,
	};
    }
    // 4)chart.jsで描画
    var ctx = document.getElementById("myChart").getContext("2d");
    window.myChart = new Chart(ctx, {
	type: 'bar',
	data: myChartData,
	options: myChartOptions,
    });
}

function reformatToyoKeizaiData2CSSEGISandData(tdata, pref, i, type) {
    var a = tdata["prefectures-data"][i][type]["values"];
    var s = 0;
    for (var l = 0; l < a.length; l++) {
	a[l] = parseInt(a[l]) + s;
	s = a[l];
    }
    var from = tdata["prefectures-data"][i][type]["from"];
    targetStartDay = from[0] + "/" + from[1] + "/" + from[2];
    offsetdays = (dateParse(targetStartDay) -
		  dateParse(dataStartDay)) / 1000/ 60 / 60 /24;
    for (var j = 1; j <= offsetdays; j++) {
	a.splice(0, 0, 0);
    }
    a.splice(0, 0, 0);
    a.splice(0, 0, 0);
    a.splice(0, 0, 0);
    a.splice(0, 0, pref);
    return a;
}

function parseToyoKeizaiData(data) {
    const tdata = JSON.parse(data);
    tdata["prefectures-map"].forEach(function(p) {
	const pref = p["en"];
	var i = p["code"] - 1;
	dataDeath.push(reformatToyoKeizaiData2CSSEGISandData(tdata, pref, i, "deaths"));
	dataRecoverd.push(reformatToyoKeizaiData2CSSEGISandData(tdata, pref, i, "discharged"));
	dataCasesToyokeizai.push(reformatToyoKeizaiData2CSSEGISandData(tdata, pref, i, "carriers"));
    });
}

function updateBarChart(draw_mode) {
  // 3)chart.jsのdataset用の配列を用意
    updateData(draw_mode)
    // 4)chart.jsで描画
    updateLocationHash();
    window.myChart.update();
}

flatpickr('#calendar', {
//    mode: "range",
    minDate: dataStartDay,
    maxDate: "today",
    dateFormat: "Y-m-d",
    defaultDate: start_date,
}
	 );

function getUpdateDate(url, elementId) {
    var req = new XMLHttpRequest();
    var update_str;
    req.open("GET", rawUrl2UpdateDate(url), true);
    req.onload = function() {
	if (req.status == 403) {
	    var update_date = document.getElementById(elementId);
	    update_date.innerHTML = "can't get update time";
	    return;
	}
	update_str = JSON.parse(req.responseText)[0].commit.committer.date;
	var ts = Date.parse(update_str);
	ts = parseInt(ts) + getTzOffset() * 60 * 60;
	const dt = new Date(ts);
	var update_date = document.getElementById(elementId);
	update_date.innerHTML = dt;
    }
    req.send(null);
}

function rawUrl2UpdateDate(url) {
    var s = url.split("/", 7);
    return  "https://api.github.com/repos/" + s[3] + "/" + s[4] +"/commits?path=" + s[6].replace("/", "%2F") + "&page=1&per_page=1";
}

function readCsv(filePath, csvFunc, id) {
    return new Promise(function (resolve, reject) {
	var req = new XMLHttpRequest();
	req.open("GET", filePath, true);
	req.onload = function() {
	    // 2) CSVデータ変換の呼び出し
	    csvFunc(req.responseText);
	    var loading_str = document.getElementById("loading_str");
	    loadFiles++;
	    loading_str.innerHTML = "loading data from GitHub("+loadFiles+"/9)...";
	    
	    resolve();
	}
	req.timeout = 30*1000;
	req.onerror = function() {
	    alert("data loading error.\n eload page");
	    location.reload();
	}
	req.ontimeout = function() {
	    alert("data loading timeout.\nreload page");
	    location.reload();
	}
	req.send(null);
	if (id != "") {
	    getUpdateDate(filePath, id);
	}
    });
}

function readToyoKeizai(filePath, id) {
    return new Promise(function (resolve, reject) {
	var req = new XMLHttpRequest();
	req.open("GET", filePath, true);
	req.onload = function() {
	    // 2) CSVデータ変換の呼び出し
	    parseToyoKeizaiData(req.responseText);
	    var loading_str = document.getElementById("loading_str");
	    loadFiles++;
	    loading_str.innerHTML = "loading data from GitHub("+loadFiles+"/9)...";
	    
	    resolve();
	}
	req.timeout = 30*1000;
	req.onerror = function() {
	    alert("data loading error.\n eload page");
	    location.reload();
	}
	req.ontimeout = function() {
	    alert("data loading timeout.\nreload page");
	    location.reload();
	}
	req.send(null);
	if (id != "") {
	    getUpdateDate(filePath, id);
	}
    });
}

function updateStartDay() {
    var ts = dateParse(start_date);
    var ts_start = dateParse(dataStartDay);
    ts = parseInt((ts - ts_start) /1000 / 60 / 60 / 24) + 4; // 4 is pre cell
    start_day = parseInt(ts);
}

async function main() {
    Promise.all([
	readCsv('https://raw.githubusercontent.com/sanpei3/covid19jp/master/time_series_covid19_confirmed_Japan.csv',
		csv2Array,
		"update_date_jp"),
    // 1) ajaxでCSVファイルをロード
	readCsv('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv',
		csv2ArrayGlobal,
		"update_date_global"),
	readCsv('https://raw.githubusercontent.com/sanpei3/covid19jp/master/time_series_covid19_confirmed_US_State.csv',
		csv2ArrayUSState,
		"update_date_us_state"),
	readCsv('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv',
		csv2ArrayUSCounty,
		""),
	readCsv('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv',
		csv2ArrayGlobalDeath,
		""),
	readCsv('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_US.csv',
		csv2ArrayUSCountyDeath,
		""),
	readCsv('https://raw.githubusercontent.com/sanpei3/covid19jp/master/time_series_covid19_deaths_US_State.csv',
		csv2ArrayUSStateDeath,
		""),
	readCsv('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv',
		csv2ArrayGlobalRecoverd,
		""),
	readCsv('polulation.csv',
		csv2ArrayJpPopulation,
		""),
	readToyoKeizai('https://raw.githubusercontent.com/kaz-ogiwara/covid19/master/data/data.json',
		       "toyokeizai_data"),
    ])
	.then(results => {
	    // copy header field from dataCaseJAG to dataCasesToyokeizai
	    for (var row in dataCasesJAG) {
		if (dataCasesJAG[row][0] == "Province/State") {
		    dataCasesToyokeizai.unshift(dataCasesJAG[row]);
		    break;
		}
	    }
	    dataCases = dataCasesJAG;
	    updateStartDay();
	}).then(results => {
	    initialize();
	}).then(results => {
	    var loadingId = document.getElementById("loading");
	    loadingId.remove();
	    drawBarChart(draw_mode);
	});
}




function updateGraphButtons(draw_mode, new_draw_mode) {
    var color = "";
    for (i = 0; i < graphTable.length; i++) {
	if (new_draw_mode == i) {
	    color = 'red';
	} else if (draw_mode == i) {
	    color = 'white';
	} else {
	    continue;
	}
	var element = document.getElementById(graphTable[i]);element.style.backgroundColor = color;
    }
}

function updateYAxesButtons() {
    if (yaxesType == "Linear") {
	var element = document.getElementById("linear");
	element.style.backgroundColor = 'skyblue';
	var element = document.getElementById("logarithmic");
	element.style.backgroundColor = 'white';
    } else {
	var element = document.getElementById("logarithmic");
	element.style.backgroundColor = 'skyblue';
	var element = document.getElementById("linear");
	element.style.backgroundColor = 'white';
    }
}
graphTable.forEach(function(val) {
    document.getElementById(val).addEventListener('click', ()=> {
	for (var i = 0; i < graphTable.length; i++) {
	    if (graphTable[i] == val) {
		if (draw_mode != i) {
		    var destroyFlag = false;
		    if ((i == 9 || i == 10) && yaxesType == "Logarithmic") {
			myChart.destroy();
			yaxesType = "Linear";
			updateLocationHash();
			updateYAxesButtons();
			destroyFlag = true;
		    }
		    if (draw_mode == 3 && yaxesType == "Logarithmic") {
			myChart.destroy();
			destroyFlag = true;
		    }
		    updateGraphButtons(draw_mode, i)
		    draw_mode = i;
		    if (destroyFlag) {
			drawBarChart(draw_mode);
		    } else {
			updateBarChart(draw_mode);
		    }

		}
	    }
	}
    });
});

function func2() {
    start_date = document.getElementById("calendar").value;
    updateStartDay();
    updateBarChart(draw_mode);
}

document.getElementById("calendar")
    .addEventListener("change", function(event) {
	func2();
    });

var keyupStack = [];
document.getElementById("addbutton")
    .addEventListener("keyup", function(event) {
	keyupStack.push(1);
	setTimeout(function () {
	    keyupStack.pop();
	    if (event.keyCode === 13) {
		addButtonByFrom();
		var list = document.getElementById('list');
		list.textContent = null;
		return;
	    }
	    // 最後にkeyupされてから一定時間次の入力がなかったら実行
	    if (keyupStack.length === 0) {
		if (this.value == "") {
		    var list = document.getElementById('list');
		    list.textContent = null;
		    return;
		}
		// 部分一致を可能にする(例: .*a.*b.*c.*)
		var buf = '.*' + this.value.replace(/(.)/g, "$1.*");
		var reg = new RegExp(buf, "i");
		
		var filteredLists = psccKeys.filter(function (d) {
		    return reg.test(d);
		});
		createRow(filteredLists);
	    }
	}.bind(this), 300);
	//	event.preventDefault();
    });

function clearList() {
    var list = document.getElementById('list');
    list.textContent = null;
    document.addbuttonFrom.reset();
}
//document.getElementById("addbuttonFrom")
//    .addEventListener( "blur", function(event) {
//	var list = document.getElementById('list');
//	list.textContent = null;
//    });

var createRow = function (lists) {
    var list = document.getElementById('list');
    list.textContent = null;
    lists.forEach(function (l) {
	var li = document.createElement('li');
	const addButton = document.createElement('input');
	addButton.classList.add('addition');
	addButton.type = 'button';
	var addButtonId = l + "_add";
	addButton.id = addButtonId;
	addButton.value = l;
	li.appendChild(addButton);
	list.appendChild(li);
	document.getElementById(addButtonId).addEventListener('click', ()=> {
	    var pref = addButtonId.replace(/_add/, "");
	    addButtonMain(pref);
	    var list = document.getElementById('list');
	    list.textContent = null;
	}, false);
	
    });
};

function addButtonMain(c) {
    // table にあるか確認なければアラート
    var findFlag = false;
    psccKeys.forEach(function(pscc) {
	if (pscc == c) {
	    findFlag = true;
	    return;
	}
    });
    if (findFlag == false) {
	alert(c +": no such area(prefecture, state, county, country");
	return;
    }
    findFlag = false;
    // すでに追加済みならば、アラート
    pref_table.forEach(function(val) {
	const pref = val.pref;
	if (pref == c) {
	    findFlag = true;
	    return;
	}
    });
    if (findFlag == true) {
	alert(c +": Already added");
	return;
    }
    if (c == "") {
	return;
    }
    // あれば、ボタン追加して、有効
    showFlag[c] = true;
    prefColor[c] = colorTable[colorIndex % colorTable.length];
    colorIndex = colorIndex + 1;
    createButton(c, prefColor[c]);
    pref_table.push(
		{
		    pref: c,
		    defaultenable: true,
		});
    addPref.push(c);
    showFlagAlreadySet = true;
    updateLocationHash();
    updateBarChart(draw_mode);
    document.addbuttonFrom.reset();
}
function addButtonByFrom() {
    var c = document.getElementById("addbutton").value;
    addButtonMain(c);
    var list = document.getElementById('list');
    list.textContent = null;
}



document.getElementById('AllClear').addEventListener('click', function() {
    pref_table.forEach(function(val) {
	const pref = val.pref;
	showFlagAlreadySet = true;
	updateLocationHash();
	if (showFlag[pref]) {
	    var element = document.getElementById(pref);
	    element.style.backgroundColor = 'white';
	    showFlag[pref] = false;
	}
    });
    updateBarChart(draw_mode);
});
document.getElementById('linear').addEventListener('click', function() {
    if (yaxesType != "Linear") {
	myChart.destroy();
	yaxesType = "Linear";
	updateLocationHash();
	updateYAxesButtons();
	drawBarChart(draw_mode);
    }
});

document.getElementById('logarithmic').addEventListener('click', function() {
    if (yaxesType != "Logarithmic" && (draw_mode != 9 || draw_mode != 10)) {
	myChart.destroy();
	yaxesType = "Logarithmic";
	updateLocationHash();
	updateYAxesButtons();
	drawBarChart(draw_mode);
    }
});
function updateDataSourceButtons() {
    if (JapanDataSource == "JAG") {
	var element = document.getElementById("JAG");
	element.style.backgroundColor = 'skyblue';
	var element = document.getElementById("ToyoKeizai");
	element.style.backgroundColor = 'white';
	dataCases = dataCasesJAG;
    } else {
	var element = document.getElementById("JAG");
	element.style.backgroundColor = 'white';
	var element = document.getElementById("ToyoKeizai");
	element.style.backgroundColor = 'skyblue';
	dataCases = dataCasesToyokeizai;
    }
}

document.getElementById('JAG').addEventListener('click', function() {
    if (JapanDataSource != "JAG") {
	myChart.destroy();
	JapanDataSource = "JAG";
	dataCases = dataCasesJAG;
	updateLocationHash();
	updateDataSourceButtons();
	drawBarChart(draw_mode);
    }
});

document.getElementById('ToyoKeizai').addEventListener('click', function() {
    if (JapanDataSource != "ToyoKeizai") {
	myChart.destroy();
	JapanDataSource = "ToyoKeizai";
	dataCases = dataCasesToyokeizai;
	updateLocationHash();
	updateDataSourceButtons();
	drawBarChart(draw_mode);
    }
});

main();
