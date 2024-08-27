from django.db import models
from django.contrib.auth.models import User
# Create your models here.
# class user_data(models.Model):
#     name = models.CharField(max_length=100)  # For storing the user's name
#     email = models.EmailField(max_length=254, unique=True)  # For storing the user's email address
#     mobile_number = models.CharField(max_length=15, unique=True)  # For storing the user's mobile number


class UserProfile(models.Model):
    # Your fields here
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_image = models.ImageField(upload_to='profile_images/')
    # Other fields
    
