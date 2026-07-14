* Student Name:* Basima Salim
* Student Number:* 20087985
* Module Lecturer:* Paul Laird
* Programme:* Master of Science in Information Systems with Computing
* Module/Subject Title:* B9IS123 - PROGRAMMING FOR INFORMATION SYSTEMS
* Assignment Title:* Bread 41 Expiry & Batch Tracker (Assessment 2)
* Submission Date:* July 13, 2026



### Bread 41 Expiry & Batch Tracker

A web-based proof-of-concept Information System designed specifically for 'Bread 41', an artisan organic bakery in Dublin committed to zero waste and sustainable baking operations. This application tracks the production, shelf-life, and disposal of fresh daily sourdough bakes, pastries, and kitchen ferments.

* **Live Application URL:** `http://34.105.141.153/`
* **Live API URL:** `http://34.105.141.153:8000/api`

1. Project Introduction & Overview
Bread 41 produces organic bread and viennoiserie with short, natural shelf lives. Managing active batches and monitoring waste metrics on the production floor is vital to maintaining fresh inventory and controlling food-waste thresholds.

### Data & System Requirements
The system processes two main structures: 'Staff Users' (authentication) and 'Inventory Batches' (operations).
* **C (Create):** Staff logs a new baking batch with its name, production line category, and fresh pull/expiry date.
* **R (Read):** Retrieves active items grouped dynamically into "Active Expiry Alerts" or "Expired/Waste Items" based on real-time date comparisons.
* **U (Update):** Handled dynamically via paginated states and filtering. Items change status states (Safe/Fresh, status-warning, status-critical) as their expiry dates approach.
* **D (Delete):** Safe disposal/removal of items from active storage, logging them out of active database files.

##  2. Project Directory & Core Files
To maintain high maintainability and prevent code tangling, the system cleanly separates front-end client-side logic from the backend server environment:
* `backend/` (Directory containing all backend service assets)
  * `server.py` — The main Python routing and API engine built using native `http.server`.
  * `test_server.py` — The automated unit and integration testing suite.
  * `database.json` — The persistent file-based JSON storage acting as our database.
* `index.html` — The structural semantic user interface layout of the single-page application.
* `styles.css` — Custom responsive grid and flexbox styling (no external CSS framework overhead).
* `app.js` — Dynamic client-side controller logic, UI rendering, pagination, and API connection layer.
* `.github/workflows/deploy.yml` — CI/CD automated test-and-deploy pipeline configuration.

### Core Configuration Files
* `database.json`: Stores persistent JSON state data, containing separated namespaces for `users` and `inventory`.
* `.gitignore`: Tells Git to ignore OS system junk files, temporary test backups (`.bak` files), and credentials.
* `deploy.yml`: Automates testing and VM deployment upon every git commit.

## 3. Data Storage & Management
The backend uses a local file-based storage solution (database.json) inside the backend directory. This provides persistent JSON-formatted state storage across server restarts, acting as an active lightweight database matching the scope of the project.

## 4. Architectural Pattern & API Integration
This application implements a fully decoupled client-server architecture. The frontend operates as a Single Page Application (SPA) utilizing asynchronous browser fetch() APIs to interact with the Python backend server without triggering traditional page reloads.

* Frontend: Built with vanilla HTML5, CSS3, and modern JavaScript (ES6+), running completely independently.
* Backend: Built with a custom native Python HTTP server running on port 8000.

## RESTful API Endpoints Exposed
* POST /api/register — Registers a new baker staff account.
* POST /api/login — Authenticates baker staff and creates session storage.
* GET /api/inventory — Retrieves all logged baking batches.
* POST /api/inventory — Creates a new batch entry.
* DELETE /api/inventory?id={id} — Disposes of / removes a logged batch.

## 5. Front-End Integration & Dynamic DOM
Added a dynamic user interface inside the root folder to connect the frontend with the backend APIs:

* index.html (The Web Page Structure). Simple Layout: Separates the admin registration/login form from the live batch logging table.Form & Table: Includes fields to register new daily batches (Item Name, Category, Expiry Date) and a clean responsive table to display items.
* app.js (The Logic Script). Auto-Load Data: Automatically fetches and shows existing database records as soon as the page loads.Form Submission (POST): Stops default page reload, parses input fields into JSON, and fetches the backend API to create records.Dynamic 5-Row Pagination: Handles active batch slices in blocks of exactly 5 rows per page, mathematically evaluating start/end index boundaries based on dynamic page navigation.Real-time DOM Updates: Automatically alters row CSS styles to identify "Expired" or "Expiring Soon" products based on date offsets.

## 6. Automated Testing & Debugging
We have written and structured automated unit and integration tests inside /backend/test_server.py using Python's native unittest standard library. 

* test_a_create_batch: Validates creating a batch, returning HTTP 201 Created status, and confirming accurate payload storage. 
* test_b_read_inventory: Validates GET requests, verifying JSON schemas and array counts.
* test_c_delete_batch: Runs an end-to-end integration flow where a batch is created, isolated, deleted, and then verified to no longer exist in subsequent requests.

## 7. CI/CD Deployment Pipeline & DevOps
This project is configured with an automated GitOps delivery pipeline via GitHub Actions (.github/workflows/deploy.yml).

* Continuous Integration (CI): On every push to main, a headless runner spins up an Ubuntu environment, checks out the code, configures a Python environment, and automatically runs our backend test suite inside the backend folder.
* Continuous Deployment (CD): If and only if the tests pass successfully, the runner securely connects to our Google Cloud Linux VM via SSH, executes a git pull origin main, and restarts the background systemd daemon service (bakery-backend.service).


## 8. How to Install and Run Locally

* Clone this repository
* Navigate into the backend directory
* Run the backend server locally using Python: python3 server.py
* Open your browser and open index.html from the root directory to access the dynamic web portal.


## 10. References & Technical Citations

### Documentation & Web Standards
* **W3Schools** (2026). *HTML Forms and JavaScript Web APIs*. Available at: [https://www.w3schools.com/html/](https://www.w3schools.com/html/) and [https://www.w3schools.com/js/](https://www.w3schools.com/js/) (Accessed: July 2026).
* **Mozilla Developer Network (MDN) Web Docs** (2026). *DOM Event Architecture and Fetch API*. Available at: [https://developer.mozilla.org/en-US/](https://developer.mozilla.org/en-US/) (Accessed: July 2026).
* **Python Software Foundation** (2026). *BaseHTTPRequestHandler and SocketServer Libraries*. Python 3.10 Documentation. Available at: [https://docs.python.org/3/library/http.server.html](https://docs.python.org/3/library/http.server.html) (Accessed: July 2026).
* **Python Software Foundation** (2026). *Unittest — Unit testing framework*. Python 3.10 Documentation. Available at: [https://docs.python.org/3/library/unittest.html](https://docs.python.org/3/library/unittest.html) (Accessed: July 2026).
* **Google Cloud Platform** (2026). *Compute Engine VM Instance & VPC Firewall Documentation*. Available at: [https://cloud.google.com/docs](https://cloud.google.com/docs) (Accessed: July 2026).



### Detailed AI Contribution Log

| **Authentication & UI Layout** | W3C HTML Specs & Gemini | Adapted the baseline HTML5 registration/login forms. Used Gemini to clean up errors in the JavaScript session authentication verification. |
| **CSS Styling (Main App)** | Gemini helped to style the grids, table and the views. 
| **Backend Delete Handler** | Gemini | Assisted in structuring the `do_DELETE` parsing methods in our native Python `server.py`. |
| **Client Fetching & DOM Logic** | Gemini | Assisted with identifying asynchronous callback issues in the API fetch operations |
| **CI/CD Configuration** | GitHub Docs & Gemini helped in the google cloud deployment and github actions setup

### DECLARATION OF ACADEMIC INTEGRITY

By submitting this assignment, I am confirming that:
1. This assignment is entirely my own work;
2. Any external sources or documentation used have been explicitly referenced;
3. I have followed the Generative AI guidelines set out in the Assignment Brief 
   under Level 4 (AI Task Completion, Human Evaluation);
4. I have read and understood the College rules regarding academic integrity in 
   the QAH Part B Section 3, and understand that standard matching checks (such 
   as Ouriginal/Turnitin) are applied to verify originality.

Signed: Basima Salim
Date: July 13, 2026





