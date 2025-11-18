# Generated manually

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('inventario', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='ubicacion',
            name='responsable',
            field=models.ForeignKey(
                blank=True,
                help_text='Responsable por defecto para ítems nuevos en esta ubicación',
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='ubicaciones_responsable',
                to='inventario.responsable',
                verbose_name='Responsable por defecto'
            ),
        ),
    ]

