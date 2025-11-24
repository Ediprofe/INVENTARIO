"""
Modelo Responsable - Persona a cargo de ítems o ubicaciones.
Optimizado con índices compuestos para búsquedas.
"""

from django.db import models
from django.core.validators import EmailValidator, RegexValidator
from django.core.exceptions import ValidationError
from apps.core.models import TimeStampedModel
from .choices import TipoDocumento, CargoResponsable


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
        null=True,
        verbose_name="Tipo de Documento"
    )

    documento = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        verbose_name="Número de Documento"
    )

    cargo = models.CharField(
        max_length=100,
        # choices=CargoResponsable.choices,  # Permitir valores libres (CLAUDE.md)
        blank=True,
        db_index=True,
        verbose_name="Cargo",
        help_text="Cargo o rol en la institución (valores libres desde Excel)"
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
        from .choices import Disponibilidad
        return self.items_asignados.exclude(
            disponibilidad=Disponibilidad.DE_BAJA
        ).count()

    @classmethod
    def get_or_create_by_fullname(cls, nombre_completo, sede, **extra_fields):
        """
        Busca o crea un responsable por nombre completo y sede.
        
        Este método es utilizado en la importación Excel según INICIAL.md líneas 1147-1161.
        Divide el nombre completo en nombre y apellido, y crea el responsable si no existe.
        
        Args:
            nombre_completo: Nombre completo del responsable (ej: "Juan Pérez")
            sede: Instancia de Sede a la que pertenece
            **extra_fields: Campos adicionales opcionales (email, telefono, cargo, etc.)
        
        Returns:
            tuple: (responsable, created) - El responsable y un booleano indicando si fue creado
        
        Raises:
            ValidationError: Si el nombre_completo está vacío o sede es None
        """
        if not nombre_completo or not nombre_completo.strip():
            raise ValidationError("El nombre completo no puede estar vacío")
        
        if not sede:
            raise ValidationError("La sede es obligatoria")
        
        nombre_completo = nombre_completo.strip()
        
        # Intentar buscar por nombre_completo exacto + sede
        # Construir query dinámica buscando combinaciones de nombre/apellido
        partes = nombre_completo.split()
        
        if len(partes) == 1:
            # Solo un nombre, usarlo como nombre
            nombre = partes[0]
            apellido = ''
        else:
            # Asumir: primer palabra = nombre, resto = apellido
            nombre = partes[0]
            apellido = ' '.join(partes[1:])
        
        # Buscar existente con misma combinación nombre+apellido+sede
        try:
            responsable = cls.objects.get(
                nombre__iexact=nombre,
                apellido__iexact=apellido,
                sede=sede
            )
            return responsable, False
        except cls.DoesNotExist:
            # No existe, crear nuevo
            responsable = cls.objects.create(
                nombre=nombre,
                apellido=apellido,
                sede=sede,
                **extra_fields
            )
            return responsable, True
