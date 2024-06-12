from django.db import models
from decimal import Decimal
from django.core.validators import MinValueValidator, MaxValueValidator


# Create your models here.
class StationInfo(models.Model):
    id_station = models.BigAutoField(primary_key=True)
    station_name = models.CharField('Название', max_length=30)
    region = models.CharField('Регион', max_length=30)
    latitude = models.DecimalField('Широта', max_digits=10, decimal_places=2, null=True,
                                   validators=[MinValueValidator(Decimal('0.00'))])
    longitude = models.DecimalField('Долгота', max_digits=10, decimal_places=2, null=True,
                                    validators=[MinValueValidator(Decimal('0.00'))])

    def __str__(self):
        return self.station_name

    class Meta:
        verbose_name = 'StationInfo'
        verbose_name_plural = 'StationsInfo'


class TypeInfo(models.Model):
    id_type = models.BigAutoField(primary_key=True)
    metric_name = models.CharField('Тип ', max_length=30)

    def __str__(self):
        return self.metric_name

    class Meta:
        verbose_name = 'TypeInfo'


class PeriodInfo(models.Model):
    id_period = models.BigAutoField(primary_key=True)
    period_type = models.CharField('Название', max_length=30)
    period_month = models.IntegerField('Месяц', default=0, validators=[MinValueValidator(1), MaxValueValidator(12)])
    period_hours = models.IntegerField('Час', default=0, validators=[MinValueValidator(1), MaxValueValidator(24)])

    def __str__(self):
        return f"PeriodInfo({self.id_period}, {self.period_type})"

    class Meta:
        verbose_name = 'PeriodInfo'


class ValueInfo(models.Model):
    id_station = models.ForeignKey(StationInfo, on_delete=models.CASCADE)
    id_period = models.ForeignKey(PeriodInfo, on_delete=models.CASCADE)
    id_type = models.ForeignKey(TypeInfo, on_delete=models.CASCADE)
    value = models.DecimalField('Значение', max_digits=10, decimal_places=2, null=True,
                                validators=[MinValueValidator(Decimal('0.00'))])

    def __str__(self):
        return f"ValueInfo({self.id})"

    class Meta:
        verbose_name = 'ValueInfo'
