from django.urls import path
from . import views

app_name = 'api'

urlpatterns = [
    path('stations', views.stations_info_get, name='stations_info_get'),
    path('station/<int:id_station>/', views.station_info_get, name='station_info_get'),
    path('station/<int:id_station>/json/', views.station_info_get_json, name='station_info_get_json'),
    path('values/json/', views.value_info_get_json, name='value_info_get_json'),
    path('calc/by-day/csv', views.calc_by_day_csv),
    path('calc/by-month/csv', views.calc_by_month_csv),
    path('calc/by-year/csv', views.calc_by_year_csv),
    path('calc/by-custom/csv', views.calc_by_custom_csv),
]
