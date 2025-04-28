#!/usr/bin/env bash
# exit on error
set -o errexit

# Install Python dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser if it doesn't exist
python manage.py shell << END
from django.contrib.auth import get_user_model
from django.db import IntegrityError

User = get_user_model()
try:
    if not User.objects.filter(username='admin').exists() and not User.objects.filter(email='admin@example.com').exists():
        User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='admin'
        )
        print("Superuser created successfully")
    else:
        print("Superuser already exists")
except IntegrityError as e:
    print(f"Error creating superuser: {e}")
    print("Continuing with deployment...")
END

# Collect static files
python manage.py collectstatic --no-input 