# Generated by Django 4.2.2 on 2024-04-13 15:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0002_periodinfo_typeinfo_alter_stationinfo_options_and_more"),
    ]

    operations = [
        migrations.RemoveField(model_name="periodinfo", name="period_day",),
    ]
