#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Starting fresh deployment..."

# Install Python dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Set default port
export PORT=${PORT:-10000}
echo "Using port: $PORT"

# Run migrations
echo "Running migrations..."
python manage.py migrate

# Create superuser
echo "Creating superuser..."
python manage.py shell << END
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin')
    print("Superuser created successfully")
else:
    print("Superuser already exists")
END

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --no-input

# Start Gunicorn
echo "Starting Gunicorn..."
exec gunicorn backend.wsgi:application \
    --bind 0.0.0.0:$PORT \
    --workers 1 \
    --threads 4 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile - \
    --log-level debug \
    --worker-class=sync \
    --forwarded-allow-ips="*" \
    --proxy-allow-from="*" \
    --keep-alive 5 \
    --max-requests 1000 \
    --max-requests-jitter 50 