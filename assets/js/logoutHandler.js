// Handle logout functionality
window.handleLogout = function() {
    const accessToken = getAccessToken();

    if (!accessToken) {
        swal({
            title: "경고!",
            text: "로그인이 되어있지 않습니다. 로그인을 먼저 진행해주세요!.",
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
            window.location.href = 'login.html';
        });
        return; // Make sure to return here to prevent further execution
    }

    fetch('http://localhost:8080/auth/logout', {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 200) {
                swal({
                    title: "성공!",
                    text: "성공적으로 로그아웃 되었습니다!.",
                    icon: "success",
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
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    updateMenuState();
                    window.location.href = 'login.html';
                });
            } else {
                swal({
                    title: "실패!",
                    text: "로그아웃에 실패했습니다. 재로그인 후 다시 시도해주세요!",
                    icon: "error",
                    buttons: {
                        confirm: {
                            text: "확인",
                            value: true,
                            visible: true,
                            className: "custom-confirm-btn",
                            closeModal: true
                        }
                    }
                }).then(() =>{
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    updateMenuState();
                    window.location.href = 'login.html';
                });
            }
        })
        .catch(error => {
            swal({
                title: "실패!",
                text: "로그아웃에 실패했습니다. 재로그인 후 다시 시도해주세요!",
                icon: "error",
                buttons: {
                    confirm: {
                        text: "확인",
                        value: true,
                        visible: true,
                        className: "custom-confirm-btn",
                        closeModal: true
                    }
                }
            }).then(() =>{
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                updateMenuState();
                window.location.href = 'login.html';
            });
        });
};

// 메뉴 상태를 업데이트하는 함수 (PC 메뉴 전용)
window.updateMenuState = function() {
    const accessToken = getAccessToken();
    const loginMenu = document.getElementById('loginMenu');
    const loginLink = document.querySelector('#loginMenu > a');

    if (accessToken) {
        loginLink.textContent = '로그아웃';
        loginLink.setAttribute('href', '#');
        loginLink.removeEventListener('click', handleLogin);
        loginLink.addEventListener('click', handleLogout);
    } else {
        loginLink.textContent = '로그인';
        loginLink.setAttribute('href', 'login.html');
        loginLink.removeEventListener('click', handleLogout);
        loginLink.addEventListener('click', handleLogin);
    }

    updateStickyMenuState(accessToken);
};

// 고정된 메뉴 상태 업데이트 함수 (PC 메뉴 전용)
function updateStickyMenuState(accessToken) {
    const stickyMenu = document.querySelector('.stricked-menu.stricky-fixed');
    if (stickyMenu) {
        const stickyLoginLink = stickyMenu.querySelector('#loginMenu > a');

        if (accessToken) {
            stickyLoginLink.textContent = '로그아웃';
            stickyLoginLink.setAttribute('href', '#'); // 로그아웃 기능 연결
            stickyLoginLink.removeEventListener('click', handleLogin); // 중복 방지
            stickyLoginLink.addEventListener('click', handleLogout); // 로그아웃 이벤트 연결
        } else {
            stickyLoginLink.textContent = '로그인';
            stickyLoginLink.setAttribute('href', 'login.html'); // 로그인 페이지로 이동
            stickyLoginLink.removeEventListener('click', handleLogout); // 중복 방지
            stickyLoginLink.addEventListener('click', handleLogin); // 로그인 이벤트 연결
        }
    }
}

// Handle login functionality
window.handleLogin = function(e) {
    e.preventDefault();
    window.location.href = 'login.html';
};

// 페이지 로드 후 메뉴 상태 업데이트
document.addEventListener('DOMContentLoaded', function() {
    updateMenuState();
});

// 스크롤 시 고정 메뉴 업데이트
document.addEventListener('scroll', function() {
    updateStickyMenuState(getAccessToken());
});