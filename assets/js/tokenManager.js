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
        .then(response => {
            if (response.status === 401) {  // Refresh Token이 만료되었을 때
                swal({
                    title: "세션 만료!",
                    text: "로그인 세션이 만료되었습니다. 다시 로그인해주세요.",
                    icon: "warning",
                    buttons: {
                        confirm: {
                            text: "확인",
                            value: true,
                            visible: true,
                            className: "custom-confirm-btn",
                            closeModal: true
                        }
                    }
                }).then(() => {
                    clearTokens(); // 만료된 토큰 삭제
                    window.location.href = 'login.html'; // 로그인 페이지로 이동
                });
                return Promise.reject("Refresh Token expired");
            }
            return response.json();
        })
        .then(data => {
            if (data.accessToken) {
                setTokens(data.accessToken, data.refreshToken);  // 새로운 Access Token 저장
            }
        })
        .catch(error => {
            console.error('Error refreshing token:', error);
            clearTokens();  // 토큰 갱신 실패 시 토큰 삭제
            window.location.href = 'login.html'; // 로그인 페이지로 이동
        });
}