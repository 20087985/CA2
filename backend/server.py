import json
import os
from http.server import BaseHTTPRequestHandler, HTTPServer

PORT = 8000
DB_FILE = os.path.join(os.path.dirname(__file__), 'database.json')

class BakeryInventoryHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Content-Type", "application/json")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(200)

    def do_GET(self):
        if self.path == "/api/inventory":
            self._set_headers(200)
            with open(DB_FILE, 'r') as f:
                data = json.load(f)
            self.wfile.write(bytes(json.dumps(data.get("inventory", [])), "utf-8"))
        else:
            self._set_headers(404)

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        payload = json.loads(post_data.decode('utf-8'))

        with open(DB_FILE, 'r+') as f:
            db_data = json.load(f)

            if self.path == "/api/register":
                # Check if username exists
                if any(u['username'] == payload['username'] for u in db_data['users']):
                    self._set_headers(400)
                    self.wfile.write(bytes(json.dumps({"message": "User exists"}), "utf-8"))
                    return
                db_data['users'].append(payload)
                self._set_headers(201)
                self.wfile.write(bytes(json.dumps({"message": "Registration successful"}), "utf-8"))

            elif self.path == "/api/login":
                user_match = any(u['username'] == payload['username'] and u['password'] == payload['password'] for u in db_data['users'])
                if user_match:
                    self._set_headers(200)
                    self.wfile.write(bytes(json.dumps({"message": "Login successful", "username": payload['username']}), "utf-8"))
                else:
                    self._set_headers(401)
                    self.wfile.write(bytes(json.dumps({"message": "Invalid credentials"}), "utf-8"))

            elif self.path == "/api/inventory":
                payload['id'] = len(db_data['inventory']) + 1
                db_data['inventory'].append(payload)
                self._set_headers(201)
                self.wfile.write(bytes(json.dumps(payload), "utf-8"))

            f.seek(0)
            json.dump(db_data, f, indent=4)
            f.truncate()

    def do_DELETE(self):
        if self.path.startswith("/api/inventory"):
            from urllib.parse import urlparse, parse_qs
            query = parse_qs(urlparse(self.path).query)
            item_id = int(query.get('id')[0])

            with open(DB_FILE, 'r+') as f:
                db_data = json.load(f)
                db_data['inventory'] = [item for item in db_data['inventory'] if item.get('id') != item_id]
                f.seek(0)
                json.dump(db_data, f, indent=4)
                f.truncate()

            self._set_headers(200)
            self.wfile.write(bytes(json.dumps({"message": "Removed successfully"}), "utf-8"))

def run_server():
    server = HTTPServer(('', PORT), BakeryInventoryHandler)
    server.serve_forever()

if __name__ == "__main__":
    run_server()