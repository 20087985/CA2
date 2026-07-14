
import unittest
import json
import os
import sys


sys.path.append(os.path.dirname(os.path.abspath(__file__)))


from server import app, inventory_db  

class TestBakeryBackend(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
        
        self.original_inventory = list(inventory_db)
        inventory_db.clear()
    
    def tearDown(self):
        inventory_db.clear()
        inventory_db.extend(self.original_inventory)

    def test_create_batch(self):
        payload = {
            "itemName": "Organic Sourdough",
            "category": "Sourdough & Loaves",
            "expiryDate": "2026-07-16"
        }
        response = self.app.post('/api/inventory', 
                                 data=json.dumps(payload), 
                                 content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn("id", data)
        self.assertEqual(data["itemName"], "Organic Sourdough")


if __name__ == '__main__':
    unittest.main()
