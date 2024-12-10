# System Process Monitoring Application

This project is a **System Process Monitoring Application** built using **Django** (backend) and **React** (frontend). The frontend directory is located alongside `manage.py` and is named `system-monitor-frontend`.

---

## Prerequisites

1. **Python** (3.11.6) and **pip**
2. **Node.js** and **npm**
3. **Virtual environment** (`env` or similar)

---

## Installation and Setup

### Backend (Django)

1. Clone the repository:
    ```bash
    git clone https://github.com/ajay-sps/system-monitoring.git
    cd system-monitoring
    ```

2. Backend Setup:
    ```bash
    python3 -m venv env
    source env/bin/activate   # For Linux/Mac
    env\Scripts\activate      # For Windows
    pip install -r requirements.txt
    python manage.py migrate
    python manage.py runserver
    ```

    The backend will be accessible at [http://127.0.0.1:8000](http://127.0.0.1:8000).

### Frontend Setup (React)

1. Open another terminal for frontend:
    ```bash
    cd system-monitor-frontend
    npm install
    npm start
    ```

    The frontend will be accessible at [http://localhost:3000](http://localhost:3000), where you can manage processes.
