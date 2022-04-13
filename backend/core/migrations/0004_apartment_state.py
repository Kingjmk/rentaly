# Generated by Django 4.0.3 on 2022-04-13 09:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_alter_apartment_price_per_month'),
    ]

    operations = [
        migrations.AddField(
            model_name='apartment',
            name='state',
            field=models.CharField(choices=[('A', 'Available'), ('R', 'RENTED')], db_index=True, default='A', max_length=1),
        ),
    ]