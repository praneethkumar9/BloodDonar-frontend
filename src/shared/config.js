const  envVariables = process.env;
console.log(envVariables)
const config = {
    environment : envVariables.REACT_APP_ENV,
    backendUrl : envVariables.REACT_APP_BACKEND,
    bloodGroups : ['A+','A-','B-','B+','O-','O+','AB+','AB-']
}

export default config;