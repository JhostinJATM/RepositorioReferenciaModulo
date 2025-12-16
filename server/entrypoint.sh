#!/bin/sh

# Esperar a que la base de datos esté lista (opcional, se puede usar wait-for-it)
# python manage.py wait_for_db

echo "Aplicando migraciones..."
python manage.py makemigrations
python manage.py migrate

echo "Iniciando servidor..."
python manage.py runserver 0.0.0.0:8000
