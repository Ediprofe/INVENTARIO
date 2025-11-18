"""
Views de autenticación JWT.
"""

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import CustomTokenObtainPairSerializer


class LoginView(TokenObtainPairView):
    """
    Vista de login que retorna JWT + datos de usuario.

    POST /api/v1/auth/login/
    Body: {"username": "admin", "password": "pass"}
    Response: {"access": "...", "refresh": "...", "user": {...}}
    """
    permission_classes = (AllowAny,)
    serializer_class = CustomTokenObtainPairSerializer


class LogoutView(APIView):
    """
    Vista de logout.

    POST /api/v1/auth/logout/
    Response: {"detail": "Logout exitoso"}
    """
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        return Response(
            {'detail': 'Logout exitoso'},
            status=status.HTTP_200_OK
        )
