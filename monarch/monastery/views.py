from django.shortcuts import render

# Create your views here.
def index(request):
    """Home page view"""
    return render(request, 'index.html')

def virtual_tours(request):
    """Virtual tours page"""
    return render(request, 'virtual.html')

def virtual_page2(request):
    """Virtual tours page 2"""
    return render(request, 'virtual-page2.html')

def map_view(request):
    """Interactive map page"""
    return render(request, 'map.html')

def archive(request):
    """Digital archive page"""
    return render(request, 'archive.html')

def calendar(request):
    """Cultural calendar page"""
    return render(request, 'calenar.html')

def audio_tour(request):
    """Audio tour page"""
    return render(request, 'smartaudio.html')

def tour_360(request):
    """360 degree tour page"""
    return render(request, '360degree.html')

# Chatbot API endpoint
from django.http import JsonResponse
import json

def chatbot_api(request):
    """Handle chatbot API requests"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_message = data.get('message', '').strip().lower()
            
            # Simple response logic (in production, this could be more sophisticated)
            response = get_chatbot_response(user_message)
            
            return JsonResponse({
                'status': 'success',
                'response': response
            })
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            })
    
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})

def get_chatbot_response(message):
    """Generate chatbot responses based on user input"""
    # This is handled by the frontend JavaScript for now
    # In production, you could integrate with AI services here
    return "This endpoint is for future AI integration. Currently handled by frontend."
