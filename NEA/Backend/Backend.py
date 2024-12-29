from threading import Thread, Lock
from flask import Flask, request, jsonify
from Queue import Queue
from Processing_Funcs import *
import psycopg2

app = Flask(__name__)


task_queue = Queue()
task_results_dict = {}

result_lock = Lock()

@app.route('/add_task', methods=['POST'])
def add_task():
    request = request.json
    if not request or 'task' not in request:
        return jsonify({'error': 'task is missing, please resend nerd'}), 400
    
    task_queue.put(request)


def processor():
    while True:
        request = task_queue.get()  # Wait for a task
        with result_lock:
            task_results_dict[request['user']] = {'status':'processing', 'results':'none'}
        # PROCESSING GOES HERE

        if request['task'][0] == 'register patient':
            result = register_patient(request['task'][1])
        elif False:
            pass
        else:
            print('nothing')
        
        with result_lock:
            task_results_dict[request['user']] = {'status': 'completed', 'result': result}
    
@app.route('/task_status/<user>', methods=['GET'])
def task_status(user):
    with result_lock:
        if user not in task_results_dict:
            return jsonify({'error': 'Task ID not found'}), 404

        results = task_results_dict[user]
        del task_results_dict[user]
        return jsonify(results)


worker_thread = Thread(target=processor, daemon=True)
worker_thread.start()

# starts the backend
if __name__ == '__main__':
    app.run(debug=True)