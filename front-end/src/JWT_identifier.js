import jwtDecode from 'jwt-decode';

export function identify(JWT) {
    console.log(JWT)

    let decodedJWT = jwtDecode(JWT)
    console.log(decodedJWT)
}