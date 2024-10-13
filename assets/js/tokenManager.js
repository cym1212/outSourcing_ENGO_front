// 토큰을 로컬 스토리지에 저장
function setTokens(accessToken, refreshToken) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
}

// 로컬 스토리지에서 토큰 가져오기
function getAccessToken() {
    return localStorage.getItem('accessToken');
}

function getRefreshToken() {
    return localStorage.getItem('refreshToken');
}

// 토큰을 로컬 스토리지에서 제거
function clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
}

// API 요청 시 토큰을 헤더에 포함하는 함수
function fetchWithAuth(url, options = {}) {
    const accessToken = getAccessToken();

    if (!options.headers) {
        options.headers = {};
    }

    if (accessToken) {
        options.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return fetch(url, options)
        .then(response => {
            if (response.status === 401 || response.status === 403) {

                return refreshAccessToken().then(() => {
                    const newAccessToken = getAccessToken();
                    options.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return fetch(url, options);
                });
            }
            return response;
        });
}

// refresh token으로 새로운 access token 발급 요청
function refreshAccessToken() {
    const refreshToken = getRefreshToken();

    requestToken = {
        refreshToken: refreshToken
    };
    return fetch('http://localhost:8080/auth/tokens', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestToken)
    })
        .then(response => response.json())
        .then(data => {
            if (data.accessToken) {
                setTokens(data.accessToken, getRefreshToken());
            }
        })
        .catch(error => {
            console.error('Error refreshing token:', error);
            clearTokens();  // 토큰 갱신 실패 시 토큰 삭제
        });
}