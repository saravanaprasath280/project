"""from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.decorators import login_required
# Create your views here.


def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')
    else:
        form = UserCreationForm()
    return render(request, 'register.html', {'form': form})

def login(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            auth_login(request, user)
            return redirect('dashboard')
    else:
        form = AuthenticationForm()
    return render(request, 'login.html', {'form': form})

@login_required
def dashboard(request):
    return render(request, 'dashboard.html', {'user': request.user})

def logout(request):
    auth_logout(request)
    return redirect('login')

def saravana(request):
    return render(request, 'saravana.html', {'user': request.user})
"""
# myapp/views.py
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate, login as auth_login
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import IntegrityError
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.conf import settings
from .models import UserProfile
from django.contrib.auth.decorators import login_required
import json

@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')

    try:
        user = User.objects.create_user(username=username, password=password, email=email)
        user.save()
        return Response({'message': 'User created'}, status=status.HTTP_201_CREATED)
    except IntegrityError:
        return Response({'error': 'Username or email already exists'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user is not None:
        auth_login(request, user)
        # Generate token
        refresh = RefreshToken.for_user(user)
        
        return Response({'refresh': str(refresh), 'access': str(refresh.access_token)}, status=status.HTTP_200_OK)
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def dashboard(request):
    # print('test')
    print(request.user)
    if request.user.is_authenticated:
        return Response({'message': f'Welcome {request.user.username}'}, status=status.HTTP_200_OK)
    return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

def logout(request):
    auth_logout(request)
    return redirect('login')

@csrf_exempt  # Ensure the user is logged in
def upload_profile_image(request):
    if request.method == 'POST':
        user = request.user
        if not user.is_authenticated:
            return JsonResponse({'error': 'User not authenticated'}, status=401)
        
        if 'profile_image' in request.FILES:
            profile_image = request.FILES['profile_image']
            # Save the file
            file_url = default_storage.save('media/' + profile_image.name, profile_image)
            
            # Update the user's profile image URL
            user_profile = get_object_or_404(UserProfile, user=user)
            user_profile.profile_image = file_url
            user_profile.save()

            return JsonResponse({'success': 'Profile image updated successfully'})
        else:
            return JsonResponse({'error': 'No file uploaded'}, status=400)
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)


def profile_view(request):
    # Your view logic here
    pass
