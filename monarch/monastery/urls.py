from django.urls import path
from . import views

app_name = 'monastery'

urlpatterns = [
    path('', views.index, name='index'),
    path('virtual/', views.virtual_tours, name='virtual_tours'),
    path('virtual-page2/', views.virtual_page2, name='virtual_page2'),
    path('map/', views.map_view, name='map'),
    path('archive/', views.archive, name='archive'),
    path('calendar/', views.calendar, name='calendar'),
    path('audio/', views.audio_tour, name='audio_tour'),
    path('360/', views.tour_360, name='tour_360'),
    path('api/chatbot/', views.chatbot_api, name='chatbot_api'),
]
