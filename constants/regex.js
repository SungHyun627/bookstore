// 최소 하나의 영문자, 하나의 숫자 및 하나의 특수 문자를 포함한 8~20자 길이의 password regex
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,20}$/;

module.exports = { passwordRegex };
