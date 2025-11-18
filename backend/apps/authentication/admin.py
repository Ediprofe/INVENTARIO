"""
Admin para CustomUser.
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    """Admin para CustomUser."""

    list_display = ['username', 'email', 'first_name', 'last_name', 'cargo', 'is_staff']
    list_filter = ['is_staff', 'is_superuser', 'is_active']
    search_fields = ['username', 'email', 'first_name', 'last_name']

    fieldsets = UserAdmin.fieldsets + (
        ('Información Adicional', {
            'fields': ('telefono', 'cargo')
        }),
    )
