import csv
from django.http import JsonResponse, HttpResponse, HttpResponseBadRequest
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import pandas as pd
from main.models import *

from api.utils import get_file, CalculateByDay, CalculateByMonth, CalculateByYear, CalculateByCustom


@require_http_methods(["GET"])
def station_info_get(request, **kwargs):
    data = StationInfo.objects.filter(id_station=kwargs['id_station']).values()
    context = {
        'station': list(data)
    }
    return render(request, 'station.html', context)


@require_http_methods(["GET"])
def station_info_get_json(request, **kwargs):
    data = StationInfo.objects.filter(id_station=kwargs['id_station']).values()
    return JsonResponse(list(data), safe=False)


@require_http_methods(["GET"])
def value_info_get_json(request, **kwargs):
    id_station = request.GET.get('id_station', default=None)
    id_type = request.GET.get('id_type', default=None)
    id_period_start = request.GET.get('id_period_start', default=None)
    id_period_end = request.GET.get('id_period_end', default=None)
    if not id_station and not id_type and not id_period_start and not id_period_end:
        raise Exception('Отсутсвуют данные!')
    data = ValueInfo.objects.filter(id_station=id_station, id_period__id_period__range=[id_period_start, id_period_end],
                                    id_type=id_type).values()
    return JsonResponse(list(data), safe=False)


@require_http_methods(["GET"])
def stations_info_get(request):
    data = list(StationInfo.objects.values())
    return JsonResponse(data, safe=False)


@csrf_exempt
@require_http_methods(["POST"])
def calc_by_day_csv(request):
    try:
        data = pd.read_csv(get_file(request), decimal=",", delimiter=';')
    except Exception as e:
        return HttpResponseBadRequest("Ошибка при чтении csv файла: " + str(e))

    return CalculateByDay(data, request).get_dataset()


@csrf_exempt
@require_http_methods(["POST"])
def calc_by_month_csv(request):
    try:
        data = pd.read_csv(get_file(request), decimal=",", delimiter=';')
    except Exception as e:
        return HttpResponseBadRequest('Invalid data')

    return CalculateByMonth(data, request).get_dataset()


@csrf_exempt
@require_http_methods(["POST"])
def calc_by_year_csv(request):
    try:
        data = pd.read_csv(get_file(request), decimal=",", delimiter=';')
    except Exception as e:
        return HttpResponseBadRequest('Invalid data')

    return CalculateByYear(data, request).get_dataset()


@csrf_exempt
@require_http_methods(["POST"])
def calc_by_custom_csv(request):
    try:
        data = pd.read_csv(get_file(request), decimal=",", delimiter=';')
    except Exception as e:
        return HttpResponseBadRequest('Invalid data')

    return CalculateByCustom(data, request).get_dataset()
