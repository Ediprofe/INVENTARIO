"""
URLs de inventario.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

app_name = 'inventario'

router = DefaultRouter()

# Registrar viewsets en Fase 2

urlpatterns = [
    path('', include(router.urls)),
]
