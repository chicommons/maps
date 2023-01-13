from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from directory import views
from directory import settings
from rest_framework.authtoken.views import obtain_auth_token
from django.contrib.auth import views as auth_views
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('data', views.data, name='data'),
    path('coops/no_coords', views.coops_wo_coordinates, name='coops_wo_coordinates'),
    path('coops/unapproved', views.unapproved_coops, name='unapproved_coops'),
    path('coops/', views.CoopList.as_view()),
    path('coops/<int:pk>/', views.CoopDetail.as_view()),
    path('coops/all/', views.CoopListAll.as_view()),
    path('people/', views.PersonList.as_view()),
    path('people/<int:pk>/', views.PersonDetail.as_view()),
    path('users/', views.CreateUserView.as_view()),
    path('predefined_types/', views.CoopTypeList.as_view()),
    path('coop_types/', views.CoopTypeList.as_view()),
    path('countries/', views.CountryList.as_view()),
    path('states/<country_code>', views.StateList.as_view()),
    path('login', views.signin),
    path(settings.LOGOUT_PATH, views.signout),
    path('user_info', views.user_info),
    path('reset_password', views.ResetPasswordView.as_view(template_name='../templates/users/password_reset.html'), name='reset_password'),
    path('password-reset-confirm/<uidb64>/<token>/',
         auth_views.PasswordResetConfirmView.as_view(template_name='users/password_reset_confirm.html'),
         name='password_reset_confirm'),
    path('password-reset-complete/',
         auth_views.PasswordResetCompleteView.as_view(template_name='users/password_reset_complete.html'),
         name='password_reset_complete'),
]

urlpatterns = format_suffix_patterns(urlpatterns)


