
# Backend Guide: Implementing the Contact Us Endpoint

## Objective

To create a Django REST Framework endpoint that allows users to submit messages through the "Contact Us" form on the frontend.

## 1. Create a New Django App

It's good practice to encapsulate functionality. Let's create a new app called `contacts`.

```bash
python manage.py startapp contacts
```

## 2. Add the App to `INSTALLED_APPS`

In your project's `settings.py` file, add the new `contacts` app to the `INSTALLED_APPS` list:

```python
INSTALLED_APPS = [
    # ... other apps
    'contacts',
    'rest_framework',
]
```

## 3. Define the Model

In `contacts/models.py`, define the model to store the contact messages:

```python
from django.db import models

class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.name}"
```

## 4. Create the Serializer

In `contacts/serializers.py` (you may need to create this file), define the serializer for the `ContactMessage` model:

```python
from rest_framework import serializers
from .models import ContactMessage

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'message', 'created_at']
```

## 5. Create the View

In `contacts/views.py`, create the view to handle the creation of new contact messages:

```python
from rest_framework import generics
from .models import ContactMessage
from .serializers import ContactMessageSerializer

class ContactMessageCreateView(generics.CreateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
```

## 6. Configure URLs

Create a `contacts/urls.py` file and add the following:

```python
from django.urls import path
from .views import ContactMessageCreateView

urlpatterns = [
    path('contact/', ContactMessageCreateView.as_view(), name='contact-create'),
]
```

Now, include these URLs in your project's main `urls.py` file:

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # ... other includes
    path('api/', include('contacts.urls')),
]
```

## 7. Run Migrations

Create and apply the database migrations:

```bash
python manage.py makemigrations contacts
python manage.py migrate
```

## 8. Example Request and Response

The frontend will send a `POST` request to `/api/contact/` with the following JSON payload:

**Request:**

```json
{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "message": "I have a question about your services."
}
```

**Successful Response (201 Created):**

```json
{
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "message": "I have a question about your services.",
    "created_at": "2025-08-04T12:00:00.000000Z"
}
```
