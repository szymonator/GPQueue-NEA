# GPQueue NEA
 This is Szymon Galutowski's NEA repository, named GPQueue.

 Formatting for API calls:
 {'task':[instruction, [data]], 'user':user_token}

Formatting for storing the request in the during/post-processing results dict:
 {user_token:{'status':'processing->processed', 'results':'none'}, ...}

 The [data] does not have to be in a list, depends on the instruction.
 For example, for registering a patient, the task will be: ['register patient', [fname, sname, email, password, dob]]
 However it will be different for some other requests, the instruction determines how the data will look and therefore be retrieved.
 I think i'll keep the processing functions in another file, and import them into Backend.py for usage in the processing function/thread.
