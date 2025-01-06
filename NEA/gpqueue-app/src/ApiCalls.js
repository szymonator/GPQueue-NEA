export{
    uponLogin,
    uponRegister,
    fetchDates
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
            return response.text(); 
        })
        .then((token) => {
            console.log('token recieved:', token); 
            sessionStorage.setItem('jwt', token); 

            fetch(domain+'get_name', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Include the token in the Authorization header
                },
                credentials: 'include' })
        
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Couldn't fetch name :( ")}
                    return response.json()
                })  
        
                .then(data => { 
                    console.log(data['name'])  // I WANT TO RETURN THIS VALUE HERE
                    callback(data['name'])
                }) 
                .catch(error => {
                    console.error('Error:', error.message);
                });

        })
        .catch((error) => {
            console.error('Error:', error);
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
            return response.text()
        })  

        .then((token) => {
            console.log('token:', token);
            console.log(JSON.parse(token).error)
            if (JSON.parse(token).error === "Email in use"){
                console.log('throwing')
                throw new Error("Email in use")
            }
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
    fetch(domain+`/fetchDates?priority=${priority}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`},
        credentials: 'include',
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Couldn't fetch dates :( ")}
                return response.text()
        })  

        .then((data) => {
            callback(JSON.parse(data))
        })

        .catch(error => {
            console.log('Entering catch block');
            console.error('Error:', error.message || error);
        });
}
