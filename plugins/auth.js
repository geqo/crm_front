const strategy = 'local'
const FALLBACK_INTERVAL = 900 * 1000 * 0.75

export default async function ({ app }) {
  const { $axios, $auth } = app

  let token = $auth.getToken(strategy)

  let refreshInterval = FALLBACK_INTERVAL
  if (token) {
    $axios.get('/auth/me').then((resp) => { $auth.setUser(resp.data) }).catch(err => {
      if(err.response.status === 401) {
        // window.location.replace("/login");
        // localStorage.removeItem('auth._refresh_token.local')
        // localStorage.removeItem('auth._token.local')
        // localStorage.removeItem('auth.strategy')
      }

    })
    const tokenParsed = decodeToken.call(this, token)
    refreshInterval = (tokenParsed.exp * 1000 - Date.now()) * 0.75

    if (refreshInterval < 10000 && refreshInterval > 0) {
      refreshInterval = 10000
    }
    if (refreshInterval < 0) {
      $auth.fetchUserOnce()
    }
  }
  setInterval(async function () {
    token = $auth.getToken(strategy)
  }, refreshInterval)
}

function decodeToken (str) {
  str = str.split('.')[1]

  str = str.replace('/-/g', '+')
  str = str.replace('/_/g', '/')
  switch (str.length % 4) {
    case 0:
      break
    case 2:
      str += '=='
      break
    case 3:
      str += '='
      break
    default:
      throw new Error('Invalid token')
  }

  str = (str + '===').slice(0, str.length + (str.length % 4))
  str = str.replace(/-/g, '+').replace(/_/g, '/')

  str = decodeURIComponent(escape(Buffer.from(str, 'base64').toString('binary')))

  str = JSON.parse(str)
  return str
}
