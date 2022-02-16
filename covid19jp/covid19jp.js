// XX ボタン追加
// XX Chart.js scatterのグラフ
// 正方形にする
// 2/3 1/2減少線追加

var dataStartDay = "2020-01-15";
var dataEndDayTokyo = "";
var JapanDataSource = "JAG";
var data = [];
var dataCases = {};
var dataCasesJAG = [];
var dataCasesToyokeizai = [];
var dataCasesNHK = [];
var dataDeath = [];
var dataDeathToyokeizai = [];
var dataDeathNHK = [];
var dataRecoverd = [];
var dataCasesTokyo = [];
var yaxesType = "Logarithmic";
var draw_mode = 0;
var start_day = 130;
var start_date = "2022-01-01";
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
var prefTable = [];
const maxFiles = 10;
const loadingFilesElement = document.getElementById("loadingFiles");

const prefJp2EnTable = {
    "北海道": "Hokkaido",
    "青森県": "Aomori",
    "岩手県": "Iwate",
    "宮城県": "Miyagi",
    "秋田県": "Akita",
    "山形県": "Yamagata",
    "福島県": "Fukushima",
    "茨城県": "Ibaraki",
    "栃木県": "Tochigi",
    "群馬県": "Gunma",
    "埼玉県": "Saitama",
    "千葉県": "Chiba",
    "東京都": "Tokyo",
    "神奈川県": "Kanagawa",
    "新潟県": "Niigata",
    "富山県": "Toyama",
    "石川県": "Ishikawa",
    "福井県": "Fukui",
    "山梨県": "Yamanashi",
    "長野県": "Nagano",
    "岐阜県": "Gifu",
    "静岡県": "Shizuoka",
    "愛知県": "Aichi",
    "三重県": "Mie",
    "滋賀県": "Shiga",
    "京都府": "Kyoto",
    "大阪府": "Osaka",
    "兵庫県": "Hyogo",
    "奈良県": "Nara",
    "和歌山県": "Wakayama",
    "鳥取県": "Tottori",
    "島根県": "Shimane",
    "岡山県": "Okayama",
    "広島県": "Hiroshima",
    "山口県": "Yamaguchi",
    "徳島県": "Tokushima",
    "香川県": "Kagawa",
    "愛媛県": "Ehime",
    "高知県": "Kochi",
    "福岡県": "Fukuoka",
    "佐賀県": "Saga",
    "長崎県": "Nagasaki",
    "熊本県": "Kumamoto",
    "大分県": "Oita",
    "宮崎県": "Miyazaki",
    "鹿児島県": "Kagoshima",
    "沖縄県": "Okinawa",
};


const colorTable = [
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
		    "EARL_graph",                  // 11
//		    "total_cases_per_100000",
		   ];

window.chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};
//
// create table
const pref_table = 
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
	    pref: "Okinawa",
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
	    pref: "Nepal",
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
	    pref: "United Kingdom",
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

function calculateOffsetDays(i, j) {
    return (dateParse(i) -
	    dateParse(j)) / 1000/ 60 / 60 / 24;
}

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
	const element = document.getElementById(pref);
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
    const urlHash = location.hash.replace(/^#/, "").split(/&/);
    
    await urlHash.forEach(function(i) {
	const s = i.split(/=/, 2);
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
	    let cs = s[1].split(/,/);
	    cs.forEach(function(c) {
		c = decodeURI(c);
		let findFlag = false;
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
	    let cs = s[1].split(/,/);
	    cs.forEach(function(c) {
		c = decodeURI(c);
		let findFlag = false;
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
    for (let i in pref_table) {
	const val = pref_table[i];
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
    }
    for (let i in pref_table) {
	const val = pref_table[i];
	const pref = val.pref;
	const gcolor = val.color;
	createButton(pref, gcolor);
    }
}

function updateLocationHash () {
    let cs = "";
    let ds = "";
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
    let dsFlag = false;
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

function mmddyy2yyyymmdd(str) {
    const s = str.split("/");
    return  "20" + s[2] + "/" + s[0] + "/" + s[1];
}

function dateParse(date) {
    return Date.parse(date.replace(/-/g , "/")  + " 00:00:00");
}

function csv2Array(str) {
    return new Promise(function (resolve, reject) {
 	Papa.parse(str, {
	    download: true,
	    worker: true,
	    step: function(row) {
		let cells = row.data;
		if (cells == undefined || cells[0] == undefined) {
		    return;
		}
		if (cells[0] == "Province/State") {
		    //	    dataStartDay = mmddyy2yyyymmdd(cells[4]);
		} else {
		    psccKeys.push(cells[0]);
		    buttonArea[cells[0]] = "prefecture";
		}
		dataCasesJAG.push(cells);
	    },
	    complete: function() {
		loadFiles++;
		loadingFilesElement.innerHTML = loadFiles;
		resolve(str);
	    }
	});
    });
}

function csv2ArrayPopulation(str) {
    return new Promise(function (resolve, reject) {
 	Papa.parse(str, {
	    download: true,
	    worker: true,
	    step: function(row) {
		const cells = row.data;
		if (cells[1] == undefined) {
		    return;
		}
		dataPopulation[cells[0]] = cells[1].replace(",", "");
	    },
	    complete: function() {
		loadFiles++;
		loadingFilesElement.innerHTML = loadFiles;
		resolve(str);
	    }
	});
    });
}

specialCountries = [
    "China",
    "Canada",
    "Australia",
];

function csv2ArrayGlobal(str) {
    return new Promise(function (resolve, reject) {
	let offsetdays = 0;
	let cellTmp = {};
	Papa.parse(str, {
	    download: true,
	    worker: true,
	    step: function(row) {
		let cells = row.data;
		if (cells == undefined || cells[1] == undefined) {
		    return;
		}
		// dataStartDay との差分だけ、4コメからの先に配列の先頭にダミーを入れる
		if (cells[0] == "Province/State") {
		    const targetStartDay = mmddyy2yyyymmdd(cells[4]);
		    offsetdays = calculateOffsetDays(targetStartDay,
						     dataStartDay);
		}
		if (cells[0] == "") {
		    cells[0] = cells[1].replace(",", "");
		    for (let j = 1; j <= offsetdays; j++) {
			cells.splice(4, 0, 0);
		    }
		    dataCasesJAG.push(cells);
		    dataCasesToyokeizai.push(cells);
		    dataCasesNHK.push(cells);
		    psccKeys.push(cells[0]);
		    buttonArea[cells[0]] = "country";
		} else {
		    for (let k in specialCountries) {
			const c = specialCountries[k];
			if (cells[1] == c) {
			    for (let j = 1; j <= offsetdays; j++) {
				cells.splice(4, 0, 0);
			    }
			    if (cellTmp[c] == undefined) {
				cells[0] = cells[1];
				for (let j = 4; j < cells.length; j++) {
				    cells[j] = parseInt(cells[j]);
				}
				cellTmp[c] = cells;
			    } else {
				for (let j = 4; j < cells.length; j++) {
				    cellTmp[c][j] = cellTmp[c][j] + parseInt(cells[j]);
				}
			    }
			}
		    }
		}
	    },
	    complete: function() {
		for (let k in specialCountries) {
		    const c = specialCountries[k];
		    dataCasesJAG.push(cellTmp[c]);
		    dataCasesToyokeizai.push(cellTmp[c]);
		    dataCasesNHK.push(cellTmp[c]);
		    psccKeys.push(c);
		    buttonArea[c] = "country";
		}
		loadFiles++;
		loadingFilesElement.innerHTML = loadFiles;
		resolve(str);
	    }
	});
    });
}

function csv2ArrayGlobalDeath(str) {
    return new Promise(function (resolve, reject) {
	let offsetdays = 0;
	let cellTmp = {};
	Papa.parse(str, {
	    download: true,
	    worker: true,
	    step: function(row) {
		let cells = row.data;
		if (cells == undefined || cells[1] == undefined) {
		    return;
		}
		// dataStartDay との差分だけ、4コメからの先に配列の先頭にダミーを入れる
		if (cells[0] == "Province/State") {
		    const targetStartDay = mmddyy2yyyymmdd(cells[4]);
		    offsetdays = calculateOffsetDays(targetStartDay,
						     dataStartDay);
		}
		if (cells[0] == "") {
		    cells[0] = cells[1].replace(",", "");
		    for (let j = 1; j <= offsetdays; j++) {
			cells.splice(4, 0, 0);
		    }
		    dataDeathToyokeizai.push(cells);
		    dataDeathNHK.push(cells);
		} else {
		    for (let k in specialCountries) {
			const c = specialCountries[k];
			if (cells[1] == c) {
			    for (let j = 1; j <= offsetdays; j++) {
				cells.splice(4, 0, 0);
			    }
			    if (cellTmp[c] == undefined) {
				cells[0] = cells[1];
				for (let j = 4; j < cells.length; j++) {
				    cells[j] = parseInt(cells[j]);
				}
				cellTmp[c] = cells;
			    } else {
				for (let j = 4; j < cells.length; j++) {
				    cellTmp[c][j] = cellTmp[c][j] + parseInt(cells[j]);
				}
			    }
			}
		    }
		}
	    },
	    complete: function() {
		for (let k in specialCountries) {
		    const c = specialCountries[k];
		    dataDeathToyokeizai.push(cellTmp[c]);
		    dataDeathNHK.push(cellTmp[c]);
		}
		loadFiles++;
		loadingFilesElement.innerHTML = loadFiles;
		resolve(str);
	    }
	});
    });
}

function csv2ArrayUSCounty(str) {
    return new Promise(function (resolve, reject) {
	let offsetdays = 0;
	let cellTmp = {};
	let states = {};
	Papa.parse(str, {
	    download: true,
	    worker: true,
	    step: function(row) {
		let cells = row.data;
		if (cells[6] == undefined) {
		    return;
		}
		// dataStartDay との差分だけ、4コメからの先に配列の先頭にダミーを入れる
		if (cells[0] == "UID") {
		    const targetStartDay = mmddyy2yyyymmdd(cells[11]);
		    offsetdays = calculateOffsetDays(targetStartDay,
						     dataStartDay);
		    return;
		}
		const s = cells[6].replace(",", "") + "_US";
		cells[0] = cells[5].replace(",", "") + "_" + s;
		psccKeys.push(cells[0]);
		buttonArea[cells[0]] = "us_county";
		cells.splice(4, 10, "0")
		for (let j = 1; j <= offsetdays; j++) {
		    cells.splice(4, 0, 0);
		}
		dataCasesJAG.push(cells);
		dataCasesToyokeizai.push(cells);
		dataCasesNHK.push(cells);
		if (states[s] == undefined) {
		    let c = cells.slice();
		    c[0] = s;
		    for (let j = 4; j < cells.length; j++) {
			c[j] = parseInt(c[j]);
		    }
		    cellTmp[s] = c;
		    states[s] = true;
		    buttonArea[s] = "us_state";
		    psccKeys.push(s);
		} else {
		    for (let j = 4; j < cells.length; j++) {
			cellTmp[s][j] = cellTmp[s][j] + parseInt(cells[j]);
		    }
		}
	    },
	    complete: function() {
		for (let c in states) {
		    dataCasesJAG.push(cellTmp[c]);
		    dataCasesToyokeizai.push(cellTmp[c]);
		    dataCasesNHK.push(cellTmp[c]);
		}
		loadFiles++;
		loadingFilesElement.innerHTML = loadFiles;
		resolve(str);
	    }
	});
    });
}

function csv2ArrayUSCountyDeath(str) {
    return new Promise(function (resolve, reject) {
	let offsetdays = 0;
	let cellTmp = {};
	let states = {};
	Papa.parse(str, {
	    download: true,
	    worker: true,
	    step: function(row) {
		let cells = row.data;
		if (cells[6] == undefined) {
		    return;
		}
		// dataStartDay との差分だけ、4コメからの先に配列の先頭にダミーを入れる
		if (cells[0] == "UID") {
		    const targetStartDay = mmddyy2yyyymmdd(cells[11]);
		    offsetdays = calculateOffsetDays(targetStartDay,
						     dataStartDay);
		    return;
		}
		const s = cells[6].replace(",", "") + "_US";
		cells[0] = cells[5].replace(",", "") + "_" + s;
		cells.splice(4, 10, "0")
		for (let j = 1; j <= offsetdays; j++) {
		    cells.splice(4, 0, 0);
		}
		dataDeathToyokeizai.push(cells);
		dataDeathNHK.push(cells);
		if (states[s] == undefined) {
		    let c = cells.slice();
		    c[0] = s;
		    for (let j = 4; j < cells.length; j++) {
			c[j] = parseInt(c[j]);
		    }
		    cellTmp[s] = c;
		    states[s] = true;
		} else {
		    for (let j = 4; j < cells.length; j++) {
			cellTmp[s][j] = cellTmp[s][j] + parseInt(cells[j]);
		    }
		}
	    },
	    complete: function() {
		for (let c in states) {
		    dataDeathToyokeizai.push(cellTmp[c]);
		    dataDeathNHK.push(cellTmp[c]);
		}
		loadFiles++;
		loadingFilesElement.innerHTML = loadFiles;
		resolve(str);
	    }
	});
    });
}

function csv2ArrayGlobalRecoverd(str) {
    return new Promise(function (resolve, reject) {
	let offsetdays = 0;
	let cellTmp = {};
	Papa.parse(str, {
	    download: true,
	    worker: true,
	    step: function(row) {
		let cells = row.data;
		if (cells == undefined || cells[1] == undefined) {
		    return;
		}
		// dataStartDay との差分だけ、4コメからの先に配列の先頭にダミーを入れる
		if (cells[0] == "Province/State") {
		    const targetStartDay = mmddyy2yyyymmdd(cells[4]);
		    offsetdays = calculateOffsetDays(targetStartDay,
						     dataStartDay);
		}
		if (cells[0] == "") {
		    cells[0] = cells[1].replace(",", "");
		    for (let j = 1; j <= offsetdays; j++) {
			cells.splice(4, 0, 0);
		    }
		    dataRecoverd.push(cells);
		} else {
		    for (let k in specialCountries) {
			const c = specialCountries[k];
			if (cells[1] == c) {
			    for (let j = 1; j <= offsetdays; j++) {
				cells.splice(4, 0, 0);
			    }
			    if (cellTmp[c] == undefined) {
				cells[0] = cells[1];
				for (let j = 4; j < cells.length; j++) {
				    cells[j] = parseInt(cells[j]);
				}
				cellTmp[c] = cells;
			    } else {
				for (let j = 4; j < cells.length; j++) {
				    cellTmp[c][j] = cellTmp[c][j] + parseInt(cells[j]);
				}
			    }
			}
		    }
		}
	    },
	    complete: function() {
		for (let k in specialCountries) {
		    const c = specialCountries[k];
		    if (cellTmp[c] != undefined) { // check for Canada
			dataRecoverd.push(cellTmp[c]);
		    }
		}
		loadFiles++;
		loadingFilesElement.innerHTML = loadFiles;
		resolve(str);
	    }
	});
    });
}

function getTzOffset() {
    const date = new Date();
    return tzoff = (date.getHours() - date.getUTCHours() + 24) % 24;
}
function normalizeVariable(i) {
    return Math.floor(i * 100) / 100;
}




var color = Chart.helpers.color;
var tmpLabels = [], tmpData = [];
var tmpData_avgCases = [];
var tmpDoubleEvery = [], tmpDouble2Days = [], tmpDouble3Days = [],
    tmpDoubleOneWeek =[];

function updateData(draw_mode) {
    const start_i = start_day;
    let doubleInitial = 100;
    myChartData.datasets = [];
    let tmpLabels = [];
    let tmpDoubleEvery = [];
    let tmpDouble2Days = [];
    let tmpDouble3Days = [];
    let tmpDoubleOneWeek =[];
    let headerFlag = false;
    data = dataCases;
    for (let row in data) {
	// ここで、header行で、lengthが違ったら、追加する
	if (data[row][0] == "Province/State" && headerFlag == true) {
	    if (tmpLabels.length + start_i < data[row].length) {
		let d = 1;
		for (let i = tmpLabels.length + start_i; i < data[row].length; i++) {
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
	    let d = 1;
	    for (let i = start_i; i < data[row].length; i++) {
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
    if (draw_mode <= 3 || draw_mode == 11) {
	data = dataCases;
    } else if (draw_mode >= 4 && draw_mode <= 5) {
	data = dataDeath;
    } else if (draw_mode >= 6 && draw_mode <= 7) {
	data = dataRecoverd;
    } else if (draw_mode == 8) {
	data = data;
    }
    let doubleDaysGraphOffset = 0;
    let maxY = 0;
    for (let row in data) {
	for (let j in pref_table) {
	    const val = pref_table[j];
	    const pref = val.pref;
	    const defaultenable = val.defaultenable;
	    const gcolor = prefColor[pref];
	    if (data[row][0] == pref && showFlag[pref]) {
		tmpData = [];
		tmpData_avgCases = [];
		if (draw_mode == 8) {
		    // find row for dataDeath and dataRecoverd
		    rowForDataDeath = 0;
		    rowForDataRecoverd = 0;
		    let findDeathFlag = false;
		    for (let r in dataDeath) {
			if (dataDeath[r][0] == pref) {
			    rowForDataDeath = r;
			    findDeathFlag = true;
			    break;
			}
		    }
		    let findRevocerdFlag = false;
		    for (let r in dataRecoverd) {
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
		let c = 0;
		for (let i = start_i; i < data[row].length; i++) {
		    var a;
		    let c = 0;
		    if (draw_mode == 0 || draw_mode == 9 ) {
			// Daily New cases
			// XX add average graph
			const j = data[row][i]- data[row][i- 1];
			c = dataPopulation[data[row][0]];
			if (draw_mode == 9 &&  c != 0) {
			    a = normalizeVariable(j / c * 100000);
			} else {
			    a = j;
			}
		    } else if (draw_mode == 1) {
			// Double Days
			let avgD = 0;
			for (let j = 0; j >= -6; j--){
			    const days = 6;
			    let d = days * Math.log(2.0, 2.0) / Math.log((data[row][i + j] - data[row][start_day + j])/ (data[row][i - days + j]- data[row][start_day + j]), 2.0);
			    avgD = avgD + d;
			}
			avgD = avgD / 7;
			if (isNaN(avgD) || avgD == Infinity) {
			    a = 0;
			} else {
			    a = normalizeVariable(avgD);
			}
		    } else if (draw_mode == 2) {
			// K value
			const k = 1 - (data[row][i- 7] - data[row][start_day])/(data[row][i] - data[row][start_day]);
			if (isNaN(k) || k == Infinity || i - 7 < start_day) {
			    a = 0;
			} else {
			    a = k
			}
		    } else if (draw_mode == 3) {
			// Total cases
			a = data[row][i] - data[row][start_day];
		    } else if (draw_mode == 4) {
			// Total cases
			a = data[row][i]- data[row][i- 1];
		    } else if (draw_mode == 5) {
			// Total cases
			a = data[row][i] - data[row][start_day];
		    } else if (draw_mode == 6) {
			// Total cases
			a = data[row][i]- data[row][i- 1];
		    } else if (draw_mode == 7) {
			// Total cases
			a = data[row][i] - data[row][start_day];
		    } else if (draw_mode == 8) {
			// Total cases
			if (rowForDataDeath != 0 && rowForDataRecoverd != 0) {
			    a = dataCases[row][i] - dataDeath[rowForDataDeath][i] - dataRecoverd[rowForDataRecoverd][i];
			} else {
			    a = 0;
			}
		    } else if (draw_mode == 10) {
			// Effective Reproduction Number
			const r = normalizeVariable(((data[row][i] - data[row][i - 6]) /
						     (data[row][i - 7] - data[row][i - 7 - 6])) ** (5.0/7.0));
			if (isNaN(r) || r == Infinity || i - 7 - 6 < start_day) {
			    a = 0;
			} else {
			    a = r
			}
		    } else if (draw_mode == 11) {
			var thisNewCases = 0;
			var lastNewCases = 0;
			//  10 10-8 = 2--> 10 と 2 の間-->
			// 10 9 8 7 6 5 4 3 2
			thisNewCases = data[row][i] - data[row][i - 7];
			lastNewCases = data[row][i - 7] - data[row][i - 14];
			a = { x: lastNewCases, y: thisNewCases};
			if (maxY < thisNewCases) {
			    maxY = thisNewCases;
			}
			tmpData.push(a);
		    }
		    if (draw_mode == 3) {
			if (doubleDaysGraphOffset != 0 && a < doubleInitial) {
			    continue;
			} else if (a < doubleInitial) {
			    continue;
//			    a = doubleInitial;
			}
		    }
		    if (draw_mode != 11) {
			if (a >= 0) {
			    tmpData.push(a)
			} else {
			    tmpData.push(0)
			}
		    }
		    if (draw_mode == 3 && doubleInitial < (data[row][i] - data[row][start_day]) && doubleDaysGraphOffset == 0) {
			doubleDaysGraphOffset = i;
		    }
		    if (draw_mode == 0 || draw_mode == 4 || draw_mode == 6 || draw_mode == 9) {
			if (i + 1 == data[row].length && (data[row][i] - data[row][i - 1]) == 0) {
			    tmpData_avgCases.push("NULL")
			} else {
			    let b = normalizeVariable((data[row][i] - data[row][i - 7]) / 7);
			    c = dataPopulation[data[row][0]];
			    if (draw_mode == 9 && c != 0) {
				b = normalizeVariable(b / c * 100000);
			    }
			    if (b >= 0) {
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
	}
    }
    if (draw_mode == 3) {
	let newCases = doubleInitial;
	for (let i = start_i; i < data[0].length; i++) {
	    newCases = newCases * 1.41421356237309504880;
	    if (newCases < maxY) {
		tmpDouble2Days.push(newCases);
	    }
	}
	myChartData.datasets.push(
	    { label: "CASES DOUBLE 2 DAYS", data: tmpDouble2Days,fill: false,
	      type: "line",
	      borderColor: window.chartColors.gray});
	newCases = doubleInitial;
	for (let i = start_i; i < data[0].length; i++) {
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
	newCases = doubleInitial;
	for (let i = start_i; i < data[0].length; i++) {
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
    if (draw_mode == 11) {

	let tmp5OneWeek =[];
	tmp5OneWeek.push({ x: 0, y: 0});
	tmp5OneWeek.push({ x: maxY/5, y: maxY});
	myChartData.datasets.push(
	    { label: "CASES 5times/ 1 Week", data: tmp5OneWeek,fill: false,
	      type: "line",
	      borderColor: window.chartColors.gray});
	let tmp3OneWeek =[];
	tmp3OneWeek.push({ x: 0, y: 0});
	tmp3OneWeek.push({ x: maxY/3, y: maxY});
	myChartData.datasets.push(
	    { label: "CASES 3times/1 Week", data: tmp3OneWeek,fill: false,
	      type: "line",
	      borderColor: window.chartColors.gray});

	tmpDoubleOneWeek.push({ x: 0, y: 0});
	tmpDoubleOneWeek.push({ x: maxY/2, y: maxY});
	myChartData.datasets.push(
	    { label: "CASES DOUBLE 1 Week", data: tmpDoubleOneWeek,fill: false,
	      type: "line",
	      borderColor: window.chartColors.gray});

	let tmp1_5OneWeek =[];
	tmp1_5OneWeek.push({ x: 0, y: 0});
	tmp1_5OneWeek.push({ x: maxY/1.5, y: maxY});
	myChartData.datasets.push(
	    { label: "CASES 1.5times/ 1 Week", data: tmp1_5OneWeek,fill: false,
	      type: "line",
	      borderColor: window.chartColors.gray});

	let tmpOneWeek =[];
	tmpOneWeek.push({ x: 0, y: 0});
	tmpOneWeek.push({ x: maxY, y: maxY});
	myChartData.datasets.push(
	    { label: "CASES 1times/ 1 Week", data: tmpOneWeek,fill: false,
	      type: "line",
	      borderColor: window.chartColors.gray});
	let tmp2_3OneWeek =[];
	tmp2_3OneWeek.push({ x: 0, y: 0});
	tmp2_3OneWeek.push({ x: maxY*3/2, y: maxY});
	myChartData.datasets.push(
	    { label: "CASES (2/3)times/ 1 Week", data: tmp2_3OneWeek,fill: false,
	      type: "line",
	      borderColor: window.chartColors.gray});
	let tmp1_2OneWeek =[];
	tmp1_2OneWeek.push({ x: 0, y: 0});
	tmp1_2OneWeek.push({ x: maxY*2, y: maxY});
	myChartData.datasets.push(
	    { label: "CASES (1/2)times/ 1 Week", data: tmp1_2OneWeek,fill: false,
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
    if (draw_mode != 11) {
	let animationFlag = {};
	//    let animationFlag = false;
	if (yaxesType == "Logarithmic") {
	    if (draw_mode == 3) {
		myChartOptions = {
		    animation: animationFlag,
		    scales: myChartOptionsLogarithmicTotalCases,
		};
	    } else {
		myChartOptions = {
		    animation: animationFlag,
		    scales: myChartOptionsLogarithmic,
		};
	    }
	} else {
	    myChartOptions = {
		animation: animationFlag,
		scales: myChartOptionsLinear,
	    };
	}
	// 4)chart.jsで描画
	const ctx = document.getElementById("myChart").getContext("2d");
	window.myChart = new Chart(ctx, {
	    type: 'bar',
	    data: myChartData,
	    options: myChartOptions,
	});
    } else {
	// EARL graph
	const  myChartOptionsEARL =
	      {
		  yAxes: [{
		      type: 'linear',
		      ticks: {
			  beginAtZero: true,
			  min: 0,
		      }
		  }],
		  xAxes: [{
		      type: 'linear',
		      ticks: {
			  beginAtZero: true,
			  min: 0,
		      }
		  }],
	      };
	myChartOptions = {
	    scales: myChartOptionsEARL
	};
	const ctx = document.getElementById("myChart").getContext("2d");
	window.myChart = new Chart(ctx, {
	    type: 'scatter',
	    data: myChartData,
	    options: myChartOptions,
	});
    }	
}

function reformatToyoKeizaiData2CSSEGISandData(tdata, pref, i, type) {
    const a = tdata["prefectures-data"][i][type]["values"];
    let s = 0;
    for (let l = 0; l < a.length; l++) {
	a[l] = parseInt(a[l]) + s;
	s = a[l];
    }
    const from = tdata["prefectures-data"][i][type]["from"];
    const targetStartDay = from[0] + "/" + from[1] + "/" + from[2];
    const offsetdays = calculateOffsetDays(targetStartDay,
				     dataStartDay);
    for (let j = 1; j <= offsetdays; j++) {
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
    for (let j in tdata["prefectures-map"]) {
	const p = tdata["prefectures-map"][j];
	const pref = p["en"];
	const i = p["code"] - 1;
	prefTable[p["ja"]] = p["en"];
	dataDeathToyokeizai.push(reformatToyoKeizaiData2CSSEGISandData(tdata, pref, i, "deaths"));
	dataRecoverd.push(reformatToyoKeizaiData2CSSEGISandData(tdata, pref, i, "discharged"));
	dataCasesToyokeizai.push(reformatToyoKeizaiData2CSSEGISandData(tdata, pref, i, "carriers"));
    }
}

function parseNHKData(str) {
    let targetStartDay = "";
    let offsetdays;
    let lines = str.split("\n");
    let s = 0;
    let newcase = [];
    let death = [];
    let pref = "";
    let prev_pref = "";
    for (let i = 0; i < lines.length; ++i) {
	const cells = lines[i].split(",");
	if (cells == undefined || cells[0] == "") {
	    break;
	}
	if (cells[0] == "日付") {
	    continue;
	}
	if (targetStartDay == "") {
	    targetStartDay = cells[0];
	    offsetdays = calculateOffsetDays(targetStartDay,
					     dataStartDay);
	}
	pref = prefJp2EnTable[cells[2]];
	if (prev_pref != pref && newcase != []) {
	    dataCasesNHK.push(newcase);
	    dataDeathNHK.push(death);
	    prev_pref = pref;
	    newcase = [pref, "Japan", 0, 0];
	    death = [pref, "Japan", 0, 0];
	    for (let j = 1; j <= offsetdays; j++) {
		newcase.push(0);
		death.push(0);
	    }
	}
	s = parseInt(cells[4]);
	newcase.push(s);
	d = parseInt(cells[6]);
	death.push(d);
    }
    dataCasesNHK.push(newcase);
    dataDeathNHK.push(death);
};


function parseTokyo(str) {
    let targetStartDay = "";
    let offsetdays;
    let lines = str.split("\n");
    let s = 0;
    for (let i = 0; i < lines.length; ++i) {
	const cells = lines[i].split(",");
	if (cells == undefined || cells[0] == "") {
	    break;
	}
	if (cells[0] == "date") {
	    continue;
	}
	if (targetStartDay == "") {
	    targetStartDay = cells[0];
	    offsetdays = calculateOffsetDays(targetStartDay,
					     dataStartDay);
	}
	s = parseInt(cells[1]) + s;
	dataCasesTokyo.push(s);
	dataEndDayTokyo = cells[0];
    }
    for (let j = 1; j <= offsetdays; j++) {
	dataCasesTokyo.splice(0, 0, 0);
    }
    dataCasesTokyo.splice(0, 0, 0);
    dataCasesTokyo.splice(0, 0, 0);
    dataCasesTokyo.splice(0, 0, 0);
    dataCasesTokyo.splice(0, 0, "Tokyo");
}


function updateBarChart(draw_mode) {
  // 3)chart.jsのdataset用の配列を用意
    updateData(draw_mode)
    // 4)chart.jsで描画
    updateLocationHash();
    window.myChart.update();
}


function getUpdateDate(url, elementId) {
    let req = new XMLHttpRequest();
    req.open("GET", rawUrl2UpdateDate(url), true);
    req.onload = function() {
	if (req.status == 403) {
	    const update_date = document.getElementById(elementId);
	    update_date.innerHTML = "can't get update time";
	    return;
	}
	const update_str = JSON.parse(req.responseText)[0].commit.committer.date;
	let ts = Date.parse(update_str);
	ts = parseInt(ts) + getTzOffset() * 60 * 60;
	const dt = new Date(ts);
	const update_date = document.getElementById(elementId);
	update_date.innerHTML = dt;
    }
    req.send(null);
}

function getUpdateDateByHead(url, elementId) {
    let req = new XMLHttpRequest();
    req.open("HEAD", url, true);
    req.onreadystatechange = function() {
	if(this.readyState == 2) {
	    const update_str = req.getResponseHeader("Last-Modified")
	    let ts = Date.parse(update_str);
	    ts = parseInt(ts) + getTzOffset() * 60 * 60;
	    const dt = new Date(ts);
	    const update_date = document.getElementById(elementId);
	    update_date.innerHTML = dt;
	}
    }
    req.send(null);
}

function rawUrl2UpdateDate(url) {
    const s = url.split("/", 7);
    return  "https://api.github.com/repos/" + s[3] + "/" + s[4] +"/commits?path=" + s[6].replace("/", "%2F") + "&page=1&per_page=1";
}

function readCsv(filePath, csvFunc) {
    return new Promise(async function (resolve, reject) {
	let req = new XMLHttpRequest();
	req.open("GET", filePath, true);
	req.onload = async function() {
	    // 2) CSVデータ変換の呼び出し
	    await csvFunc(req.responseText);
	    loadFiles++;
	    loadingFilesElement.innerHTML = loadFiles;
	    resolve();
	}
	req.onreadystatechange = function() {
	    switch (req.readyState) {
	    case 4: // データ受信完了.
		if(req.status == 407) {
		    downloadAlertMessage(filePath);
		}
	    };
	};
	req.timeout = 30*1000;
	req.onerror = function() {
	    downloadAlertMessage(filePath);
	}
	req.ontimeout = function() {
	    downloadAlertMessage(filePath);
	}
	req.send(null);
    });
}

function downloadAlertMessage(filePath) {
    alert("data loading error.\n URL: " + filePath + "\n Reload page?");
    location.reload();
}

function updateStartDay() {
    let ts = dateParse(start_date);
    const ts_start = dateParse(dataStartDay);
    ts = parseInt((ts - ts_start) /1000 / 60 / 60 / 24) + 4; // 4 is pre cell
    start_day = parseInt(ts);
}

const urlJapanConfirmed = 'https://raw.githubusercontent.com/sanpei3/covid19jp/master/time_series_covid19_confirmed_Japan.csv';

const urlUSConfiremed = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv';
const urlUSDeath = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_US.csv';

const urlGlobalConfirmed = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';
const urlGlobalDeath = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv';
const urlGlobalRecoverd = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv';

const urlToyoKeizai = 'https://raw.githubusercontent.com/sanpei3/toyokeizai-covid19jp/main/data.json';
const urlNHK = 'https://www3.nhk.or.jp/n-data/opendata/coronavirus/nhk_news_covid19_prefectures_daily_data.csv';

const urlTokyoConfirmed = 'https://oku.edu.mie-u.ac.jp/~okumura/python/data/COVID-tokyo.csv';

async function main() {
    Promise.all([
	csv2Array(urlJapanConfirmed),
	csv2ArrayUSCounty(urlUSConfiremed),
	csv2ArrayUSCountyDeath(urlUSDeath),
	csv2ArrayGlobal(urlGlobalConfirmed),
	csv2ArrayGlobalDeath(urlGlobalDeath),
	csv2ArrayGlobalRecoverd(urlGlobalRecoverd),
	csv2ArrayPopulation('https://sanpei3.github.io/covid19jp/polulation.csv'),
	readCsv(urlToyoKeizai,
		parseToyoKeizaiData),
	readCsv(urlTokyoConfirmed,
		parseTokyo),
	readCsv(urlNHK,
		parseNHKData),
    ]).then(results => {
	// copy header field from dataCaseJAG to dataCasesToyokeizai and dataCasesNHK
	for (let row in dataCasesJAG) {
	    if (dataCasesJAG[row][0] == "Province/State") {
		// add dataCasesTokyo's date
		const dataEndDayJAG = mmddyy2yyyymmdd(dataCasesJAG[row][dataCasesJAG[row].length - 1]);
		const offsetdays = calculateOffsetDays(dataEndDayTokyo,
						       dataEndDayJAG);
		for (let j = 1; j <= offsetdays; j++) {
		    let d = new Date(dateParse(dataEndDayJAG));
		    d.setDate(d.getDate() + j);
		    const s = (d.getMonth() + 1) +"/" + d.getDate() +"/" +(parseInt(d.getFullYear()) - 2000);
		    dataCasesJAG[row].push(s);
		}
		dataCasesToyokeizai.unshift(dataCasesJAG[row]);
		dataCasesNHK.unshift(dataCasesJAG[row]);
		break;
	    }
	}
	// replace Tokyo data by Okumura's data
	for (let row in dataCasesJAG) {
	    if (dataCasesJAG[row][0] == "Tokyo") {
		dataCasesJAG[row] = dataCasesTokyo;
		break;
	    }
	}
	for (let row in dataCasesToyokeizai) {
	    if (dataCasesToyokeizai[row][0] == "Tokyo") {
		dataCasesToyokeizai[row] = dataCasesTokyo;
		break;
	    }
	}
	dataCases = dataCasesJAG;
    }).then(results => {
	initialize();
	flatpickr('#calendar', {
	    //    mode: "range",
	    minDate: dataStartDay,
	    maxDate: "today",
	    dateFormat: "Y-m-d",
	    defaultDate: start_date,
	}
		 );

	updateStartDay();
    }).then(results => {
	let loadingId = document.getElementById("loading");
	loadingId.remove();
	drawBarChart(draw_mode);
	getUpdateDate(urlGlobalConfirmed, "update_date_global");
	getUpdateDate(urlJapanConfirmed, "update_date_jp");
	getUpdateDate(urlToyoKeizai, "toyokeizai_data");
	getUpdateDateByHead(urlNHK, "NHK_data");
	getUpdateDateByHead(urlTokyoConfirmed,  "Tokyo_data");
    });
}




function updateGraphButtons(draw_mode, new_draw_mode) {
    let color = "";
    for (let i = 0; i < graphTable.length; i++) {
	if (new_draw_mode == i) {
	    color = 'red';
	} else if (draw_mode == i) {
	    color = 'white';
	} else {
	    continue;
	}
	const element = document.getElementById(graphTable[i]);
	element.style.backgroundColor = color;
    }
}

function updateYAxesButtons() {
    const elementLinear = document.getElementById("linear");
    const elementLogarithmic = document.getElementById("logarithmic");
    if (yaxesType == "Linear") {
	elementLinear.style.backgroundColor = 'skyblue';
	elementLogarithmic.style.backgroundColor = 'white';
    } else {
	elementLogarithmic.style.backgroundColor = 'skyblue';
	elementLinear.style.backgroundColor = 'white';
    }
}
graphTable.forEach(function(val) {
    document.getElementById(val).addEventListener('click', ()=> {
	for (let i = 0; i < graphTable.length; i++) {
	    if (graphTable[i] == val) {
		if (draw_mode != i) {
		    let destroyFlag = false;
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
		    if (draw_mode == 11 || i == 11) {
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
		const list = document.getElementById('list');
		list.textContent = null;
		return;
	    }
	    // 最後にkeyupされてから一定時間次の入力がなかったら実行
	    if (keyupStack.length === 0) {
		if (this.value == "") {
		    const list = document.getElementById('list');
		    list.textContent = null;
		    return;
		}
		// 部分一致を可能にする(例: .*a.*b.*c.*)
		const buf = '.*' + this.value.replace(/(.)/g, "$1.*");
		let reg = new RegExp(buf, "i");
		
		const filteredLists = psccKeys.filter(function (d) {
		    return reg.test(d);
		});
		createRow(filteredLists);
	    }
	}.bind(this), 300);
	//	event.preventDefault();
    });

function clearList() {
    const list = document.getElementById('list');
    list.textContent = null;
    document.addbuttonFrom.reset();
}
//document.getElementById("addbuttonFrom")
//    .addEventListener( "blur", function(event) {
//	var list = document.getElementById('list');
//	list.textContent = null;
//    });

var createRow = function (lists) {
    const list = document.getElementById('list');
    list.textContent = null;
    lists.forEach(function (l) {
	const li = document.createElement('li');
	const addButton = document.createElement('input');
	addButton.classList.add('addition');
	addButton.type = 'button';
	let addButtonId = l + "_add";
	addButton.id = addButtonId;
	addButton.value = l;
	li.appendChild(addButton);
	list.appendChild(li);
	document.getElementById(addButtonId).addEventListener('click', ()=> {
	    const pref = addButtonId.replace(/_add/, "");
	    addButtonMain(pref);
	    const list = document.getElementById('list');
	    list.textContent = null;
	}, false);
	
    });
};

function addButtonMain(c) {
    // table にあるか確認なければアラート
    let findFlag = false;
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
    const c = document.getElementById("addbutton").value;
    addButtonMain(c);
    const list = document.getElementById('list');
    list.textContent = null;
}

document.getElementById('AllClear').addEventListener('click', function() {
    pref_table.forEach(function(val) {
	const pref = val.pref;
	showFlagAlreadySet = true;
	updateLocationHash();
	if (showFlag[pref]) {
	    const element = document.getElementById(pref);
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
    const elementJAG = document.getElementById("JAG");
    const elementToyo = document.getElementById("ToyoKeizai");
    const elementNHK = document.getElementById("NHK");
    if (JapanDataSource == "JAG") {
	elementJAG.style.backgroundColor = 'skyblue';
	elementToyo.style.backgroundColor = 'white';
	elementNHK.style.backgroundColor = 'white';
	dataCases = dataCasesJAG;
	dataDeath = dataDeathToyokeizai;
    } else if (JapanDataSource == "ToyoKeizai") {
	elementJAG.style.backgroundColor = 'white';
	elementToyo.style.backgroundColor = 'skyblue';
	elementNHK.style.backgroundColor = 'white';
	dataCases = dataCasesToyokeizai;
	dataDeath = dataDeathToyokeizai;
    } else if (JapanDataSource == "NHK") {
	elementJAG.style.backgroundColor = 'white';
	elementToyo.style.backgroundColor = 'white';
	elementNHK.style.backgroundColor =  'skyblue';
	dataCases = dataCasesNHK;
	dataDeath = dataDeathNHK;
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
document.getElementById('NHK').addEventListener('click', function() {
    if (JapanDataSource != "NHK") {
	myChart.destroy();
	JapanDataSource = "NHK";
	dataCases = dataCasesNHK;
	updateLocationHash();
	updateDataSourceButtons();
	drawBarChart(draw_mode);
    }
});

main();
