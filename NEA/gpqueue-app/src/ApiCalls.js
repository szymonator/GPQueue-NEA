export{
    uponLogin,
    uponRegister,
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
            sessionStorage.setItem('jwt', token);
            callback(0)
        })

        .catch(error => {
            console.error('Error:', error.message);
        });
}