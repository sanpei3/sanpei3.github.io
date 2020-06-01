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
	var d = days * Math.log(2.0, 2.0) / Math.log(data[row][i] / data[row][i - days], 2.0);
	if (isNaN(d) || d == Infinity) {
	    return 0;
	} else {
	    return d;
	}
    } else if (draw_mode == 2) {
	// K value
	return 1 - data[row][i- 7]/data[row][i];
    } else if (draw_mode == 3) {
	// Total cases
	return data[row][i]- data[row][start_day];
    }
}
    
var tmpLabels = [], tmpData1 = [], tmpData2 = [], tmpData3 = [];;
function updateData(data, draw_mode) {
    var start_i = start_day;
    tmpLabels = [];
    tmpData1 = [];
    tmpData2 = [];
    tmpData3 = [];;
    for (var row in data) {
	if (data[row][0] == "Province/State") {
	    for (var i = start_i; i <= data[row].length; i++) {
		tmpLabels.push(data[row][i]);
	    }
	} else if (data[row][0] == "Tokyo") {
	    for (var i = start_i; i <= data[row].length; i++) {
		a = calculate(data, row, i, draw_mode);
		console.log(a);
		if ( a >=0) {
		    tmpData1.push(a)
		} else {
		    tmpData1.push(0)
		}
		    
	    }
	} else if (data[row][0] == "Kanagawa") {
	    for (var i = start_i; i <= data[row].length; i++) {
		a = calculate(data, row, i, draw_mode);
		if ( a >=0) {
		    tmpData2.push(a)
		} else {
		    tmpData2.push(0)
		}
	    }
	} else if (data[row][0] == "Fukuoka") {
	    for (var i = start_i; i <= data[row].length; i++) {
		a = calculate(data, row, i, draw_mode);
		if ( a >=0) {
		    tmpData3.push(a)
		} else {
		    tmpData3.push(0)
		}
	    }
	}
    }
}

function drawBarChart(data, draw_mode) {
  // 3)chart.jsのdataset用の配列を用意
    updateData(data, draw_mode)

  // 4)chart.jsで描画
  var ctx = document.getElementById("myChart").getContext("2d");
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: tmpLabels,
      datasets: [
          { label: "Tokyo", data: tmpData1, fill: false,
	    borderColor: window.chartColors.blue},
          { label: "Kanagawa", data: tmpData2,fill: false,
	    borderColor: window.chartColors.red},
          { label: "Fukuoka", data: tmpData3,fill: false,
	    borderColor: window.chartColors.green},
      ]
    },
  });
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
  }
  req.send(null);
}
function func1() {
    var input_message = document.getElementById("start_day").value;
    start_day = input_message;
    drawBarChart(data, draw_mode);
}


var draw_mode = 0;
var start_day = 130;
main();

document.getElementById('daily_new_cases').addEventListener('click', function() {
    if (draw_mode != 0) {
	draw_mode = 0;
	drawBarChart(data, draw_mode);
	var element = document.getElementById("daily_new_cases");element.style.backgroundColor = 'red';	 
	var element = document.getElementById("double_days");element.style.backgroundColor = 'white';	 
	var element = document.getElementById("k_value");element.style.backgroundColor = 'white';	 
	var element = document.getElementById("total_cases");element.style.backgroundColor = 'white';	 
    }
});
document.getElementById('double_days').addEventListener('click', function() {
    if (draw_mode != 1) {
	draw_mode = 1;
	drawBarChart(data, draw_mode);
	var element = document.getElementById("daily_new_cases");element.style.backgroundColor = 'white';	 
	var element = document.getElementById("double_days");element.style.backgroundColor = 'red';	 
	var element = document.getElementById("k_value");element.style.backgroundColor = 'white';	 
	var element = document.getElementById("total_cases");element.style.backgroundColor = 'white';	 
    }
});
document.getElementById('k_value').addEventListener('click', function() {
    if (draw_mode != 2) {
	draw_mode = 2;
	drawBarChart(data, draw_mode);
	var element = document.getElementById("daily_new_cases");element.style.backgroundColor = 'white';	 
	var element = document.getElementById("double_days");element.style.backgroundColor = 'white';	 
	var element = document.getElementById("k_value");element.style.backgroundColor = 'red';	 
	var element = document.getElementById("total_cases");element.style.backgroundColor = 'white';	 
    }
});
document.getElementById('total_cases').addEventListener('click', function() {
    if (draw_mode != 3) {
	draw_mode = 3;
	drawBarChart(data, draw_mode);
	var element = document.getElementById("daily_new_cases");element.style.backgroundColor = 'white';	 
	var element = document.getElementById("double_days");element.style.backgroundColor = 'white';	 
	var element = document.getElementById("k_value");element.style.backgroundColor = 'white';	 
	var element = document.getElementById("total_cases");element.style.backgroundColor = 'red';	 
    }
});
