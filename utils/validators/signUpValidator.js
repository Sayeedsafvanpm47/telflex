
const isEmailValid = (email) => {
  const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
  return emailRegex.test(email);
}

const isPasswordValid = (password) => {
  return password.length > 8

}
const isNamesValid = (firstname, lastname) => {
  return (firstname.length > 0 && lastname.length > 0)
}
const isPhoneValid = (phonenumber) => {
  const phoneReg = /^[0-9]{10}$/
  return phoneReg.test(phonenumber)
}
const isCpassValid = (password, chkpassword) => {
  return chkpassword.trim() === password.trim();
};



module.exports = { isEmailValid, isPasswordValid, isNamesValid, isPhoneValid, isCpassValid}