# Planner

A simplistic task planner application designed to help users organize 
the tasks they want to get done, cross referenced with their things 
and goals. It is suitable for a household with multiple users. 


## Features

- User Management: Create multiple users and assign tasks
- Asset management: Create an asset tree to organize your things
- Goal tracking: Set and track milestones to group your tasks
- Task management: Create, assign, and track tasks, assign to 
  assets, goals, and users
- Scheduling: Scheduling of tasks based on day of month,
  day of week, or day of year


## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/topper3418/planner_v2.git
   cd planner_v2
   ```
2. Install dependencies:

   on mac/linux:

   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

   on windows:

   ```bash
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Set up the database:

   ```bash
   python seed_database.db
   ```

   This creates a development database with some sample data.
   If you want to start fresh with just the default categories,
   pass a --fresh flag:

   ```bash
   python seed_database.db --fresh
   ```

4. Run the application:

    ```bash
    python dev.py
    ```

5. Open a new terminal window and run the dev frontend:

    ```bash
    cd frontend
    npm install
    npm run dev
    ```

6. (Optional) run the scheduler if you plan to leave this open long term

   ```bash
   python scheduler.py
   ```

7. Open your browser and navigate to `http://localhost:5173` to access


## Deployment

For deployment, check the readme in the `server` folder. It will guide
setup on a linux server

