export {
    uponLogin,
    uponRegister,
    fetchDates,
    fetchAppointments,
    chooseAppointment,
    endBookingSession,
    fetchPast,
    fetchFuture,
    fetchApptAmount,
    refreshJWT
};

const domain = 'http://127.0.0.1:5000/';

function uponLogin(email, password, callback) {
    fetch(domain + 'get_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password }),
        credentials: 'include'
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Login failed!');
            }
            return response.json();
        })
        .then((data) => {
            console.log('message:', data['message']);
            console.log('token received:', data['token']);
            sessionStorage.setItem('jwt', data['token']);
            sessionStorage.setItem('refresh_token', data['refresh_token']);

            fetch(domain + '/get_name', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data['token']}`
                },
                credentials: 'include'
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Couldn't fetch name :(");
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data['name']);
                    callback(data);
                })
                .catch(error => {
                    console.error('Error:', error.message);
                });

        })
        .catch((error) => {
            console.error('Error:', error);
            callback('failed');
        });
}

function uponRegister(fname, sname, email, type, password, dob, callback) {
    fetch(domain + 'register', {
        method: 'POST',
        body: JSON.stringify({ fname: fname, sname: sname, email: email, type: type, password: password, dob: dob }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Couldn't register/get JWT :(");
            }
            return response.json();
        })
        .then((data) => {
            if (data['error'] === "Email in use") {
                throw new Error("Email in use");
            }
            console.log('token:', data['token']);
            sessionStorage.setItem('jwt', data['token']);
            sessionStorage.setItem('refresh_token', data['refresh_token']);
            callback(1);
        })
        .catch(error => {
            console.error('Error:', error.message || error);
            callback(0);
        });
}

function fetchDates(priority, callback, retried = false) {
    const token = sessionStorage.getItem('jwt');
    fetch(domain + `fetchDates?priority=${priority}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
    })
        .then((response) => {
            if (response.status === 401) {
                console.log('Token expired or unauthorised access');
                throw new Error('refresh');
            } else if (!response.ok) {
                throw new Error("Couldn't fetch dates :(");
            }
            return response.json();
        })
        .then((data) => {
            if (data['error']) {
                throw new Error(data['error']);
            }
            console.log(data['message']);
            callback(data['dates']);
        })
        .catch(async (error) => {
            console.error('Error:', error.message || error);
            if (error.message === 'refresh' && !retried) {
                try{
                    await refreshJWT();
                    fetchDates(priority, callback, true)
                } catch(error) {
                    console.error('Failed to refresh token:', error.message || error);
                    callback('error')
                }
            } else {
                callback('error');
            }
        });
}

function fetchAppointments(priority, dates, times, callback, retried=false) {
    const token = sessionStorage.getItem('jwt');
    fetch(domain + 'fetchAppointments', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ priority, dates, times }),
        credentials: 'include'
    })
        .then((response) => {
            if (response.status === 401) {
                console.log('Token expired or unauthorised access');
                throw new Error('refresh');
            } else if (!response.ok) {
                throw new Error("Couldn't fetch appointments :(");
            }
            return response.json();
        })
        .then((data) => {
            if (data['error']) {
                throw new Error(data['error']);
            }
            callback(data['appts']);
        })
        .catch(async (error) => {
            console.error('Error:', error.message || error);
            if (error.message === 'refresh' && !retried) {
                try {
                    await refreshJWT();
                    fetchAppointments(priority, dates, times, callback, true)
                } catch (error) {
                    console.error('Failed to refresh token: ', error.message || error);
                    callback('error')
                }
            } else {
                callback('error');
            }
        });
}

function fetchApptAmount(type, callback, retried=false) {
    const token = sessionStorage.getItem('jwt');
    fetch(domain + `fetchApptAmount?type=${type}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
    })
        .then((response) => {
            if (response.status === 401) {
                console.log('Token expired or unauthorised access');
                throw new Error('refresh');
            } else if (!response.ok) {
                throw new Error("fetch failed :(");
            }
            return response.json();
        })
        .then((data) => {
            if (data['error']) {
                throw new Error(data['error']);
            }
            callback(type === 'patient' ? data['amount'] : [data['amount'], data['todayAmount']]);
        })
        .catch(async (error) => {
            console.error('Error:', error.message || error);
            if (error.message === 'refresh' && !retried) {
                try{
                    await refreshJWT();
                    fetchApptAmount(type, callback, true);
                }catch(error){
                    console.error('Failed to refresh token: ', error.message || error)
                    callback('error')
                }
            } else {
                callback('error');
            }
        });
}

function fetchPast(type, callback, retried=false) {
    const token = sessionStorage.getItem('jwt');
    fetch(domain + `fetchPast?type=${type}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
    })
        .then((response) => {
            if (response.status === 401) {
                console.log('Token expired or unauthorised access');
                throw new Error('refresh');
            } else if (!response.ok) {
                throw new Error("fetch failed :(");
            }
            return response.json();
        })
        .then((data) => {
            if (data['error']) {
                throw new Error(data['error']);
            }
            callback(data['appts']);
        })
        .catch(async (error) => {
            console.error('Error:', error.message || error);
            if (error.message === 'refresh' && !retried) {
                try {
                    await refreshJWT();
                    fetchPast(type, callback, true)
                } catch (error) {
                    console.error('Failed to refresh token: ', error.message || error);
                    callback('error')
                }
            } else {
                callback('error');
            }
        });
}

function fetchFuture(type, callback, retried=false) {
    const token = sessionStorage.getItem('jwt');
    fetch(domain + `fetchFuture?type=${type}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
    })
        .then((response) => {
            if (response.status === 401) {
                console.log('Token expired or unauthorised access');
                throw new Error('refresh');
            } else if (!response.ok) {
                throw new Error("fetch failed :(");
            }
            return response.json();
        })
        .then((data) => {
            if (data['error']) {
                throw new Error(data['error']);
            }
            callback(data['appts']);
        })
        .catch(async (error) => {
            console.error('Error:', error.message || error);
            if (error.message === 'refresh' && !retried) {
                try {
                    await refreshJWT();
                    fetchFuture(type, callback, true)
                } catch (error) {
                    console.error('Failed to refresh token: ', error.message || error);
                    callback('error')
                }
            } else {
                callback('error');
            }
        });
}

function chooseAppointment(appt, callback, retried=false) {
    const token = sessionStorage.getItem('jwt');
    fetch(domain + 'chooseAppointment', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ appt }),
        credentials: 'include'
    })
        .then((response) => {
            console.log('response: ', response)
            if (response.status === 401) {
                console.log('Token expired or unauthorised access');
                throw new Error('refresh');
            } else if (!response.ok) {
                throw new Error("Booking failed :(");
            }
            return response.json();
        })
        .then((data) => {
            if (data['error']) {
                throw new Error(data['error']);
            }
            callback(data['msg']);
        })
        .catch(async (error) => {
            console.error('Error:', error.message || error);
            if (error.message === 'refresh' && !retried) {
                try {
                    await refreshJWT();
                    chooseAppointment(appt, callback, true)
                } catch (error) {
                    console.error('Failed to refresh token: ', error.message || error);
                    callback('error')
                }
            } else {
                callback('error')
            }
        });
}

function endBookingSession(callback, retried=false) {
    const token = sessionStorage.getItem('jwt');
    fetch(domain + 'endBookingSession', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
    })
        .then((response) => {
            if (response.status === 401) {
                console.log('Token expired or unauthorised access');
                throw new Error('refresh');
            } else if (!response.ok) {
                throw new Error("Exit failed :(");
            }
            return response.json();
        })
        .then((data) => {
            if (data['error']) {
                throw new Error(data['error']);
            }
            callback(data['msg']);
        })
        .catch(async (error) => {
            console.error('Error:', error.message || error);
            if (error.message === 'refresh' && !retried) {
                try {
                    await refreshJWT();
                    endBookingSession(callback, true)
                } catch (error) {
                    console.error('Failed to refresh token: ', error.message || error);
                    callback('error')
                }
            } else {
                callback('error');
            }
        });
}

function refreshJWT() {
    const refreshToken = sessionStorage.getItem('refresh_token');
    console.log('refreshJWT function is running');

    if (refreshToken) {
        return fetch(domain + '/refreshJWT', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${refreshToken}`
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
            credentials: 'include'
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('JWT refresh failed!');
                }
                return response.json();
            })
            .then((data) => {
                console.log('message:', data['message']);
                console.log('token received:', data['token']);
                sessionStorage.setItem('jwt', data['token']);
            })
            .catch((error) => {
                console.error('Error:', error.message || error);
                throw error;
            });
    }

    return Promise.reject(new Error('No refresh token found'));
}
