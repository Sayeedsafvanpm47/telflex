const userModel = require('../models/userModel')
const nodemailer = require('nodemailer')
const sendOTPByEmail = require('../utils/sendMail')
const bcrypt = require('bcrypt')
const {
          isEmailValid,
          isPasswordValid,
          isNamesValid,
          isPhoneValid,
          isCpassValid
} = require('../utils/validators/signUpValidator')
const otpGenerator = require('../utils/otpGenerator')

module.exports = {
          getLogin: async (req, res) => {
                    try {
                              await res.render('user/login')
                    } catch (err) {
                              res.status(200).send('error occured')
                    }
          },
          postLogin: async (req, res) => {
                    try {
                              if (req.body.email === "sayeed" && req.body.password === "syd") {
                                        console.log('success')
                                        await res.redirect('/home')
                              } else {
                                        res.redirect('/')
                                        console.log('error in else');
                              }
                    } catch (err) {
                              console.log('error in catch');
                              res.redirect('/')
                    }
          },
          getHome: async (req, res) => {
                    await res.send('hello home')
          },
          getSignUp: async (req, res) => {
                    try {
                              await res.render('user/signup')
                    } catch (err) {}
          },
          postSignUp: async (req, res) => {
                    try {
                              const {
                                        email,
                                        password,
                                        firstname,
                                        lastname,
                                        phonenumber,
                                        chkpassword
                              } = req.body;
                              const emailValid = isEmailValid(email);
                              const passwordValid = isPasswordValid(password);
                              const namesValid = isNamesValid(firstname, lastname)
                              const phoneValid = isPhoneValid(phonenumber)
                              const cpassValid = isCpassValid(password, chkpassword)
                              const emailCheck = await userModel.findOne({email})
                              let errors = [];
                           
                                                  if (emailCheck) {
                                                            errors.push('Email exists');
                                                  }
                                                  if (! emailValid) {
                                                            errors.push('Invalid email. Please enter a valid email address.');
                                                  }
                                                  if (! passwordValid) {
                                                            errors.push('Invalid password. Please enter password with atleast 8 charecters.');
                                                  }
                                                  if (! namesValid) {
                                                            errors.push('Fill in your details correctly')
                                                  }
                                                  if (! phoneValid) {
                                                            errors.push('Enter your contact number correctly')
                                                  }
                                                  if (! cpassValid) {
                                                            errors.push('Password doesnt match')
                                                  }
                                                     if(errors.length>0){                                     
                                                  res.render('user/signup', {errors});
                                                     }
                                      
                            

                                        if (emailValid && passwordValid && namesValid && phoneValid && cpassValid) {

                                                  const hashedPassword = await bcrypt.hash(password, 10)
                                                  const user = new userModel({
                                                            email,
                                                            password: hashedPassword,
                                                            firstname,
                                                            lastname,
                                                            phonenumber,
                                                            chkpassword
                                                  });
                                                  const otp = await otpGenerator.generateOTP()

                                                  console.log(otp)

                                                  user.otp = otp
                                                  user.otpExpires = new Date(Date.now() + 5 * 60 * 1000)
                                                  user.otpAttempts = 0
                                                  await user.save();
                                                  try {
                                                            const emailResponse = await sendOTPByEmail(email, user.otp);
                                                            console.log('Email sent successfully:', emailResponse);
                                                          } catch (error) {
                                                            console.error('Error sending email:', error);
                                                          }
                                                  res.render('user/verify-otp', { email: email });
                                        }
                              }
                     catch (err) {
                              console.error('Error:', err);
                              res.send('error')
                    }
          },
        
          
          verifyOTP : async (req,res) => {
                    const { email, enteredOTP } = req.body;
                    const user = await userModel.findOne({email})
                    if (!user || !user.otp || user.otpExpires <= new Date() || user.otpAttempts >= 3) {
                              
                               res.send('OTP verification failed');
                          }
                    if(user.otp === enteredOTP){
                              user.otp = null
                              user.otpExpires = null
                              user.otpAttempts = 0
                              await user.save()
                              res.redirect('/user/')
                    }
                    else
                    {
                              user.otpAttempts += 1
                              await user.save()
                              res.send('Invalid OTP');
                    }
          }

}
