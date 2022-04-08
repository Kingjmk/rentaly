from django.utils.translation import gettext_lazy as _
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin, Group
from django.contrib import admin
from . import models
import qsessions.models
import qsessions.admin

# Unregister default admin
admin.site.unregister(Group)
admin.site.unregister(qsessions.models.Session)


@admin.register(models.Session)
class SessionAdmin(qsessions.admin.SessionAdmin):
    pass


@admin.register(models.User)
class UserAdmin(BaseUserAdmin):
    readonly_fields = ['date_joined', 'last_login']
    fieldsets = [
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name',)}),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser'),
        }),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    ]
    add_fieldsets = [
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'first_name', 'last_name', 'password1', 'password2',),
        }),
    ]
    list_display = ('email', 'full_name', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_superuser', 'is_active')
    search_fields = ('first_name', 'last_name', 'email')
    ordering = ['-id']
    filter_horizontal = []
