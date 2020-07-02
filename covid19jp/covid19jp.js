// 2) CSVから２次元配列に変換

var dataStartDay;
var data = [];
var dataCases = [];
var dataDeath = [];
var dataRecoverd = [];
var yaxesType = "Linear";
var draw_mode = 0;
var start_day = 130;
var start_date = "2020-05-20";
var showFlag = {};
var showFlagAlreadySet = false;
var addPref = [];
var rowForDataDeath = 0;
var rowForDataRecoverd = 0;

const colorTable = [
    "purple",
    "grey",
    "blue",
    "orange",
//    "navy",
    "silver",
];

const graphTable = ["daily_new_cases",
		    "double_days",
		    "k_value",
		    "total_cases",
		    "daily_deaths",
		    "total_deaths",
		    "daily_recoverd",
		    "total_recoverd",
		    "current_number_of_patients",
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
	    defaultenable: true,
	    color: window.chartColors.yellow,
	},
	{
	    pref: "Fukuoka",
	    defaultenable: false
	},
	{
	    pref: "Ibaraki",
	    defaultenable: false,
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
	    pref: "Hokkaido",
	    defaultenable: false,
	},
	{
	    pref: "Japan",
	    defaultenable: true,
	},
	{
	    pref: "US",
	    defaultenable: true,
	},
	{
	    pref: "China",
	    defaultenable: false,
	},
	{
	    pref: "India",
	    defaultenable: true,
	},
	{
	    pref: "Brazil",
	    defaultenable: true,
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
	    defaultenable: true,
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

async function initialize() {
    var urlHash = location.hash.replace(/^#/, "").split(/&/);
    
    await urlHash.forEach(function(i) {
	var s = i.split(/=/, 2);
	if (s[0] == "dm") {
	    draw_mode = s[1];
	    updateGraphButtons(0, draw_mode)
	} else if (s[0] == "sd") {
	    start_date = s[1]
	} else if (s[0] == "ya") {
	    yaxesType = s[1];
	    updateYAxesButtons();
	} else if (s[0] == "c") {
	    showFlagAlreadySet = true;
	    var cs = s[1].split(/,/);
	    cs.forEach(function(c) {
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
    document.body.appendChild(addButton);
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
});
}
initialize();

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
    window.location.hash = "dm=" + draw_mode + "&sd=" + start_date + "&ya=" + yaxesType + cs + ds;
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
	var cells = lines[i].split(",");
	if (cells[0] == "Province/State") {
	    dataStartDay = mmddyy2yymmmdd(cells[4]);
	}
	dataCases.push(cells);
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
	var cells = lines[i].split(",");
	// dataStartDay との差分だけ、4コメからの先に配列の先頭にダミーを入れる
	if (cells[0] == "Province/State") {
	    targetStartDay = mmddyy2yymmmdd(cells[4]);
	    offsetdays = (dateParse(targetStartDay) -
			  dateParse(dataStartDay)) / 1000/ 60 / 60 /24;
	}
	if (cells[0] == "") {
	    cells[0] = cells[1];
	    for (var j = 1; j <= offsetdays; j++) {
		cells.splice(4, 0, 0);
	    }
	    dataCases.push(cells);
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
    dataCases.push(cellsChina);
    dataCases.push(cellsCanada);
    dataCases.push(cellsAustralia);
    return;
}

function csv2ArrayGlobalDeath(str) {
    var lines = str.split("\n");
    var offsetdays = 0;
    var cellsChina = [];
    var cellsCanada = [];
    var cellsAustralia = [];
    for (var i = 0; i < lines.length; ++i) {
	var cells = lines[i].split(",");
	// dataStartDay との差分だけ、4コメからの先に配列の先頭にダミーを入れる
	if (cells[0] == "Province/State") {
	    targetStartDay = mmddyy2yymmmdd(cells[4]);
	    offsetdays = (dateParse(targetStartDay) -
			  dateParse(dataStartDay)) / 1000/ 60 / 60 /24;
	}
	if (cells[0] == "") {
	    cells[0] = cells[1];
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
	var cells = lines[i].split(",");
	// dataStartDay との差分だけ、4コメからの先に配列の先頭にダミーを入れる
	if (cells[0] == "Province/State") {
	    targetStartDay = mmddyy2yymmmdd(cells[4]);
	    offsetdays = (dateParse(targetStartDay) -
			  dateParse(dataStartDay)) / 1000/ 60 / 60 /24;
	    continue;
	}
	if (cells[0] != "Province/State") {
	    cells[0] = cells[0] + "_US";
	}
	for (var j = 1; j <= offsetdays; j++) {
	    cells.splice(4, 0, 0)
	}
	dataCases.push(cells);
    }
    return;
}

function csv2ArrayUSStateDeath(str) {
    var lines = str.split("\n");
    var offsetdays = 0;
    for (var i = 0; i < lines.length; ++i) {
	var cells = lines[i].split(",");
	// dataStartDay との差分だけ、4コメからの先に配列の先頭にダミーを入れる
	if (cells[0] == "Province/State") {
	    targetStartDay = mmddyy2yymmmdd(cells[4]);
	    offsetdays = (dateParse(targetStartDay) -
			  dateParse(dataStartDay)) / 1000/ 60 / 60 /24;
	    continue;
	}
	if (cells[0] != "Province/State") {
	    cells[0] = cells[0] + "_US";
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
	var cells = lines[i].split(",");
	// dataStartDay との差分だけ、4コメからの先に配列の先頭にダミーを入れる
	if (cells[0] == "UID") {
	    targetStartDay = mmddyy2yymmmdd(cells[11]);
	    offsetdays = (dateParse(targetStartDay) -
			  dateParse(dataStartDay)) / 1000/ 60 / 60 /24;
	    continue;
	}
	if (cells[0] != "UID") {
	    cells[0] = cells[5] + "_" + cells[6] + "_US";
	    cells.splice(4, 11 - 1, "0")
	}
	for (var j = 1; j <= offsetdays; j++) {
	    cells.splice(4, 0, 0)
	}
	dataCases.push(cells);
    }
    return;
}

function csv2ArrayUSCountyDeath(str) {
    var lines = str.split("\n");
    var offsetdays = 0;
    for (var i = 0; i < lines.length; ++i) {
	var cells = lines[i].split(",");
	// dataStartDay との差分だけ、4コメからの先に配列の先頭にダミーを入れる
	if (cells[0] == "UID") {
	    targetStartDay = mmddyy2yymmmdd(cells[11]);
	    offsetdays = (dateParse(targetStartDay) -
			  dateParse(dataStartDay)) / 1000/ 60 / 60 /24;
	    continue;
	}
	if (cells[0] != "UID") {
	    cells[0] = cells[5] + "_" + cells[6] + "_US";
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
	var cells = lines[i].split(",");
	// dataStartDay との差分だけ、4コメからの先に配列の先頭にダミーを入れる
	if (cells[0] == "Province/State") {
	    targetStartDay = mmddyy2yymmmdd(cells[4]);
	    offsetdays = (dateParse(targetStartDay) -
			  dateParse(dataStartDay)) / 1000/ 60 / 60 /24;
	}
	if (cells[0] == "") {
	    cells[0] = cells[1];
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
    if (draw_mode == 0) {
	// Daily New cases
	// XX add average graph
	return data[row][i]- data[row][i- 1];
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
    }

}



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
    data = dataCases;
    for (var row in data) {
	// ここで、header行で、lengthが違ったら、追加する
	if (data[row][0] == "Province/State" && headerFlag == true) {
	    if (tmpLabels.length + start_i < data[row].length) {
		for (var i = tmpLabels.length + start_i; i < data[row].length; i++) {
		    tmpLabels.push(data[row][i]);
		}
		myChartData.labels = tmpLabels;
	    }
	}
	if (data[row][0] == "Province/State" && headerFlag == false) {
	    for (var i = start_i; i < data[row].length; i++) {
		tmpLabels.push(data[row][i]);
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
    var doubleInitial = 1;
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
		    for (var r in dataDeath) {
			if (dataDeath[r][0] == pref) {
			    rowForDataDeath = r;
			    break;
			}
		    }
		    for (var r in dataRecoverd) {
			if (dataRecoverd[r][0] == pref) {
			    rowForDataRecoverd = r;
			    break;
			}
		    }
		}
		for (var i = start_i; i < data[row].length; i++) {
		    a = calculate(row, i, draw_mode);
		    if ( a >=0) {
			tmpData.push(a)
		    } else {
			tmpData.push(0)
		    }
		    if (draw_mode == 0 || draw_mode == 4 || draw_mode == 6) {
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
		    if (draw_mode == 9) {
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
	if (true) {
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
	}
	var newCases = doubleInitial;
	for (var i = start_i; i < data[0].length; i++) {
	    newCases = newCases * 1.2599210498;
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
const  myChartOptionsLogarithmic =
      {
	  yAxes: [{
	      type: 'logarithmic',
//	      ticks: {
//		  min: 10, //minimum tick
//		  max: 1000, //maximum tick
//	      },
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
	myChartOptions = {
	    scales: myChartOptionsLogarithmic,
	};
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
	    resolve();
	}
	req.send(null);
	getUpdateDate(filePath, id);
    });
}

function updateStartDay() {
    var ts = dateParse(start_date);
    var ts_start = dateParse(dataStartDay);
    ts = parseInt((ts - ts_start) /1000 / 60 / 60 / 24) + 4; // 4 is pre cell
    start_day = parseInt(ts);
}

async function main() {
    // 1) ajaxでCSVファイルをロード
    await readCsv('https://raw.githubusercontent.com/sanpei3/covid19jp/master/time_series_covid19_confirmed_Japan.csv',
		  csv2Array,
		  "update_date_jp")
    await readCsv('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv',
		  csv2ArrayGlobal,
		  "update_date_global");
    await readCsv('https://raw.githubusercontent.com/sanpei3/covid19jp/master/time_series_covid19_confirmed_US_State.csv',
		  csv2ArrayUSState,
		  "update_date_us_state");
    await readCsv('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv',
		  csv2ArrayUSCounty,
		  "update_date_global");
    await readCsv('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv',
		  csv2ArrayGlobalDeath,
		  "update_date_global");
    await readCsv('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_US.csv',
		  csv2ArrayUSCountyDeath,
		  "update_date_global");
    await readCsv('https://raw.githubusercontent.com/sanpei3/covid19jp/master/time_series_covid19_deaths_US_State.csv',
		  csv2ArrayUSStateDeath,
		  "update_date_us_state");
    await readCsv('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv',
		  csv2ArrayGlobalRecoverd,
		  "update_date_global");
    await updateStartDay();
    await drawBarChart(draw_mode);
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
		    updateGraphButtons(draw_mode, i)
		    draw_mode = i;
		    updateBarChart(draw_mode);
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
    if (yaxesType != "Logarithmic") {
	myChart.destroy();
	yaxesType = "Logarithmic";
	updateLocationHash();
	updateYAxesButtons();
	drawBarChart(draw_mode);
    }
});

main();
