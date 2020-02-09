from django.shortcuts import render

def start(request):
    context = {
    }
    return render(request, 'maps/start.html', context)

