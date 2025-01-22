export{
    uponLogin,
    uponRegister,
    fetchDates,
    fetchAppointments,
    chooseAppointment,
    endBookingSession,
    fetchPast,
    fetchFuture,
    fetchApptAmount,
};

const domain = 'http://127.0.0.1:5000/'

function uponLogin(email, password, callback) {
    fetch(domain+'get_token', {
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
            console.log('message:', data['message'])
            console.log('token recieved:', data['token']); 
            sessionStorage.setItem('jwt', data['token']); 

            fetch(domain+'/get_name', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data['token']}` // Include the token in the Authorization header
                },
                credentials: 'include' })
        
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Couldn't fetch name :( ")}
                    return response.json()
                })  
        
                .then(data => { 
                    console.log(data['name'])  // I WANT TO RETURN THIS VALUE HERE
                    callback(data)
                }) 
                .catch(error => {
                    console.error('Error:', error.message);
                });

        })
        .catch((error) => {
            console.error('Error:', error);
            callback('failed')
        });

    }



function uponRegister(fname, sname, email, type, password, dob, callback) {
    fetch(domain+'register', {
        method: 'POST',
        body: JSON.stringify({ fname:fname, sname:sname, email: email, type:type, password: password, dob:dob }),
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include' })

        .then((response) => {
            if (!response.ok) {
                throw new Error("Couldn't register/get jwt :( ")}
            return response.json()
        })  

        .then((data) => {
            if (data['error'] === "Email in use"){
                console.log('throwing')
                throw new Error("Email in use")
            }
            const token = data['token']
            console.log('token:', token);
            sessionStorage.setItem('jwt', token);
            callback(1)
})

        .catch(error => {
            console.log('Entering catch block');
            console.error('Error:', error.message || error);
            callback(0)
        });
}



function fetchDates(priority, callback) {
    const token = sessionStorage.getItem('jwt')
    fetch(domain+`fetchDates?priority=${priority}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`},
        credentials: 'include',
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Couldn't fetch dates :( ")}
                return response.json()
        })  

        .then((data) => {
            if (data['error']){
                throw new Error(data['error'])
            }
            console.log(data['message'])
            const temp = data['dates']
            callback(temp)
        })

        .catch(error => {
            console.log('Entering catch block');
            console.error('Error:', error.message || error);
            callback('error')
        });
}



function fetchAppointments(priority, dates, times, callback) {
    const token = sessionStorage.getItem('jwt')
    
    fetch(domain+'fetchAppointments', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`},
        body: JSON.stringify({'priority':priority, 'dates':dates, 'times':times}),
        credentials: 'include'

    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Couldn't fetch appts :( ")}
                return response.json()
        })  

        .then((data) => {
            if (data['error']){
                throw new Error(data['error'])
            }
            console.log(data['appts'])
            const temp = data['appts']

            callback(temp)
        })

        .catch(error => {
            console.log('Entering catch block');
            console.error('Error:', error.message || error);
        });
}


function chooseAppointment(appt, callback){
    const token = sessionStorage.getItem('jwt')

    fetch(domain + 'chooseAppointment', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`},
        body: JSON.stringify({'appt': appt}),
        credentials: 'include'
    })

        .then((response) => {
            if (!response.ok) {
                throw new Error("booking failed :( ")}
                return response.json()
        })

        .then((data) => {
            if (data['error']){
                throw new Error(data['error'])
            }
            console.log(data['msg'])
            const temp = data['msg']
            callback(temp)
        })

        .catch(error => {
            console.log('Entering catch block');
            console.error('Error:', error.message || error);
        });
}


function endBookingSession(callback){
    const token = sessionStorage.getItem('jwt')

    fetch(domain + 'endBookingSession', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`},
        credentials: 'include'
    })

        .then((response) => {
            if (!response.ok) {
                throw new Error("exit failed :( ")}
                return response.json()
        })

        .then((data) => {
            if (data['error']){
                throw new Error(data['error'])
            }
            console.log(data['msg'])
            const temp = data['msg']
            callback(temp)
        })

        .catch(error => {
            console.log('Entering catch block');
            console.error('Error:', error.message || error);
        });
}


function fetchPast(type, callback){
    const token = sessionStorage.getItem('jwt')

    fetch(domain + `fetchPast?type=${type}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`},
        credentials: 'include'
    })

        .then((response) => {
            if (!response.ok) {
                throw new Error("fetch failed :(")}
                return response.json()
        })

        .then((data) => {
            if (data['error']){
                throw new Error(data['error'])
            }
            console.log(data['appts'])
            const temp = data['appts']
            callback(temp)
        })

        .catch(error => {
            console.log('Entering catch block');
            console.error('Error:', error.message || error);
            return error
        });
}



function fetchFuture(type, callback){
    const token = sessionStorage.getItem('jwt')

    fetch(domain + `fetchFuture?type=${type}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`},
        credentials: 'include'
    })

        .then((response) => {
            if (!response.ok) {
                throw new Error("fetch failed :(")}
                return response.json()
        })

        .then((data) => {
            if (data['error']){
                throw new Error(data['error'])
            }
            console.log(data['appts'])
            const temp = data['appts']
            callback(temp)
        })

        .catch(error => {
            console.log('Entering catch block');
            console.error('Error:', error.message || error);
            return error
        });
}


function fetchApptAmount(type, callback){
    const token = sessionStorage.getItem('jwt')

    fetch(domain + `fetchApptAmount?type=${type}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`},
        credentials: 'include'
    })

        .then((response) => {
            if (!response.ok) {
                throw new Error("fetch failed :(")}
                return response.json()
        })

        .then((data) => {
            if (data['error']){
                throw new Error(data['error'])
            }

            if (type === 'patient'){
                console.log(data['amount'])
                const temp = data['amount']
                callback(temp)
            } else {
                console.log(data['amount'], data['todayAmount'])
                const temp = [data['amount'], data['todayAmount']]
                callback(temp)
            }
            
        })

        .catch(error => {
            console.log('Entering catch block');
            console.error('Error:', error.message || error);
            return error
        });
}