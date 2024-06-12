# Generated by Django 4.2.2 on 2024-04-13 13:26

from decimal import Decimal
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="PeriodInfo",
            fields=[
                ("id_period", models.BigAutoField(primary_key=True, serialize=False)),
                (
                    "period_type",
                    models.CharField(max_length=30, verbose_name="Название"),
                ),
                (
                    "period_month",
                    models.IntegerField(
                        default=0,
                        validators=[
                            django.core.validators.MinValueValidator(1),
                            django.core.validators.MaxValueValidator(12),
                        ],
                        verbose_name="Месяц",
                    ),
                ),
                (
                    "period_day",
                    models.IntegerField(
                        default=0,
                        validators=[
                            django.core.validators.MinValueValidator(1),
                            django.core.validators.MaxValueValidator(31),
                        ],
                        verbose_name="День",
                    ),
                ),
                (
                    "period_hours",
                    models.IntegerField(
                        default=0,
                        validators=[
                            django.core.validators.MinValueValidator(1),
                            django.core.validators.MaxValueValidator(24),
                        ],
                        verbose_name="Час",
                    ),
                ),
            ],
            options={"verbose_name": "PeriodInfo",},
        ),
        migrations.CreateModel(
            name="TypeInfo",
            fields=[
                ("id_type", models.BigAutoField(primary_key=True, serialize=False)),
                ("metric_name", models.CharField(max_length=30, verbose_name="Тип ")),
            ],
            options={"verbose_name": "TypeInfo",},
        ),
        migrations.AlterModelOptions(
            name="stationinfo",
            options={
                "verbose_name": "StationInfo",
                "verbose_name_plural": "StationsInfo",
            },
        ),
        migrations.CreateModel(
            name="ValueInfo",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "value",
                    models.DecimalField(
                        decimal_places=2,
                        max_digits=10,
                        null=True,
                        validators=[
                            django.core.validators.MinValueValidator(Decimal("0.00"))
                        ],
                        verbose_name="Значение",
                    ),
                ),
                (
                    "id_period",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="main.periodinfo",
                    ),
                ),
                (
                    "id_station",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="main.stationinfo",
                    ),
                ),
                (
                    "id_type",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="main.typeinfo"
                    ),
                ),
            ],
            options={"verbose_name": "ValueInfo",},
        ),
    ]
