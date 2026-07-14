import unittest
import json
import os
import threading
import time
import urllib.request
import urllib.error


from server import run_server, PORT

class TestBakeryBackendHTTP(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Start the HTTP server in a background thread on a test port."""
        cls.test_port = 8001
        cls.base_url = f"http://127.0.0.1:{cls.test_port}/api"
        

        cls.db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'database.json')
        cls.backup_path = cls.db_path + '.bak'
        if os.path.exists(cls.db_path):
            os.rename(cls.db_path, cls.backup_path)
            

        with open(cls.db_path, 'w') as f:
            json.dump({"users": [], "inventory": []}, f)


        import server
        server.PORT = cls.test_port

 
        cls.server_thread = threading.Thread(target=run_server, daemon=True)
        cls.server_thread.start()
        

        time.sleep(0.5)

    @classmethod
    def tearDownClass(cls):
        """Restore the original database once all tests finish."""
        if os.path.exists(cls.db_path):
            os.remove(cls.db_path)
        if os.path.exists(cls.backup_path):
            os.rename(cls.backup_path, cls.db_path)

    def test_a_create_batch(self):
        """Test CREATE: Log a new production line entry via POST."""
        url = f"{self.base_url}/inventory"
        payload = {
            "itemName": "Sourdough Boule",
            "category": "Sourdough & Loaves",
            "expiryDate": "2026-07-20"
        }
        data = json.dumps(payload).encode('utf-8')
        
        req = urllib.request.Request(
            url, 
            data=data, 
            headers={'Content-Type': 'application/json'},
            method='POST'
        )
        
        with urllib.request.urlopen(req) as response:
            self.assertEqual(response.status)
            res_data = json.loads(response.read().decode('utf-8'))
            self.assertEqual(res_data["itemName"], "Sourdough Boule")
            self.assertIn("id", res_data)

    def test_b_read_inventory(self):
        """Test READ: Retrieve logged entries via GET."""
        url = f"{self.base_url}/inventory"
        req = urllib.request.Request(url, method='GET')
        
        with urllib.request.urlopen(req) as response:
            self.assertEqual(response.status)
            res_data = json.loads(response.read().decode('utf-8'))
            self.assertTrue(isinstance(res_data, list))
            self.assertTrue(len(res_data) > 0)
            self.assertEqual(res_data[0]["itemName"], "Sourdough Boule")

    def test_c_delete_batch(self):
        """Test DELETE: Remove a specific batch entry via DELETE request."""
        url_get = f"{self.base_url}/inventory"
        with urllib.request.urlopen(url_get) as get_res:
            items = json.loads(get_res.read().decode('utf-8'))
            item_id = items[0]['id']


        url_delete = f"{self.base_url}/inventory?id={item_id}"
        req = urllib.request.Request(url_delete, method='DELETE')
        
        with urllib.request.urlopen(req) as response:
            self.assertEqual(response.status)
            res_data = json.loads(response.read().decode('utf-8'))
            self.assertEqual(res_data["message"], "Removed successfully")


        with urllib.request.urlopen(url_get) as verify_res:
            remaining_items = json.loads(verify_res.read().decode('utf-8'))
            item_exists = any(item['id'] == item_id for item in remaining_items)
            self.assertFalse(item_exists)

if __name__ == '__main__':
    unittest.main()