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
        return;
    }

    // fetch('http://localhost:8080/auth/logout', {
    fetch('http://49.247.174.32:8080/auth/logout', {
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

// 메뉴 상태를 업데이트하는 함수 (모바일 및 PC)
window.updateMenuState = function() {
    const accessToken = getAccessToken();
    const desktopLoginMenu = document.querySelector('#loginMenu'); // 데스크톱 메뉴
    const mobileMenuContainer = document.querySelector('.mobile-nav__container'); // 모바일 메뉴 컨테이너

    // PC 메뉴 상태 업데이트 (드롭다운 유지)
    if (desktopLoginMenu) {
        updateLoginLink(desktopLoginMenu, accessToken);
    } else {
        console.error('Desktop login menu not found');
    }

    // 모바일 메뉴 상태 업데이트 (회원가입 독립 메뉴 추가)
    if (mobileMenuContainer) {
        updateMobileMenu(mobileMenuContainer, accessToken);
    } else {
        console.error('Mobile menu not found');
    }

    // 고정된 메뉴 상태 업데이트 (처음 로드할 때도 실행)
    updateStickyMenuState(accessToken);
};

// 모바일 메뉴에 회원가입 독립 메뉴 추가
function updateMobileMenu(mobileMenuContainer, accessToken) {
    let signupMenu = document.getElementById('mobileSignupMenu');

    if (!signupMenu) {
        // 회원가입 메뉴가 없는 경우 새로 추가
        signupMenu = document.createElement('li');
        signupMenu.id = 'mobileSignupMenu';
        const signupLink = document.createElement('a');
        signupLink.href = 'sign-up.html';
        signupLink.textContent = '회원 가입';
        signupMenu.appendChild(signupLink);
        mobileMenuContainer.appendChild(signupMenu);
    }

    // 로그인/로그아웃 상태 업데이트 (모바일 전용)
    const mobileLoginLink = mobileMenuContainer.querySelector('#loginMenu > a');
    if (mobileLoginLink) {
        if (accessToken) {
            mobileLoginLink.textContent = '로그아웃';
            mobileLoginLink.setAttribute('href', '#');
            mobileLoginLink.removeEventListener('click', handleLogin);
            mobileLoginLink.addEventListener('click', handleLogout);
        } else {
            mobileLoginLink.textContent = '로그인';
            mobileLoginLink.setAttribute('href', 'login.html');
            mobileLoginLink.removeEventListener('click', handleLogout);
            mobileLoginLink.addEventListener('click', handleLogin);
        }
    } else {
        console.error("Mobile login link not found");
    }
}

// PC 드롭다운 상태 업데이트 함수
function updateLoginLink(loginMenu, accessToken) {
    const loginLink = loginMenu.querySelector('a[href="login.html"]');

    if (!loginLink) {
        console.error("loginLink not found within loginMenu.");
        return; // loginLink가 없으면 함수 종료
    }

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
}

// 고정된 메뉴 상태 업데이트 함수 (PC 메뉴 전용)
function updateStickyMenuState(accessToken) {
    const stickyMenu = document.querySelector('.stricked-menu.stricky-fixed');
    if (stickyMenu) {
        const stickyLoginLink = stickyMenu.querySelector('#loginMenu > a');

        if (!stickyLoginLink) {
            console.error("Sticky login link not found.");
            return;
        }

        if (accessToken) {
            stickyLoginLink.textContent = '로그아웃';
            stickyLoginLink.setAttribute('href', '#');
            stickyLoginLink.removeEventListener('click', handleLogin);
            stickyLoginLink.addEventListener('click', handleLogout);
        } else {
            stickyLoginLink.textContent = '로그인';
            stickyLoginLink.setAttribute('href', 'login.html');
            stickyLoginLink.removeEventListener('click', handleLogout);
            stickyLoginLink.addEventListener('click', handleLogin);
        }
    } else {
        console.error("Sticky menu not found");
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
    const accessToken = getAccessToken();
    updateStickyMenuState(accessToken);
});