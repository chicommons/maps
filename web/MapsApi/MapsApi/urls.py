from django.urls import path, include
from django.contrib import admin
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('api/v1/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/v1/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/v1/admin/', admin.site.urls),

    path('api/v1/users/', include('apps.users.urls')),
    path('api/v1/auth/', include('apps.users.urls_auth')),

    path('api/v1/coops/', include('apps.directory.urls')),
    path('api/v1/geo/', include('apps.directory.urls_geo')),
]
