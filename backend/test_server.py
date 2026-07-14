
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


if __name__ == '__main__':
    unittest.main()
