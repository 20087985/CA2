
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

    def test_read_inventory(self):
        test_item = {
            "id": 999,
            "itemName": "Almond Croissant",
            "category": "Laminated Pastries",
            "expiryDate": "2026-07-15"
        }
        inventory_db.append(test_item)

        response = self.app.get('/api/inventory')
        self.assertEqual(response.status_code, 200)
        
        data = json.loads(response.data)
        self.assertTrue(len(data) > 0)
        self.assertEqual(data[0]["itemName"], "Almond Croissant")

    def test_delete_batch(self):
        test_item = {
            "id": 123,
            "itemName": "Morning Bun",
            "category": "Laminated Pastries",
            "expiryDate": "2026-07-14"
        }
        inventory_db.append(test_item)

        response = self.app.delete('/api/inventory?id=123')
        self.assertEqual(response.status_code, 200)
        
        self.assertEqual(len(inventory_db), 0)

    def test_full_crud_integration(self):
        """Integration Test: Test the entire lifecycle of an inventory batch."""
        create_payload = {
            "itemName": "Integration Test Toastie",
            "category": "Eats & Sandwiches",
            "expiryDate": "2026-07-18"
        }
        create_response = self.app.post('/api/inventory', 
                                         data=json.dumps(create_payload), 
                                         content_type='application/json')
        self.assertEqual(create_response.status_code, 200)
        created_item = json.loads(create_response.data)
        item_id = created_item["id"]

        read_response = self.app.get('/api/inventory')
        self.assertEqual(read_response.status_code, 200)
        current_inventory = json.loads(read_response.data)
        

        found_item = next((item for item in current_inventory if item["id"] == item_id), None)
        self.assertIsNotNone(found_item)
        self.assertEqual(found_item["itemName"], "Integration Test Toastie")

   
        delete_response = self.app.delete(f'/api/inventory?id={item_id}')
        self.assertEqual(delete_response.status_code, 200)


        post_delete_response = self.app.get('/api/inventory')
        post_delete_inventory = json.loads(post_delete_response.data)
        item_still_exists = any(item["id"] == item_id for item in post_delete_inventory)
        self.assertFalse(item_still_exists)


if __name__ == '__main__':
    unittest.main()
