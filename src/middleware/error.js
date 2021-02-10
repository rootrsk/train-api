const userErrorHandler = (error) =>{
    console.log(error)
    if (error.includes('username: Path `username` is required')){
        return 'Username is requred'
    }
    if (error.includes('email: Path `email` is required')) {
        return 'Email is required'
    }
    if (error.includes('password: Path `password` is required.')){
        return 'Password is required'
    }
    if (error.includes('E11000 duplicate key error collection: train-api.users index: email_1 dup key:')) {
        return 'Email is already registered'
    }

    return 'Something went wrong'
}

const trainErrorHandler = (error) =>{
    console.log(error)
    if (error.includes('Path `train_name` is required.')){
        return 'Train name is required'
    }
    if (error.includes('train_id: Path `train_id` is required')) {
        return 'Train id is required'
    } 
    if (error.includes('Path `station` is required')) {
        return `Station name is required at destination number ${error.split('destinations.')[1].split('.station')[0]}`
    }
    if (error.includes('Path `arriving_time` is required')){
        return `Arriving time is required at destination number ${error.split('destinations.')[1].split('.arriving_time')[0]}`
    }
    if (error.includes('Path `departure_time` is required')) {
        return `Departure time is required at destination number ${error.split('destinations.')[1].split('.departure_time')[0]}`
    }
    if (error.includes('train_id_1 dup key:')){
        return 'Train with this id already exist.'
    }
    console.log(error)
    return 'Something went Wrong'
}

module.exports = {
    userErrorHandler,
    trainErrorHandler
}