echo "setting up planner environment"

# make sure venv exists
if [[ ! -d "venv" ]]; then
      python3 -m venv venv
      source venv/bin/activate
      pip install -r requirements.txt
else
      source venv/bin/activate
fi

alias db="sqlite3 data/database.db"


########
# Uncomment the below function, and paste in bashrc for easy setup. 
# Change the the path on the first line to the correct location of your planner project.

# function to set up the planner project
# function planner() {
#     cd {PROJECT_DIRECTORY} || return
#     # if -f --frontend is provided, run only the frontend
#     if [[ "$1" == "-f" || "$1" == "--frontend" ]]; then
#         cd frontend || return
#         npm run dev
#         return
#     fi
#     # if -d --dev is provided, run it it in dev mode
#     if [[ "$1" == "-d" || "$1" == "--dev" ]]; then
#         source venv/bin/activate
#         python dev.py
#     fi
#     # if -e --edit is provided, open neovim
#     if [[ "$1" == "-e" || "$1" == "--edit" ]]; then
#         source venv/bin/activate
#         nvim
#         return
#     fi
# }


echo "planner environment setup complete"
