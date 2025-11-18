"""
Modelo Responsable - Persona a cargo de ítems o ubicaciones.
Optimizado con índices compuestos para búsquedas.
"""

from django.db import models
from django.core.validators import EmailValidator, RegexValidator
from django.core.exceptions import ValidationError
from apps.core.models import TimeStampedModel
from .choices import TipoDocumento


class Responsable(TimeStampedModel):
    """
    Persona responsable de ítems del inventario.

    Reglas de negocio:
    - nombre + apellido obligatorios
    - documento único si se proporciona
    - email único si se proporciona
    - puede estar asociado a una sede
    """

    nombre = models.CharField(
        max_length=100,
        verbose_name="Nombre",
        help_text="Nombre de la persona"
    )

    apellido = models.CharField(
        max_length=100,
        verbose_name="Apellido",
        help_text="Apellido de la persona"
    )

    tipo_documento = models.CharField(
        max_length=10,
        choices=TipoDocumento.choices,
        blank=True,
        verbose_name="Tipo de Documento"
    )

    documento = models.CharField(
        max_length=20,
        blank=True,
        verbose_name="Número de Documento"
    )

    cargo = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Cargo",
        help_text="Cargo o rol en la institución"
    )

    telefono = models.CharField(
        max_length=20,
        blank=True,
        validators=[
            RegexValidator(
                regex=r'^\+?[0-9\s\-()]+$',
                message='Teléfono debe contener solo números, espacios, +, - y ()'
            )
        ],
        verbose_name="Teléfono"
    )

    email = models.EmailField(
        unique=True,
        blank=True,
        null=True,
        db_index=True,
        validators=[EmailValidator()],
        verbose_name="Email",
        help_text="Correo electrónico único"
    )

    sede = models.ForeignKey(
        'Sede',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='responsables',
        db_index=True,
        verbose_name="Sede Asignada"
    )

    activo = models.BooleanField(
        default=True,
        db_index=True,
        verbose_name="Activo"
    )

    class Meta:
        db_table = 'inventario_responsable'
        verbose_name = 'Responsable'
        verbose_name_plural = 'Responsables'
        ordering = ['apellido', 'nombre']
        indexes = [
            models.Index(
                fields=['tipo_documento', 'documento'],
                name='idx_resp_documento'
            ),
            models.Index(fields=['email'], name='idx_resp_email'),
            models.Index(fields=['sede'], name='idx_resp_sede'),
            models.Index(fields=['activo'], name='idx_resp_activo'),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=['tipo_documento', 'documento'],
                condition=models.Q(
                    tipo_documento__isnull=False,
                    documento__isnull=False
                ),
                name='unique_documento_responsable'
            )
        ]

    def __str__(self):
        nombre_completo = f"{self.nombre} {self.apellido}"
        if self.sede:
            return f"{nombre_completo} ({self.sede.codigo})"
        return nombre_completo

    @property
    def nombre_completo(self):
        """Nombre completo concatenado."""
        return f"{self.nombre} {self.apellido}"

    def clean(self):
        """Validaciones de negocio."""
        super().clean()

        # Si tiene tipo_documento, debe tener numero
        if self.tipo_documento and not self.documento:
            raise ValidationError({
                'documento': 'Debe proporcionar el número si indica el tipo'
            })

        if self.documento and not self.tipo_documento:
            raise ValidationError({
                'tipo_documento': 'Debe indicar el tipo de documento'
            })

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    @property
    def items_a_cargo(self):
        """Cantidad de ítems activos asignados."""
        from .choices import EstadoItem
        return self.items_asignados.exclude(
            estado=EstadoItem.DADO_BAJA
        ).count()
