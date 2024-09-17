from django.urls import path,include
from .views import register, login, dashboard, upload_profile_image
from .views import UserProfileViewSet
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'profile', UserProfileViewSet, basename='profile')

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('dashboard/', dashboard, name='dashboard'),
    path('upload-profile-image/', upload_profile_image, name='upload_profile_image'),
]
