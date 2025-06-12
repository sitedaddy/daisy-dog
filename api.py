#!/usr/bin/env python3
import os
import json
import requests
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import threading

class APIHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/api/reviews':
            self.handle_reviews_request()
        elif parsed_path.path == '/api/place':
            self.handle_place_request()
        else:
            self.send_error(404)
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def handle_reviews_request(self):
        try:
            # Fetch22 Pet Styling Place ID
            place_id = "ChIJ4awl5Vxr1GoRMqAvH9ef19E"
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
            place_id = "ChIJwazJJyvrYmoR_5NFQT_rYOI"
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

def start_api_server():
    server = HTTPServer(('0.0.0.0', 8080), APIHandler)
    print("API server started on http://0.0.0.0:8080")
    server.serve_forever()

if __name__ == '__main__':
    start_api_server()