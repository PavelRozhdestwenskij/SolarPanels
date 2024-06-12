document.addEventListener("DOMContentLoaded", function () {
    // Создаем корневой элемент
    var root = am5.Root.new("chartdiv");

    // Устанавливаем темы
    root.setThemes([
        am5themes_Animated.new(root)
    ]);

    // Создаем карту
    var chart = root.container.children.push(
        am5map.MapChart.new(root, {
            panX: "rotateX",
            panY: "translateY",
            projection: am5map.geoMercator(),
        })
    );
    // Создаем карту полигонов, удаляя ненужные страны
    var polygonSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
            geoJSON: am5geodata_worldLow,
            exclude: ["AQ", "AL", "AI", "AW", "AX", "BA", "BE",
                "CH", "CW", "CZ", "HR", "KN", "LB", "LC", "LU", "ME",
                "MK", "MQ", "MS", "UM", "CK", "PF", "PN", "PR", "RO",
                "RS", "SI", "SK", "SM", "SX", "VG", "US", "GL", "CA",
                "IS", "US", "PM", "SJ", "MX", "GS", "SH", "TC", "SV",
                "HN", "GT", "BZ", "CU", "BS", "KY", "JM", "NI", "CR",
                "PA", "EC", "DO", "BM", "MF", "HT", "VI", "BQ", "CO",
                "VE", "BL", "AG", "GP", "DM", "BB", "VC", "GD", "TT",
                "GY", "GF", "SR", "PE", "BR", "BO", "PY", "UY", "CL",
                "AR", "FK", "SJ", "BV", "TF", "HM", "NZ", "AU", "MU",
                "RE", "SC", "MV", "IO", "CC", "NF", "NC", "MP", "GU",
                "KM", "YT", "SB", "FM", "NR", "MH", "UM", "KI", "TK",
                "TV", "VU", "WF", "WS", "NU", "FJ", "TO", "AS"
            ]
        })
    );

    polygonSeries.mapPolygons.template.setAll({
        fill: am5.color(0xdadada)
    });

    // Создаем серию точек для отображения маркеров на карте
    var pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));


    // Создание маркеров
    pointSeries.bullets.push(function (root, series, dataItem) {
        const {dataContext} = dataItem;
        var circle;
        if (dataContext.isNearest) {
            circle = am5.Circle.new(root, {
                radius: 3,
                tooltipY: 0,
                fill: am5.color(0x0000ff),
                tooltipText: "{title}"
            });
        } else {
            circle = am5.Circle.new(root, {
                radius: 4,
                tooltipY: 0,
                fill: am5.color(0xff8c00),
                tooltipText: "{title}"
            });
        }

        circle.events.on("click", function (ev) {
            var dataItem = ev.target.dataItem;
            console.log(dataItem);
            if (dataItem.dataContext.url) {
                window.location.assign(dataItem.dataContext.url); //  Перенаправляем на указанный URL
            }
        });

        return am5.Bullet.new(root, {
            sprite: circle
        });
    });

    var polygonSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
            fill: am5.color(0xff0000)
        })
    );
    polygonSeries.mapPolygons.template.setAll({
        fillOpacity: 0.3,
        stroke: am5.color(0x0000ff)
    });
    // Добавляем данные о станциях
    var stations = [];
    const search = window.location.search
    let url = window.location.origin + window.location.pathname + 'json/' + search;
    var length = 0
    fetch(url)
        .then(response => response.json())
        .then(data => {
            data.forEach(station => {
                const longitude = station.longitude;
                const latitude = station.latitude;
                const title = station.station_name + ', ' + station.region;
                const id = station.id_station;

                // Добавляем данные о станциях в массив stations
                addStation(longitude, latitude, title, id, false);
                length++
            });
        });

    function addStation(longitude, latitude, title, id, isNearest) {
        pointSeries.data.push({
            geometry: {type: "Point", coordinates: [longitude, latitude]},
            title: title,
            url: window.location.origin + '/api/station/' + id,
            isNearest
        });
    }

    for (var i = 0; i < stations.length; i++) {
        var station = stations[i];
        addStation(station.longitude, station.latitude, station.title, station.id, station.isNearest);
    }
    // Функция проверки ввода значений
    const errorMessage = document.getElementById('error-message');
    var errorFlag = true;
    const STYLE_NONE = "none";
    const STYLE_BLOCK = "block";

    function wrapError(message) {
        errorMessage.innerText = message;
        errorMessage.style.display = STYLE_BLOCK;
        setTimeout(() => {
            errorMessage.style.display = STYLE_NONE;
        }, 2000);
    }

    // Обработка нажатия на кнопку "Рассчитать"
    document.querySelector('#findStations')
        .addEventListener('click', () => {

            let err = validateFields()
            if (err !== "") {
                wrapError(err)
                return;
            } else {
                errorMessage.style.display = STYLE_NONE;
                errorFlag = true;
            }
        });

    function validateFields() {
        let validationError = "";

        let latitudeInput = document.getElementById("latitudeInput").value;
        if (latitudeInput === "" || latitudeInput < 0 || latitudeInput > 90) {
            validationError += "Значение широты должно лежать в пределах от 0 до 90.\n";
            errorFlag = false;
        }
        let longitudeInput = document.getElementById("longitudeInput").value;
        if (longitudeInput === "" || longitudeInput < 0 || longitudeInput > 180) {
            validationError += "Значение долготы должно лежать в пределах от 0 до 180.\n";
            errorFlag = false;
        }
        let distanceInput = document.getElementById("distanceInput").value;
        if (distanceInput === "" || distanceInput < 1 || distanceInput > 2000) {
            validationError += "Заданное расстояние не может быть больше 2000 км.\n";
            errorFlag = false;
        }
        return validationError
    }

    // Функция поиска по заданной координате
    document.getElementById("findStations").addEventListener("click", function () {
        var latitudeInput = document.getElementById("latitudeInput").value;
        var longitudeInput = document.getElementById("longitudeInput").value;
        var distanceInput = document.getElementById("distanceInput").value;
        if (errorFlag == true) {
            if (pointSeries.data.length == length) {
                if (latitudeInput && longitudeInput && distanceInput) {
                    var latitudeNew = parseFloat(latitudeInput);
                    var longitudeNew = parseFloat(longitudeInput);
                    var distance = parseFloat(distanceInput);

                    // Приблизительная длина 1 градуса широты и долготы на экваторе (в км)
                    var degreesToKm = 111;
                    // Преобразование расстояния из км в градусы
                    var distanceDegrees = distance / degreesToKm;

                    // Добавляем новую точку на карту
                    pointSeries.data.push({
                        geometry: {type: "Point", coordinates: [longitudeNew, latitudeNew]},
                        title: "Заданная координата",
                        isNearest: true
                    })
                    // Добавляем окружность с зданным радиусом
                    polygonSeries.data.push({
                        geometry: am5map.getGeoCircle({
                            latitude: latitudeNew,
                            longitude: longitudeNew
                        }, distanceDegrees),
                    });
                } else {
                    wrapError("Введите значения широты, долготы и радиус в киллометрах!");
                }
            } else {
                wrapError("Вы уже задали поиск!");
            }
        }
    });

    // Сбрасываем поиск
    document.getElementById("resetStation").addEventListener("click", function () {
        // Проверяем, есть ли хотя бы одна точка на карте
        if (pointSeries.data.length > length) {
            pointSeries.data.pop();
            polygonSeries.data.pop();
            document.getElementById("latitudeInput").value = ''; // Очищаем поле ввода
            document.getElementById("longitudeInput").value = ''; // Очищаем поле ввода
            document.getElementById("distanceInput").value = ''; // Очищаем поле ввода
        } else {
            wrapError("Поиск уже сброшен!");
        }
    });

    var searchInput = document.getElementById("searchInput")
    // Поиск по наименованию
    document.getElementById("findStation").addEventListener("click", function () {
        const searchParams = new URLSearchParams(window.location.search)
        searchParams.set('filter', searchInput.value)
        window.location.search = searchParams.toString()
    });

    // Сброс
    document.getElementById("reset").addEventListener("click", function () {
        window.location.search = ''
    });

    const searchParams = new URLSearchParams(window.location.search)
    searchInput.value = searchParams.get('filter') || ''

    // Делаем анимацию при загрузке
    chart.appear(1000, 100);
});