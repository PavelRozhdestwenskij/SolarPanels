const month = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const hours = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'];
let url = window.location.origin + window.location.pathname + 'json/';

// Функция для устанавливания тем
function setAnimatedTheme(root) {
    root.setThemes([
        am5themes_Animated.new(root)
    ]);
}

// Функция для создания графика
function createChart(root) {
    return root.container.children.push(am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        paddingLeft: 0
    }));
}

// Функция для создания оси Х
function createXAxis(chart, root, field) {
    return chart.xAxes.push(am5xy.CategoryAxis.new(root, {
        maxDeviation: 0,
        categoryField: field,
        renderer: am5xy.AxisRendererX.new(root, {
            minGridDistance: 0,
            minorGridEnabled: true
        })
    }));
}

// Функция для создания оси Y
function createYAxis(chart, root) {
    return chart.yAxes.push(am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {
            pan: "zoom"
        })
    }));
}

// Функция для создания легенд
function createLegend(chart, root) {
    return chart.children.push(
        am5.Legend.new(root, {
            x: am5.percent(100),
            centerX: am5.percent(100),
            layout: root.verticalLayout,
        })
    );
}

fetch(url)
    .then(response => response.json())
    .then(data => {
            document.getElementById("station_name").textContent = data[0].station_name;
            document.getElementById("station_region").textContent = data[0].region;
            document.getElementById("station_latitude").textContent = data[0].latitude;
            document.getElementById("station_longitude").textContent = data[0].longitude;
            // После загрузки данных вызываем функцию для создания графика
        }
    );

// Создаем корневой элемент
var root = am5.Root.new("albedodiv");

// Устанавливаем темы
setAnimatedTheme(root);

// Создание графика
var chart = createChart(root);

// Добавляем курсор
var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
cursor.lineY.set("visible", false);

// Создаем ось X
const xAxis = createXAxis(chart, root, "month");

// Создаем ось Y
const yAxis = createYAxis(chart, root);

// Создаем серии
var series = chart.series.push(am5xy.ColumnSeries.new(root, {
    name: "Series 1",
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: "value",
    sequencedInterpolation: true,
    categoryXField: "month",
    tooltip: am5.Tooltip.new(root, {
        labelText: "{valueY}"
    })
}));
series.columns.template.setAll({
    fill: am5.color(0xFFA500),
    width: "100%",
    fillOpacity: 0.7,
    strokeWidth: 2,
    stroke: am5.color(0x000000),
    cornerRadiusTL: 5,
    cornerRadiusTR: 5
});

function generateParams(id_type, id_period_start, id_period_end) {
    const idStation = window.location.pathname.split('/');
    const params = new URLSearchParams({
        id_station: idStation[idStation.length - 2],
        id_type: id_type,
        id_period_start: id_period_start,
        id_period_end: id_period_end,
    });
    return params.toString();
}

const paramsString = generateParams(1, 1, 12);
const valueUrl = window.location.origin + '/api/values/json/?' + paramsString;
let albedoMas = [];

fetch(valueUrl)
    .then(response => response.json())
    .then(currentData => {
        currentData.forEach(albedo => albedoMas.push(parseFloat(albedo.value)));
        const data = month.map((monthName, index) => ({
            month: monthName,
            value: albedoMas[index]
        }));
        xAxis.data.setAll(data);
        series.data.setAll(data);

        series.appear(1000);
        chart.appear(1000, 100);
    });

//Создаем корневой элемент для вывода месячны сумм солнечной радиации
const root2 = am5.Root.new("monthdiv");

// Устанавливаем темы
setAnimatedTheme(root2);

// Создаем график
var chart2 = createChart(root2);

// Добавляем курсор
var cursor2 = chart2.set("cursor", am5xy.XYCursor.new(root2, {}));
cursor2.lineY.set("visible", false);

// Создаем ось X
const xAxis2 = createXAxis(chart2, root2, "month");

// Создаем ось Y
const yAxis2 = createYAxis(chart2, root2);

var legend = createLegend(chart2, root2);

function createSeries(name, field, chartCS, xAxisCS, yAxisCS, rootCS, legendCS, color, width, param) {
    const series = chartCS.series.push(am5xy.ColumnSeries.new(rootCS, {
        name: name,
        xAxis: xAxisCS,
        yAxis: yAxisCS,
        valueYField: "value",
        clustered: false,
        categoryXField: field,
        tooltip: am5.Tooltip.new(rootCS, {
            pointerOrientation: "horizontal",
            labelText: "[bold]{name}[/]\n {valueY}"
        })
    }));

    series.columns.template.setAll({
        fill: color,
        fillOpacity: 0.9,
        stacked: false,
        width: width,
        strokeWidth: 1,
        stroke: am5.color(0x000000),
        cornerRadiusTL: 5,
        cornerRadiusTR: 5,
    });
    const valueUrln = window.location.origin + '/api/values/json/?' + param;
    let valueMas = [];

    fetch(valueUrln)
        .then(response => response.json())
        .then(currentData => {
            currentData.forEach(albedo => valueMas.push(parseFloat(albedo.value)));
            const data2 = (field === "month" ? month : hours).map((categoryName, index) => ({
                [field]: categoryName,
                value: valueMas[index]
            }));
            xAxisCS.data.setAll(data2);
            series.data.setAll(data2);
            legendCS.data.push(series);
        });
}

const paramsStringDirect = generateParams(2, 1, 12);
const paramsStringDiffuse = generateParams(3, 1, 12);
const paramsStringTotal = generateParams(4, 1, 12);

createSeries("Суммарная солнечная радиация", "month", chart2, xAxis2, yAxis2, root2, legend, am5.color(0xFFD700), am5.percent(60), paramsStringTotal);
createSeries("Прямая солнечная радиация", "month", chart2, xAxis2, yAxis2, root2, legend, am5.color(0xFFA500), am5.percent(80), paramsStringDirect);
createSeries("Диффузная солнечная радиация", "month", chart2, xAxis2, yAxis2, root2, legend, am5.color(0xCD8500), am5.percent(100), paramsStringDiffuse);

chart2.appear(1000, 100);

// Создаем корневой элемент для вывода дневных сумм солнечной радиации
const root3 = am5.Root.new("daydiv");

// Устанавливаем темы
setAnimatedTheme(root3);

// Создаем график
var chart3 = createChart(root3);

// Добавляем курсор
var cursor3 = chart3.set("cursor", am5xy.XYCursor.new(root3, {}));
cursor3.lineY.set("visible", false);

// Создаем ось X
const xAxis3 = createXAxis(chart3, root3, "month");

// Создаем ось Y
const yAxis3 = createYAxis(chart3, root3);

var legend3 = createLegend(chart3, root3);

const paramsStringDirectDay = generateParams(2, 13, 24);
const paramsStringDiffuseDay = generateParams(3, 13, 24);
const paramsStringTotalDay = generateParams(4, 13, 24);

createSeries("Суммарная солнечная радиация", "month", chart3, xAxis3, yAxis3, root3, legend3, am5.color(0xFFD700), am5.percent(60), paramsStringTotalDay);
createSeries("Прямая солнечная радиация", "month", chart3, xAxis3, yAxis3, root3, legend3, am5.color(0xFFA500), am5.percent(80), paramsStringDirectDay);
createSeries("Диффузная солнечная радиация", "month", chart3, xAxis3, yAxis3, root3, legend3, am5.color(0xCD8500), am5.percent(100), paramsStringDiffuseDay);

chart3.appear(1000, 100);

// Создаем корневой элемент для вывода cреднемесячные часовые суммы прямой солнечной радиации
const root4 = am5.Root.new("hoursdirectdiv");

// Устанавливаем темы
setAnimatedTheme(root4);

// Создаем график
var chart4 = createChart(root4);

// Добавляем курсор
var cursor4 = chart4.set("cursor", am5xy.XYCursor.new(root4, {}));
cursor4.lineY.set("visible", false);

// Создаем ось X
const xAxis4 = createXAxis(chart4, root4, "hours");

// Создаем ось Y
const yAxis4 = createYAxis(chart4, root4);

var legend4 = createLegend(chart4, root4);

const paramsStringDirectHours1 = generateParams(2, 25, 48);
const paramsStringDirectHours2 = generateParams(2, 49, 72);
const paramsStringDirectHours3 = generateParams(2, 73, 96);
const paramsStringDirectHours4 = generateParams(2, 97, 120);
const paramsStringDirectHours5 = generateParams(2, 121, 144);
const paramsStringDirectHours6 = generateParams(2, 145, 168);
const paramsStringDirectHours7 = generateParams(2, 169, 192);
const paramsStringDirectHours8 = generateParams(2, 193, 216);
const paramsStringDirectHours9 = generateParams(2, 217, 240);
const paramsStringDirectHours10 = generateParams(2, 241, 264);
const paramsStringDirectHours11 = generateParams(2, 265, 288);
const paramsStringDirectHours12 = generateParams(2, 289, 312);

createSeries("Январь", "hours", chart4, xAxis4, yAxis4, root4, legend4, am5.color(0xFFD700), am5.percent(100), paramsStringDirectHours1);
createSeries("Февраль", "hours", chart4, xAxis4, yAxis4, root4, legend4, am5.color(0xB2FF66), am5.percent(100), paramsStringDirectHours2);
createSeries("Март", "hours", chart4, xAxis4, yAxis4, root4, legend4, am5.color(0x66FFCC), am5.percent(100), paramsStringDirectHours3);
createSeries("Апрель", "hours", chart4, xAxis4, yAxis4, root4, legend4, am5.color(0x66FFEB), am5.percent(100), paramsStringDirectHours4);
createSeries("Май", "hours", chart4, xAxis4, yAxis4, root4, legend4, am5.color(0x66FFFF), am5.percent(100), paramsStringDirectHours5);
createSeries("Июнь", "hours", chart4, xAxis4, yAxis4, root4, legend4, am5.color(0x66CCFF), am5.percent(100), paramsStringDirectHours6);
createSeries("Июль", "hours", chart4, xAxis4, yAxis4, root4, legend4, am5.color(0x6699FF), am5.percent(100), paramsStringDirectHours7);
createSeries("Август", "hours", chart4, xAxis4, yAxis4, root4, legend4, am5.color(0x6666FF), am5.percent(100), paramsStringDirectHours8);
createSeries("Сентябрь", "hours", chart4, xAxis4, yAxis4, root4, legend4, am5.color(0x9966FF), am5.percent(100), paramsStringDirectHours9);
createSeries("Октябрь", "hours", chart4, xAxis4, yAxis4, root4, legend4, am5.color(0xCC66FF), am5.percent(100), paramsStringDirectHours10);
createSeries("Ноябрь", "hours", chart4, xAxis4, yAxis4, root4, legend4, am5.color(0xFF66FF), am5.percent(100), paramsStringDirectHours11);
createSeries("Декабрь", "hours", chart4, xAxis4, yAxis4, root4, legend4, am5.color(0xFF66CC), am5.percent(100), paramsStringDirectHours12);

chart4.series.values.slice(1).forEach((v) => v.hide());
// Анимация появления графика
chart4.appear(1000, 100);

// Создаем корневой элемент для вывода среднемесячные часовые суммы диффузной солнечной радиации
const root5 = am5.Root.new("hoursdiffusediv");

// Устанавливаем темы
setAnimatedTheme(root5);

// Создаем график
var chart5 = createChart(root5);

// Добавляем курсор
var cursor5 = chart5.set("cursor", am5xy.XYCursor.new(root5, {}));
cursor5.lineY.set("visible", false);

// Создаем ось X
const xAxis5 = createXAxis(chart5, root5, "hours");

// Создаем ось Y
const yAxis5 = createYAxis(chart5, root5, "zoom");

var legend5 = createLegend(chart5, root5);

const paramsStringDiffuseHours1 = generateParams(3, 25, 48);
const paramsStringDiffuseHours2 = generateParams(3, 49, 72);
const paramsStringDiffuseHours3 = generateParams(3, 73, 96);
const paramsStringDiffuseHours4 = generateParams(3, 97, 120);
const paramsStringDiffuseHours5 = generateParams(3, 121, 144);
const paramsStringDiffuseHours6 = generateParams(3, 145, 168);
const paramsStringDiffuseHours7 = generateParams(3, 169, 192);
const paramsStringDiffuseHours8 = generateParams(3, 193, 216);
const paramsStringDiffuseHours9 = generateParams(3, 217, 240);
const paramsStringDiffuseHours10 = generateParams(3, 241, 264);
const paramsStringDiffuseHours11 = generateParams(3, 265, 288);
const paramsStringDiffuseHours12 = generateParams(3, 289, 312);

createSeries("Январь", "hours", chart5, xAxis5, yAxis5, root5, legend5, am5.color(0xFFD700), am5.percent(100), paramsStringDiffuseHours1);
createSeries("Февраль", "hours", chart5, xAxis5, yAxis5, root5, legend5, am5.color(0xB2FF66), am5.percent(100), paramsStringDiffuseHours2);
createSeries("Март", "hours", chart5, xAxis5, yAxis5, root5, legend5, am5.color(0x66FFCC), am5.percent(100), paramsStringDiffuseHours3);
createSeries("Апрель", "hours", chart5, xAxis5, yAxis5, root5, legend5, am5.color(0x66FFEB), am5.percent(100), paramsStringDiffuseHours4);
createSeries("Май", "hours", chart5, xAxis5, yAxis5, root5, legend5, am5.color(0x66FFFF), am5.percent(100), paramsStringDiffuseHours5);
createSeries("Июнь", "hours", chart5, xAxis5, yAxis5, root5, legend5, am5.color(0x66CCFF), am5.percent(100), paramsStringDiffuseHours6);
createSeries("Июль", "hours", chart5, xAxis5, yAxis5, root5, legend5, am5.color(0x6699FF), am5.percent(100), paramsStringDiffuseHours7);
createSeries("Август", "hours", chart5, xAxis5, yAxis5, root5, legend5, am5.color(0x6666FF), am5.percent(100), paramsStringDiffuseHours8);
createSeries("Сентябрь", "hours", chart5, xAxis5, yAxis5, root5, legend5, am5.color(0x9966FF), am5.percent(100), paramsStringDiffuseHours9);
createSeries("Октябрь", "hours", chart5, xAxis5, yAxis5, root5, legend5, am5.color(0xCC66FF), am5.percent(100), paramsStringDiffuseHours10);
createSeries("Ноябрь", "hours", chart5, xAxis5, yAxis5, root5, legend5, am5.color(0xFF66FF), am5.percent(100), paramsStringDiffuseHours11);
createSeries("Декабрь", "hours", chart5, xAxis5, yAxis5, root5, legend5, am5.color(0xFF66CC), am5.percent(100), paramsStringDiffuseHours12);

chart5.series.values.slice(1).forEach((v) => v.hide());
// Анимация появления графика
chart5.appear(1000, 100);

// Создаем корневой элемент для вывода среднемесячные часовые суммы диффузной солнечной радиации
const root6 = am5.Root.new("hourstotaldiv");

// Устанавливаем темы
setAnimatedTheme(root6);

// Создаем график
var chart6 = createChart(root6);

// Добавляем курсор
var cursor6 = chart6.set("cursor", am5xy.XYCursor.new(root6, {}));
cursor6.lineY.set("visible", false);

// Создаем ось X
const xAxis6 = createXAxis(chart6, root6, "hours");

// Создаем ось Y
const yAxis6 = createYAxis(chart6, root6, "zoom");

var legend6 = createLegend(chart6, root6);

const paramsStringTotalHours1 = generateParams(4, 25, 48);
const paramsStringTotalHours2 = generateParams(4, 49, 72);
const paramsStringTotalHours3 = generateParams(4, 73, 96);
const paramsStringTotalHours4 = generateParams(4, 97, 120);
const paramsStringTotalHours5 = generateParams(4, 121, 144);
const paramsStringTotalHours6 = generateParams(4, 145, 168);
const paramsStringTotalHours7 = generateParams(4, 169, 192);
const paramsStringTotalHours8 = generateParams(4, 193, 216);
const paramsStringTotalHours9 = generateParams(4, 217, 240);
const paramsStringTotalHours10 = generateParams(4, 241, 264);
const paramsStringTotalHours11 = generateParams(4, 265, 288);
const paramsStringTotalHours12 = generateParams(4, 289, 312);

createSeries("Январь", "hours", chart6, xAxis6, yAxis6, root6, legend6, am5.color(0xFFD700), am5.percent(100), paramsStringTotalHours1);
createSeries("Февраль", "hours", chart6, xAxis6, yAxis6, root6, legend6, am5.color(0xB2FF66), am5.percent(100), paramsStringTotalHours2);
createSeries("Март", "hours", chart6, xAxis6, yAxis6, root6, legend6, am5.color(0x66FFCC), am5.percent(100), paramsStringTotalHours3);
createSeries("Апрель", "hours", chart6, xAxis6, yAxis6, root6, legend6, am5.color(0x66FFEB), am5.percent(100), paramsStringTotalHours4);
createSeries("Май", "hours", chart6, xAxis6, yAxis6, root6, legend6, am5.color(0x66FFFF), am5.percent(100), paramsStringTotalHours5);
createSeries("Июнь", "hours", chart6, xAxis6, yAxis6, root6, legend6, am5.color(0x66CCFF), am5.percent(100), paramsStringTotalHours6);
createSeries("Июль", "hours", chart6, xAxis6, yAxis6, root6, legend6, am5.color(0x6699FF), am5.percent(100), paramsStringTotalHours7);
createSeries("Август", "hours", chart6, xAxis6, yAxis6, root6, legend6, am5.color(0x6666FF), am5.percent(100), paramsStringTotalHours8);
createSeries("Сентябрь", "hours", chart6, xAxis6, yAxis6, root6, legend6, am5.color(0x9966FF), am5.percent(100), paramsStringTotalHours9);
createSeries("Октябрь", "hours", chart6, xAxis6, yAxis6, root6, legend6, am5.color(0xCC66FF), am5.percent(100), paramsStringTotalHours10);
createSeries("Ноябрь", "hours", chart6, xAxis6, yAxis6, root6, legend6, am5.color(0xFF66FF), am5.percent(100), paramsStringTotalHours11);
createSeries("Декабрь", "hours", chart6, xAxis6, yAxis6, root6, legend6, am5.color(0xFF66CC), am5.percent(100), paramsStringTotalHours12);

chart6.series.values.slice(1).forEach((v) => v.hide());
// Анимация появления графика
chart6.appear(1000, 100);