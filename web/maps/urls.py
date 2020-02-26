from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from maps import views

urlpatterns = [
    path('coops/', views.CoopList.as_view()),
    path('coops/<int:pk>/', views.CoopDetail.as_view()),
    path('countries/', views.CountryList.as_view()),
    path('states/<int:pk>/', views.StateList.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)


