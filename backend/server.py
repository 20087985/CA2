import json
import os
from http.server import BaseHTTPRequestHandler, HTTPServer

PORT = 8000
DB_FILE = os.path.join(os.path.dirname(__file__), 'database.json')


if not os.path.exists(DB_FILE):
    with open(DB_FILE, 'w') as f:
        json.dump([], f)

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
        """ READ Operation """
        if self.path == "/api/inventory":
            self._set_headers(200)
            with open(DB_FILE, 'r') as f:
                data = json.load(f)
            self.wfile.write(bytes(json.dumps(data), "utf-8"))
        else:
            self._set_headers(404)

def run_server():
    print(f"FreshTrack CRUD API Server running live at http://localhost:{PORT}")
    server = HTTPServer(('localhost', PORT), BakeryInventoryHandler)
    server.serve_forever()

if __name__ == "__main__":
    run_server()