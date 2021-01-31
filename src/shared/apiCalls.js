import localStorageVariables from '../shared/localStorageVariables';
import config from '../shared/config';
console.log(config)
const apiCalls = {

    /**
    * A getAPI  method to call the get endpoint with provided parameters
    * @author Esari Praneeth kumar
    * @ModifiedBy Esari Praneeth kumar
    * @async
    * @memberof apiCalls
    * @param {String} urlPath - endpoint path string
    * @param {Object} [params={}] - Object containing  parameters required for get endpoint
    * @param {Object} [bodyParams={}] - Object containing  body parameters required for get endpoint
    * @param {Boolean} [authorizationFlag=false] - Boolean flag to denote whether we need authorization or not
    * @returns returns an array with first value as response & second value as status code
    */
   getAPI : async (urlPath, params = {},bodyParams = {},authorizationFlag=false) => {
    const myUrl = new URL(`${config.backendUrl}${urlPath}`);
    const options = {};
    const paramKeys = Object.keys(params?params:{});
    const bodyParamKeys = Object.keys(bodyParams);
    options.method = 'GET';
    options.mode = 'cors';
    options.headers = { 'Content-Type': 'application/json' };
    
    if(authorizationFlag){
        options.headers.Authorization = `Bearer ${localStorageVariables.token}`;
    }
    if (paramKeys.length) {
        paramKeys.forEach(key => myUrl.searchParams.append(key, params[key]));
    }
    if (bodyParamKeys.length) {
        options.body = JSON.stringify(bodyParams);
    }
    let status = false;
    return fetch(myUrl, options).then((res) => {
        if (res.status !== 200) {
            return res.json();
        }
        status = true;
        return res.json();
    }).then(response => [response, status]).catch((error) => {
        console.log('error in calling service:'+error);
        return false;
    });
},
/**
* A postAPI method to call the post endpoint with provided parameters
* @author Esari Praneeth kumar
* @ModifiedBy Esari Praneeth kumar
* @async
* @memberof apiCalls
* @param {String} urlPath - endpoint path string
* @param {Object} [bodyParams={}] - Object containing  parameters required for post endpoint
* @param {Boolean} [authorizationFlag=false] - Boolean flag to denote whether we need authorization or not
* @returns returns an array with first value as response & second value as status code
*/
postAPI : async (urlPath, bodyParams = {},authorizationFlag=false) => {
    const options = {};

    options.method = 'POST';
    options.mode = 'cors';
    options.headers = { 'Content-Type': 'application/json' };
    if(authorizationFlag){
        options.headers.Authorization = `Bearer ${localStorageVariables.token}`;
    }
    options.body = JSON.stringify(bodyParams);

    let status = false;
    return fetch(`${config.backendUrl}${urlPath}`, options).then((res) => {
        if (res.status !== 200) {
            return res.json();
        }
        status = true;
        return res.json();
    }).then(response => [response, status]).catch((error) => {
        console.log('error in calling service:'+error);
        return false;
    });
},

}
export default apiCalls;