"""
Serializers para autenticación JWT.
"""

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer para datos de usuario.
    """

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'cargo']
        read_only_fields = ['id']


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Serializer JWT que incluye datos del usuario.
    """

    def validate(self, attrs):
        data = super().validate(attrs)

        # Agregar información del usuario
        user_data = UserSerializer(self.user).data
        data['user'] = user_data

        return data
