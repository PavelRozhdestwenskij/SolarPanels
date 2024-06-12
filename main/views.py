from django.shortcuts import render
import json
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse, HttpResponse, HttpResponseBadRequest
from .models import *
from django.db.models import Q

def index(request):
    filter_param = request.GET.get('filter', default='')
    station = StationInfo.objects.order_by('station_name')
    if filter_param:
        station = station.filter(Q(station_name__icontains=filter_param) | Q(region__icontains=filter_param))
    return render(request, 'index.html', {'station': station})

@require_http_methods(["GET"])
def index_station(request, **kwargs):
    filter_param = request.GET.get('filter', default='')
    data = StationInfo.objects.order_by('station_name')
    values = data.values()
    if filter_param:
        data_stations = data.filter(Q(station_name__icontains=filter_param) | Q(region__icontains=filter_param))
        values = data_stations.values()
    return JsonResponse(list(values), safe=False)
def station(request):
    return render(request, 'station.html')
def calculations(request):
    return render(request, 'calculations.html')

