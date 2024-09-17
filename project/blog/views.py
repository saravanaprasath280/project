from rest_framework import status,viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from .models import UserProfile
from .serializers import UserProfileSerializer
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import base64
from io import BytesIO
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import permission_classes
from django.shortcuts import get_object_or_404

@api_view(['POST'])
@permission_classes([AllowAny])
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
        refresh = RefreshToken.for_user(user)
        return Response({'refresh': str(refresh), 'access': str(refresh.access_token)}, status=status.HTTP_200_OK)
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['GET'])
# def dashboard(request):
#     if request.user.is_authenticated:
#         return Response({'message': f'Welcome {request.user.username}'}, status=status.HTTP_200_OK)
#     return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def dashboard(request):
    if request.user.is_authenticated:
        try:
            user_profile = UserProfile.objects.get(user=request.user)
            profile_image_url = user_profile.profile_image.url if user_profile.profile_image else None
        except UserProfile.DoesNotExist:
            profile_image_url = None
        print(profile_image_url)
        return Response({
            'email': f'{request.user.email}',
            'message': f'{request.user.username}',
            'profileImage': profile_image_url
        }, status=status.HTTP_200_OK)
    return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def upload_profile_image(request):
    user = request.user
    if not user.is_authenticated:
        return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
    
    user_profile, created = UserProfile.objects.get_or_create(user=user)
    
    if 'profile_image' in request.FILES:
        user_profile.profile_image = request.FILES['profile_image']
        user_profile.save()
        serializer = UserProfileSerializer(user_profile)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    return Response({'error': 'No image provided'}, status=status.HTTP_400_BAD_REQUEST)


class UserProfileViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def retrieve(self, request, pk=None):
        user = request.user
        try:
            profile = UserProfile.objects.get(user=user)
        except UserProfile.DoesNotExist:
            return Response({'detail': 'Profile not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='upload-profile-image')
    def upload_profile_image(self, request):
        user = request.user
        try:
            profile = UserProfile.objects.get(user=user)
        except UserProfile.DoesNotExist:
            return Response({'detail': 'Profile not found.'}, status=status.HTTP_404_NOT_FOUND)

        if 'profile_image' in request.FILES:
            profile_image = request.FILES['profile_image']
            profile.profile_image = profile_image
            profile.save()
            serializer = UserProfileSerializer(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)

        if 'profile_image' in request.data:
            data_url = request.data['profile_image']
            format, imgstr = data_url.split(';base64,')
            ext = format.split('/')[-1]
            image = ContentFile(base64.b64decode(imgstr), name='temp.' + ext)

            profile.profile_image.save('profile_image.' + ext, image, save=True)
            serializer = UserProfileSerializer(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response({'detail': 'No image provided.'}, status=status.HTTP_400_BAD_REQUEST)
