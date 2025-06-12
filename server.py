#!/usr/bin/env python3
import os
import json
import requests
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import mimetypes

class WebHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urlparse(self.path)
        
        # API endpoints
        if parsed_path.path == '/api/reviews':
            self.handle_reviews_request()
        elif parsed_path.path == '/api/place':
            self.handle_place_request()
        # Static file serving
        else:
            self.serve_static_file(parsed_path.path)
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def serve_static_file(self, path):
        # Default to index.html for root path
        if path == '/':
            path = '/index.html'
        
        file_path = '.' + path
        
        try:
            with open(file_path, 'rb') as f:
                content = f.read()
            
            # Determine content type
            content_type, _ = mimetypes.guess_type(file_path)
            if content_type is None:
                content_type = 'application/octet-stream'
            
            self.send_response(200)
            self.send_header('Content-Type', content_type)
            self.end_headers()
            self.wfile.write(content)
            
        except FileNotFoundError:
            self.send_error(404)
        except Exception as e:
            self.send_error(500)
    
    def handle_reviews_request(self):
        try:
            # Daisy Dog Pet Grooming Place ID
            place_id = "ChIJuXPUd1i712oRN1eR-J82Or4"
            api_key = os.environ.get('GOOGLE_PLACES_API_KEY')
            
            if not api_key:
                self.send_error_response("API key not configured")
                return
            
            # Google Places API URL
            url = f"https://maps.googleapis.com/maps/api/place/details/json"
            params = {
                'place_id': place_id,
                'fields': 'rating,reviews,user_ratings_total,name,formatted_address,formatted_phone_number,opening_hours',
                'key': api_key
            }
            
            response = requests.get(url, params=params)
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get('status') == 'OK':
                    self.send_json_response(data)
                else:
                    self.send_error_response(f"Google API error: {data.get('status')}")
            else:
                self.send_error_response(f"HTTP error: {response.status_code}")
                
        except Exception as e:
            self.send_error_response(f"Server error: {str(e)}")
    
    def handle_place_request(self):
        try:
            place_id = "ChIJuXPUd1i712oRN1eR-J82Or4"
            api_key = os.environ.get('GOOGLE_PLACES_API_KEY')
            
            if not api_key:
                self.send_error_response("API key not configured")
                return
            
            url = f"https://maps.googleapis.com/maps/api/place/details/json"
            params = {
                'place_id': place_id,
                'fields': 'name,formatted_address,formatted_phone_number,opening_hours,website,rating,user_ratings_total',
                'key': api_key
            }
            
            response = requests.get(url, params=params)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('status') == 'OK':
                    self.send_json_response(data)
                else:
                    self.send_error_response(f"Google API error: {data.get('status')}")
            else:
                self.send_error_response(f"HTTP error: {response.status_code}")
                
        except Exception as e:
            self.send_error_response(f"Server error: {str(e)}")
    
    def send_json_response(self, data):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
    
    def send_error_response(self, message):
        self.send_response(500)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        error_data = {'error': message}
        self.wfile.write(json.dumps(error_data).encode())

def start_server():
    server = HTTPServer(('0.0.0.0', 5000), WebHandler)
    print("Combined web and API server started on http://0.0.0.0:5000")
    server.serve_forever()

if __name__ == '__main__':
    start_server()