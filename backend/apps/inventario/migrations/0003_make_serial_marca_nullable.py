# Generated manually to fix serial and marca fields

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventario', '0002_ubicacion_responsable'),
    ]

    operations = [
        migrations.AlterField(
            model_name='iteminventario',
            name='marca',
            field=models.CharField(
                blank=True,
                help_text='Marca del artículo (lista editable) - CLAUDE.md línea 175',
                max_length=100,
                null=True,
                verbose_name='Marca'
            ),
        ),
        migrations.AlterField(
            model_name='iteminventario',
            name='serial',
            field=models.CharField(
                blank=True,
                help_text='Número de serie (único por artículo) - CLAUDE.md línea 176',
                max_length=100,
                null=True,
                verbose_name='Serial'
            ),
        ),
    ]

