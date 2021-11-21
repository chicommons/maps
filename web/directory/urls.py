from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from directory import views
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('data', views.data, name='data'),
    path('coops/no_coords', views.coops_wo_coordinates, name='coops_wo_coordinates'),
    path('coops/unapproved', views.unapproved_coops, name='unapproved_coops'),
    path('coops/', views.CoopList.as_view()),
    path('coops/<int:pk>/', views.CoopDetail.as_view()),
    path('people/', views.PersonList.as_view()),
    path('people/<int:pk>/', views.PersonDetail.as_view()),
    path('predefined_types/', views.CoopTypeList.as_view()),
    path('coop_types/', views.CoopTypeList.as_view()),
    path('countries/', views.CountryList.as_view()),
    path('states/<country_code>', views.StateList.as_view()),
    path('save_to_sheet_from_form/', views.save_to_sheet_from_form, name="save_to_sheet_from_form"),
    path('login', views.signin),
    path('user_info', views.user_info),
]

urlpatterns = format_suffix_patterns(urlpatterns)


