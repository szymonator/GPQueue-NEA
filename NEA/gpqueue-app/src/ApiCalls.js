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

async function uponLogin(email, password, callback) {
    try{
        const loginResponse = await fetch(domain + 'get_token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password }),
            credentials: 'include'
        })
            if (!loginResponse.ok) {
                throw new Error('Login failed!');
            }
            
            const loginData = await loginResponse.json();

            console.log('message:', loginData['message']);
            console.log('token received:', loginData['token']);
            sessionStorage.setItem('jwt', loginData['token']);
            sessionStorage.setItem('refresh_token', loginData['refresh_token']);

            try {
                const nameResponse = await fetch(domain + '/get_name', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${loginData['token']}`
                    },
                    credentials: 'include'
                })

                    if (!nameResponse.ok) {
                        throw new Error("Couldn't fetch name :(");
                    }
                    
                    const nameData = await nameResponse.json();
                    console.log(nameData['name']);
                    callback(nameData);
                    return

                } catch(error){
                        console.error('Error:', error.message);
                }

        } catch(error){
            console.error('Error:', error);
            callback('failed');
            return
        }
}

async function uponRegister(fname, sname, email, type, password, dob, callback) {
    try {
        const response = await fetch(domain + 'register', {
            method: 'POST',
            body: JSON.stringify({ fname: fname, sname: sname, email: email, type: type, password: password, dob: dob }),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })

        if (!response.ok) {
            throw new Error("Couldn't register/get JWT :(");
        }
        
        const data = await response.json();

        if (data['error'] === "Email in use") {
            throw new Error("Email in use");
        }

        console.log('token:', data['token']);
        sessionStorage.setItem('jwt', data['token']);
        sessionStorage.setItem('refresh_token', data['refresh_token']);
        callback(1);

    } catch(error){
        console.error('Error:', error.message || error);
        callback(0);
    }
}

async function fetchDates(priority, callback, retried = false) {
    try {
        const token = sessionStorage.getItem('jwt');
        const response = await fetch(domain + `fetchDates?priority=${priority}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include',
        });

        if (response.status === 401) {
            console.log('Token expired or unauthorised access');
            throw new Error('refresh');
        } else if (!response.ok) {
            throw new Error("Couldn't fetch dates :(");
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data['error']);
        }

        console.log(data['message']);
        callback(data['dates']);

    } catch (error) {
        console.error('Error:', error.message || error);

        if (error.message === 'refresh' && !retried) {
            try {
                await refreshJWT();
                return fetchDates(priority, callback, true);
            } catch (refreshError) {
                console.error('Failed to refresh token:', refreshError.message || refreshError);
                callback('login again');
            }
        } else {
            callback('error');
        }
    }
}


async function fetchAppointments(priority, dates, times, callback, retried=false) {
    try{
        const token = sessionStorage.getItem('jwt');
        const response = await fetch(domain + 'fetchAppointments', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ priority, dates, times }),
            credentials: 'include'
        })
            if (response.status === 401) {
                console.log('Token expired or unauthorised access');
                throw new Error('refresh');
            } else if (!response.ok) {
                throw new Error("Couldn't fetch appointments :(");
            }

            const data = await response.json()

            if (data['error']) {
                throw new Error(data['error']);
            }
            callback(data['appts']);
            return

        } catch(error) {
            console.error('Error:', error.message || error);
            if (error.message === 'refresh' && !retried) {
                try {
                    await refreshJWT();
                    return fetchAppointments(priority, dates, times, callback, true)
                } catch (error) {
                    console.error('Failed to refresh token: ', error.message || error);
                    callback('login again')
                    return
                }
            } else {
                callback('error');
                return
            }
        }
}

async function fetchApptAmount(type, callback, retried=false) {
    try{
        const token = sessionStorage.getItem('jwt');
        const response = await fetch(domain + `fetchApptAmount?type=${type}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        })

            if (response.status === 401) {
                console.log('Token expired or unauthorised access');
                throw new Error('refresh');
            } else if (!response.ok) {
                throw new Error("fetch failed :(");
            }
            
            const data = await response.json();

            if (data['error']) {
                throw new Error(data['error']);
            }
            callback(type === 'patient' ? data['amount'] : [data['amount'], data['todayAmount']]);
            return

        } catch(error){
                console.error('Error:', error.message || error);
                if (error.message === 'refresh' && !retried) {
                    try{
                        await refreshJWT();
                        return fetchApptAmount(type, callback, true);
                    }catch(error){
                        console.error('Failed to refresh token: ', error.message || error)
                        callback('login again')
                        return
                    }
                } else {
                    callback('error');
                    return
                }

        }
}

async function fetchPast(type, callback, retried=false) {
    try {
        const token = sessionStorage.getItem('jwt');
        const response = await fetch(domain + `fetchPast?type=${type}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        })
            
        if (response.status === 401) {
                console.log('Token expired or unauthorised access');
                throw new Error('refresh');
            } else if (!response.ok) {
                throw new Error("fetch failed :(");
            }
            
        const data = await response.json();

        if (data['error']) {
            throw new Error(data['error']);
        }
        callback(data['appts']);

        } catch(error){
            console.error('Error:', error.message || error);
            if (error.message === 'refresh' && !retried) {
                try {
                    await refreshJWT();
                    return fetchPast(type, callback, true)
                } catch (error) {
                    console.error('Failed to refresh token: ', error.message || error);
                    callback('login again')
                }
            } else {
                callback('error');
            }
    }
}

async function fetchFuture(type, callback, retried=false) {
    try {
        const token = sessionStorage.getItem('jwt');
        const response = await fetch(domain + `fetchFuture?type=${type}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        })

            if (response.status === 401) {
                console.log('Token expired or unauthorised access');
                throw new Error('refresh');
            } else if (!response.ok) {
                throw new Error("fetch failed :(");
            }
            const data = await response.json();

            if (data['error']) {
                throw new Error(data['error']);
            }
            callback(data['appts']);

        } catch(error){
            console.error('Error:', error.message || error);
            if (error.message === 'refresh' && !retried) {
                try {
                    await refreshJWT();
                    return fetchFuture(type, callback, true)
                } catch (error) {
                    console.error('Failed to refresh token: ', error.message || error);
                    callback('login again')
                }
            } else {
                callback('error');
            }
        }
}

async function chooseAppointment(appt, callback, retried=false) {
    try{
        const token = sessionStorage.getItem('jwt');
        const response = await fetch(domain + 'chooseAppointment', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ appt }),
            credentials: 'include'
        })

            if (response.status === 401) {
                console.log('Token expired or unauthorised access');
                throw new Error('refresh');
            } else if (!response.ok) {
                throw new Error("Booking failed :(");
            }
            const data = await response.json();


            if (data['error']) {
                throw new Error(data['error']);
            }
            callback(data['msg']);

        } catch(error){

            console.error('Error:', error.message || error);
            if (error.message === 'refresh' && !retried) {
                try {
                    await refreshJWT();
                    return chooseAppointment(appt, callback, true)
                } catch (error) {
                    console.error('Failed to refresh token: ', error.message || error);
                    callback('login again')
                }
            } else {
                callback('error')
            }
    }
}

async function endBookingSession(callback, retried=false) {
    try {
        const token = sessionStorage.getItem('jwt');
        const response = await fetch(domain + 'endBookingSession', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        })

            if (response.status === 401) {
                console.log('Token expired or unauthorised access');
                throw new Error('refresh');
            } else if (!response.ok) {
                throw new Error("Exit failed :(");
            }

            const data = await response.json();

            if (data['error']) {
                throw new Error(data['error']);
            }
            callback(data['msg']);

    } catch(error){

        console.error('Error:', error.message || error);
        if (error.message === 'refresh' && !retried) {
            try {
                await refreshJWT();
                return endBookingSession(callback, true)
            } catch (error) {
                console.error('Failed to refresh token: ', error.message || error);
                callback('login again')
            }
        } else {
            callback('error');
        }

    }
}

async function refreshJWT() {
    const refreshToken = sessionStorage.getItem('refresh_token');
    console.log('refreshJWT function is running');

    if (refreshToken) {
        try{
        const response = await fetch(domain + '/refreshJWT', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${refreshToken}`
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
            credentials: 'include'
        })

            if (!response.ok) {
                throw new Error('JWT refresh failed!');
            }
            const data = await response.json();


            console.log('message:', data['message']);
            console.log('token received:', data['token']);
            sessionStorage.setItem('jwt', data['token']);
            sessionStorage.setItem('refresh_token', data['refresh_token'])

            return response

        } catch(error){
            console.error('Error:', error.message || error);
            throw error
        }
    }

    return Promise.reject(new Error('No refresh token found'));
}
