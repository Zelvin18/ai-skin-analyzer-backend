from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .views import (
    UserViewSet, UploadedImageViewSet, ProductViewSet, AppointmentViewSet,
    EmailTokenObtainPairView
)

# Create a public API root view
@api_view(['GET'])
@permission_classes([AllowAny])
def public_api_root(request):
    return Response({
        'users': '/api/users/',
        'token': '/api/token/',
        'token_refresh': '/api/token/refresh/',
        'register': '/api/register/',
    })

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'images', UploadedImageViewSet, basename='image')
router.register(r'products', ProductViewSet)
router.register(r'appointments', AppointmentViewSet, basename='appointment')

urlpatterns = [
    path('', public_api_root, name='api-root'),
    path('', include(router.urls)),
    path('token/', EmailTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', UserViewSet.as_view({'post': 'create'}), name='register'),
] 