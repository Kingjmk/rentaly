from django.utils.translation import gettext_lazy as _
from django.db import models
import accounts.models


class ApartmentStates(models.TextChoices):
    AVAILABLE = 'A', _('Available')
    RENTED = 'R', _('RENTED')


class ApartmentQueryset(models.QuerySet):
    def allowed_for(self, user):
        if not user.is_authenticated or user.role == accounts.models.Roles.CLIENT:
            return self.filter(state=ApartmentStates.AVAILABLE)
        return self


class Apartment(models.Model):
    name = models.CharField(max_length=128, db_index=True)
    description = models.TextField(db_index=True)
    floor = models.PositiveSmallIntegerField(db_index=True)
    area_size = models.PositiveIntegerField(db_index=True)
    price_per_month = models.DecimalField(max_digits=11, decimal_places=3, db_index=True)
    number_of_rooms = models.PositiveSmallIntegerField(db_index=True)
    state = models.CharField(choices=ApartmentStates.choices, default=ApartmentStates.AVAILABLE,  max_length=1, db_index=True)
    latitude = models.DecimalField(max_digits=11, decimal_places=7, null=True, blank=True)
    longitude = models.DecimalField(max_digits=11, decimal_places=7, null=True, blank=True)

    created_by = models.ForeignKey('accounts.User', on_delete=models.PROTECT, related_name='+')
    created_on = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_on = models.DateTimeField(auto_now=True)

    objects = ApartmentQueryset.as_manager()

    class Meta:
        ordering = ['-id']
        verbose_name = _('Apartment')
        verbose_name_plural = _('Apartments')


class ApartmentImage(models.Model):
    apartment = models.ForeignKey('Apartment', on_delete=models.PROTECT, related_name='images')
    image = models.ImageField()

    created_on = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_on = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-id']
        verbose_name = _('Apartment image')
        verbose_name_plural = _('Apartments images')
