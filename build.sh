#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Starting build process..."

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Set default port if not provided
export PORT=${PORT:-10000}
echo "Using port: $PORT"

# Run migrations with retry logic
for i in {1..5}; do
    echo "Attempt $i to run migrations..."
    python manage.py makemigrations
    if python manage.py migrate; then
        echo "Migrations completed successfully"
        break
    else
        echo "Migration attempt $i failed, waiting 10 seconds before retry..."
        sleep 10
    fi
done

# Create superuser if it doesn't exist
echo "Checking for superuser..."
python manage.py shell << END
from django.contrib.auth import get_user_model
from django.db import IntegrityError
import uuid

User = get_user_model()
try:
    if not User.objects.filter(username='admin').exists():
        unique_email = f'admin_{uuid.uuid4().hex[:8]}@skinscan.com'
        User.objects.create_superuser(
            username='admin',
            email=unique_email,
            password='admin'
        )
        print(f"Superuser created successfully with email: {unique_email}")
    else:
        print("Superuser already exists")
except IntegrityError as e:
    print(f"Error creating superuser: {e}")
    print("Continuing with deployment...")
END

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --no-input

# Start Gunicorn with the correct port and workers
echo "Starting Gunicorn on port $PORT"
exec gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT --workers 2 --threads 2 --timeout 120 --access-logfile - --error-logfile - --log-level debug 