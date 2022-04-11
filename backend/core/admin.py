from django.contrib import admin
from . import models


@admin.register(models.Apartment)
class ApartmentAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'area_size', 'number_of_rooms', 'price_per_month', 'created_on', 'created_by']
    list_select_related = ['created_by']
    readonly_fields = ['created_on', 'updated_on']


@admin.register(models.ApartmentImage)
class ApartmentImageAdmin(admin.ModelAdmin):
    list_display = ['id', 'apartment', 'image']
    list_select_related = ['apartment']
    readonly_fields = ['created_on', 'updated_on']
