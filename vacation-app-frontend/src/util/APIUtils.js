import { API_BASE_URL, ACCESS_TOKEN } from '../constants';

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })
    
    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
    .then(response => 
        response.json().then(json => {
            if(!response.ok) {
                return Promise.reject(json);
            }
            return json;
        })
    );
};

// 토큰정보확인
export function getCurrentUser() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/users/me",
        method: 'GET'
    });
}

// 로그인
export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/signin",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

// 사용자정보
export function getUserInfo(username) {
    return request({
        url: API_BASE_URL + "/users/" + username,
        method: 'GET'
    });
}

// 휴가신청내역
export function getVacation(id) {
    return request({
        url: API_BASE_URL + "/vacation/" + id,
        method: 'GET'
    });
}

// 휴가신청
export function insertVacation(data) {
    return request({
        url: API_BASE_URL + "/vacation",
        method: 'POST',
        body: JSON.stringify(data)         
    });
}

// 휴가취소
export function deleteVacation(id) {
    return request({
        url: API_BASE_URL + "/vacation",
        method: 'DELETE',
        body: JSON.stringify(id)         
    });
}