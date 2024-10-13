// logoutHandler.js

// getAccessToken 함수가 정의되어 있는지 확인
if (typeof getAccessToken === 'function') {
    document.getElementById('logout').addEventListener('click', function(e) {
        e.preventDefault();
        const accessToken = getAccessToken();

        if (!accessToken) {
            alert('토큰이 없습니다. 로그인을 다시 시도하세요.');
            window.location.href = 'login.html';
            return;
        }

        fetch('http://localhost:8080/auth/logout', {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        })
            .then(response => {
                if (response.status === 200) {
                    alert('성공적으로 로그아웃되었습니다.');
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = 'login.html';
                } else {
                    alert('로그아웃에 실패했습니다.');
                }
            })
            .catch(error => {
                alert('로그아웃 중 오류가 발생했습니다: ' + error.message);
            });
    });
} else {
    console.error('tokenManager.js 파일이 포함되지 않았습니다.');
}