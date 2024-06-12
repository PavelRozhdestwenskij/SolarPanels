from django.contrib import admin
from django.urls import path
from django.urls import include
from . import views


urlpatterns = [
    path('', views.index, name='index'),
    path('json/', views.index_station, name='index_station'),
    path('station/<int:id>/', views.station, name='station'),
    path('calculations',views.calculations, name='calculations'),
]
