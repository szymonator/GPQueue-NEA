function validPassword(passwordString){

    const specialRegex = /[!@#$%^&**(){}'":;£§~_+=`,.<>?/]/
    const capitalRegex = /[A-Z]/
    const lowerRegex = /[a-z]/
    const numberRegex = /[0-9]/
    const match1 = passwordString.match(specialRegex)
    const match2 = passwordString.match(capitalRegex)
    const match3 = passwordString.match(lowerRegex)
    const match4 = passwordString.match(numberRegex)
    return match1 && match2 && match3 && match4 && passwordString.length > 10 
}

console.log(validPassword('Hellooooo123*'))