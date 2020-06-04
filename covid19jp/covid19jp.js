// 2) CSVから２次元配列に変換
function csv2Array(str) {
  var csvData = [];
  var lines = str.split("\n");
  for (var i = 0; i < lines.length; ++i) {
    var cells = lines[i].split(",");
    csvData.push(cells);
  }
  return csvData;
}

function calculate(data, row, i, draw_mode) {
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

var color = Chart.helpers.color;
var tmpLabels = [], tmpData1 = [], tmpData2 = [], tmpData3 = [];;
var tmpData1_avgCases = [], tmpData2_avgCases = [], tmpData3_avgCases = [];

var showFlagTokyo = true, showFlagKanagawa = true, showFlagFukuoka = true;
function updateData(data, draw_mode) {
    var start_i = start_day;
    myChartData.datasets = [];
    tmpLabels = [];
    tmpData1 = [];
    tmpData2 = [];
    tmpData3 = [];
    tmpData1_avgCases = [];
    tmpData2_avgCases = [];
    tmpData3_avgCases = [];
    for (var row in data) {
	if (data[row][0] == "Province/State") {
	    for (var i = start_i; i <= data[row].length; i++) {
		tmpLabels.push(data[row][i]);
	    }
	    myChartData.labels = tmpLabels;
	} else if (data[row][0] == "Tokyo" && showFlagTokyo) {
	    for (var i = start_i; i <= data[row].length; i++) {
		a = calculate(data, row, i, draw_mode);
		if ( a >=0) {
		    tmpData1.push(a)
		} else {
		    tmpData1.push(0)
		}
		if (draw_mode == 0) {
		    b = (data[row][i] - data[row][i - 6]) / 7;
		    if ( b >=0) {
			tmpData1_avgCases.push(b)
		    } else {
			tmpData1_avgCases.push(0)
		    }
		}
	    }
	    if (draw_mode == 0) {
		myChartData.datasets.push(
		    { label: "Tokyo",
		      type: "bar",
		      backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
		      borderColor: window.chartColors.red,
		      borderWidth: 1,
		      data: tmpData1});
		myChartData.datasets.push(
		    { label: "Tokyo_avg", data: tmpData1_avgCases, fill: false,
		      type: "line",
		      borderColor: window.chartColors.red})
	    } else {
		myChartData.datasets.push(
		{ label: "Tokyo", data: tmpData1, fill: false,
		      type: "line",
		  borderColor: window.chartColors.red})
	    }
	    
	} else if (data[row][0] == "Kanagawa" && showFlagKanagawa) {
	    for (var i = start_i; i <= data[row].length; i++) {
		a = calculate(data, row, i, draw_mode);
		if ( a >=0) {
		    tmpData2.push(a)
		} else {
		    tmpData2.push(0)
		}
		if (draw_mode == 0) {
		    b = (data[row][i] - data[row][i - 6]) / 7;
		    if ( b >=0) {
			tmpData2_avgCases.push(b)
		    } else {
			tmpData2_avgCases.push(0)
		    }
		}
	    }
	    if (draw_mode == 0) {
		myChartData.datasets.push(
		    { label: "Kanagawa",
		      type: "bar",
		      backgroundColor: color(window.chartColors.green).alpha(0.5).rgbString(),
		      borderColor: window.chartColors.green,
		      borderWidth: 1,
		      data: tmpData2});
		myChartData.datasets.push(
		    { label: "Kanagawa_avg", data: tmpData2_avgCases, fill: false,
		      type: "line",
		      borderColor: window.chartColors.green})
	    } else {
		myChartData.datasets.push(
		    { label: "Kanagawa", data: tmpData2, fill: false,
		      type: "line",
		      borderColor: window.chartColors.green});
	    }
	} else if (data[row][0] == "Fukuoka" && showFlagFukuoka) {
	    for (var i = start_i; i <= data[row].length; i++) {
		a = calculate(data, row, i, draw_mode);
		if ( a >=0) {
		    tmpData3.push(a)
		} else {
		    tmpData3.push(0)
		}
		if (draw_mode == 0) {
		    b = (data[row][i] - data[row][i - 6]) / 7;
		    if ( b >=0) {
			tmpData3_avgCases.push(b)
		    } else {
			tmpData3_avgCases.push(0)
		    }
		}

	    }
	    if (draw_mode == 0) {
		myChartData.datasets.push(
		    { label: "Fukuoka",
		      type: "bar",
		      backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
		      borderColor: window.chartColors.blue,
		      borderWidth: 1,
		      data: tmpData3});
		myChartData.datasets.push(
		    { label: "Fukuoka_avg", data: tmpData3_avgCases, fill: false,
		      type: "line",
		      borderColor: window.chartColors.blue})
	    } else {
		myChartData.datasets.push(
		    { label: "Fukuoka", data: tmpData3,fill: false,
		      type: "line",
		      borderColor: window.chartColors.blue});
	    }
	}
    }
}
const  myChartOptionsLogarithmic =
      {
	  yAxes: [{
	      type: 'linear',
	  }]
      };
//	  {
//	  scales: {
//	      yAxes: [{
//		  type: 'logarithmic',
//		  ticks: {
//		      min: 10, //minimum tick
//		      max: 1000, //maximum tick
//		  },
//	      }],
//	  }
//    };

const  myChartOptionsLinear =
      {
	  yAxes: [{
	      type: 'linear',
	  }],
      };

var myChartData;
var myChartOptions;
function drawBarChart(data, draw_mode) {
    // 3)chart.jsのdataset用の配列を用意
    myChartData =
	{
	    labels: [],
	    datasets: []
	};
    updateData(data, draw_mode)
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


function updateBarChart(data, draw_mode) {
  // 3)chart.jsのdataset用の配列を用意
    updateData(data, draw_mode)
    if (draw_mode == 3) {
	myChartOptions.scales = myChartOptionsLogarithmic;
	console.log(myChartOptions.scales);
    } else if (draw_mode == 0) {
	myChartOptions.scales = myChartOptionsLinear;
	console.log(myChartOptions);
    } else {
    	myChartOptions.scales = myChartOptionsLinear;
	console.log(myChartOptions);
    }
    // 4)chart.jsで描画
    window.myChart.update();
}
function main() {
  // 1) ajaxでCSVファイルをロード
  var req = new XMLHttpRequest();
  var filePath = 'https://raw.githubusercontent.com/sanpei3/covid19jp/master/time_series_covid19_confirmed_Japan.csv';
  req.open("GET", filePath, true);
  req.onload = function() {
    // 2) CSVデータ変換の呼び出し
  data = csv2Array(req.responseText);
    // 3) chart.jsデータ準備、4) chart.js描画の呼び出し
      drawBarChart(data, draw_mode);
      
      var update_str;
      var filePath = "https://api.github.com/repos/sanpei3/covid19jp/commits?path=time_series_covid19_confirmed_Japan.csv&page=1&per_page=1"
      req.open("GET", filePath, true);
      req.onload = function() {
	  update_str = JSON.parse(req.responseText)[0].commit.committer.date;
	  var update_date = document.getElementById("update_date");
	  update_date.innerHTML = update_str;
      }
       req.send(null);
  }
  req.send(null);
}
function func1() {
    var input_message = document.getElementById("start_day").value;
    start_day = input_message;
    updateBarChart(data, draw_mode);
}


var draw_mode = 0;
var start_day = 130;
main();

document.getElementById('daily_new_cases').addEventListener('click', function() {
    if (draw_mode != 0) {
	draw_mode = 0;
	updateBarChart(data, draw_mode);
	var element = document.getElementById("daily_new_cases");element.style.backgroundColor = 'red';	 
	var element = document.getElementById("double_days");element.style.backgroundColor = 'white';	 
	var element = document.getElementById("k_value");element.style.backgroundColor = 'white';	 
	var element = document.getElementById("total_cases");element.style.backgroundColor = 'white';	 
    }
});
document.getElementById('double_days').addEventListener('click', function() {
    if (draw_mode != 1) {
	draw_mode = 1;
	updateBarChart(data, draw_mode);
	var element = document.getElementById("daily_new_cases");element.style.backgroundColor = 'white';	 
	var element = document.getElementById("double_days");element.style.backgroundColor = 'red';	 
	var element = document.getElementById("k_value");element.style.backgroundColor = 'white';	 
	var element = document.getElementById("total_cases");element.style.backgroundColor = 'white';	 
    }
});
document.getElementById('k_value').addEventListener('click', function() {
    if (draw_mode != 2) {
	draw_mode = 2;
	updateBarChart(data, draw_mode);
	var element = document.getElementById("daily_new_cases");element.style.backgroundColor = 'white';	 
	var element = document.getElementById("double_days");element.style.backgroundColor = 'white';	 
	var element = document.getElementById("k_value");element.style.backgroundColor = 'red';	 
	var element = document.getElementById("total_cases");element.style.backgroundColor = 'white';	 
    }
});
document.getElementById('total_cases').addEventListener('click', function() {
    if (draw_mode != 3) {
	draw_mode = 3;
	updateBarChart(data, draw_mode);
	var element = document.getElementById("daily_new_cases");element.style.backgroundColor = 'white';	 
	var element = document.getElementById("double_days");element.style.backgroundColor = 'white';	 
	var element = document.getElementById("k_value");element.style.backgroundColor = 'white';	 
	var element = document.getElementById("total_cases");element.style.backgroundColor = 'red';	 
    }
});
document.getElementById("start_day")
    .addEventListener("keyup", function(event) {
	event.preventDefault();
	if (event.keyCode === 13) {
	    func1();
	}
    });


document.getElementById('ToggleDatasetTokyo').addEventListener('click', function() {
    var element = document.getElementById("ToggleDatasetTokyo");
    if (showFlagTokyo) {
	element.style.backgroundColor = 'white';
    } else {
	element.style.backgroundColor = 'red';
    }
    showFlagTokyo = !(showFlagTokyo);
    updateBarChart(data, draw_mode);
});

document.getElementById('ToggleDatasetKanagawa').addEventListener('click', function() {
    var element = document.getElementById("ToggleDatasetKanagawa");
    if (showFlagKanagawa) {
	element.style.backgroundColor = 'white';
    } else {
	element.style.backgroundColor = 'green';
    }
    showFlagKanagawa = !(showFlagKanagawa);
    updateBarChart(data, draw_mode);
});


document.getElementById('ToggleDatasetFukuoka').addEventListener('click', function() {
    var element = document.getElementById("ToggleDatasetFukuoka");
    if (showFlagFukuoka) {
	element.style.backgroundColor = 'white';
    } else {
	element.style.backgroundColor = 'skyblue';
    }
    showFlagFukuoka = !(showFlagFukuoka);
    updateBarChart(data, draw_mode);
});


