
# myapp/urls.py
from django.urls import path
from .views import *
from .views import upload_profile_image

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('dashboard/', dashboard, name='dashboard'),
    path('logout/', logout, name='logout'),
    path('upload-profile-image/', upload_profile_image, name='upload_profile_image'),
]

