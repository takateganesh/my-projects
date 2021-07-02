import { auth, nav } from 'oak-vuex/src';
const { getHubAuthHeader } = auth;
const { wrapRequest, wrapRequestWithRange } = nav;
const oakHubName = process.env.VUE_APP_OAK_HUB_NAME;
const oakApiUrl = process.env.VUE_APP_OAK_API_URL;

export const doFetchList = wrapRequestWithRange(({nameLike,limit,offset}) => {

  const requestOptions = {
      method: 'GET',
      headers: { ...getHubAuthHeader(oakHubName), 'Content-type': 'application/json', 'Prefer': 'count=exact' },
  };
  const params = {limit: limit || 50, offset: offset || 0}
  if (nameLike) params['name'] = `ilike.*${nameLike}*`
  const qs = Object.keys(params).map(key => key + '=' + params[key]).join('&');

  return fetch(`${oakApiUrl}/hub?${qs}`, requestOptions);
})

export const doFetchOne = wrapRequest(({hubName}) => {
    const requestOptions = {
        method: 'GET',
        headers: getHubAuthHeader(oakHubName)
    };
    return fetch(`${oakApiUrl}/hub?name=eq.${hubName}`, requestOptions)

})


export const doPostOne = wrapRequest(({hub}) => {
    const requestOptions = {
        method: 'POST',
        headers: { ...getHubAuthHeader(oakHubName), 'Content-Type': 'application/json', 'Accept': 'application/vnd.pgrst.object+json',
        'Prefer': 'return=representation' },
        body: JSON.stringify( hub )            
    };
    return fetch(`${oakApiUrl}/hub`, requestOptions)
})

export const doPatchOne = wrapRequest(({hub}) => {
    const requestOptions = {
        method: 'PATCH',
      headers: {
            'Content-Type': 'application/json', 'Accept': 'application/vnd.pgrst.object+json',
            'Prefer': 'return=representation', ...getHubAuthHeader(oakHubName)
        },
        body: JSON.stringify(hub)
    };
    return fetch(`${oakApiUrl}/hub?name=eq.${hub.name}`, requestOptions)
}) 
