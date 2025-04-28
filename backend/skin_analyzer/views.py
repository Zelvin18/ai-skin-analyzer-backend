from rest_framework import viewsets, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import action, permission_classes
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import UserSerializer

User = get_user_model()

class EmailTokenObtainPairView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'token', 'token_refresh']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

class UploadedImageViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    # Add your image-related fields and methods here

class ProductViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    # Add your product-related fields and methods here

class AppointmentViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    # Add your appointment-related fields and methods here 