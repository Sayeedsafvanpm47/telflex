
const userModel = require('../models/userModel')

const bcrypt = require('bcrypt')
const { isEmailValid, isPasswordValid, isNamesValid, isPhoneValid, isCpassValid, isEmailExists } = require('../utils/validators/signUpValidator')

module.exports = {
          getLogin: async (req, res) => {
                    try {
                              await res.render('user/login')
                    }
                    catch (err) {
                              res.status(200).send('error occured')
                    }
          },
          postLogin: async (req, res) => {
                    try {
                              if (req.body.email === "sayeed" && req.body.password === "syd") {
                                        console.log('success')
                                        await res.redirect('/home')
                              }
                              else {
                                        res.redirect('/')
                                        console.log('error in else');
                              }
                    }
                    catch (err) {
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
                    } catch (err) {

                    }
          }
          ,
          postSignUp: async (req, res) => {
                    try {
                              const { email, password, firstname, lastname, phonenumber, chkpassword } = req.body;
                             
                              const emailValid = isEmailValid(email);
                              const passwordValid = isPasswordValid(password);
                              const namesValid = isNamesValid(firstname, lastname)
                              const phoneValid = isPhoneValid(phonenumber)
                              const cpassValid = isCpassValid(password, chkpassword)
                            
                           

                              const emailExists = await userModel.findOne({ email });
      
                              let errors = [];
                        
                              if (emailExists) {
                                errors.push('Email already exists');
                              }



                              if (emailValid && passwordValid && namesValid && phoneValid && cpassValid && !emailExists) {
                                        const hashedPassword = await bcrypt.hash(password, 10)
                                        const user = new userModel({ email, password: hashedPassword, firstname, lastname, phonenumber, chkpassword });
                                        await user.save();
                                        res.redirect('/user/');
                              } else {
                                       
                                       
                                       

                                        if (!emailValid) {
                                                  
                                                  errors.push('Invalid email. Please enter a valid email address.');
                                        }
                                        if (!passwordValid) {
                                                  errors.push('Invalid password. Please enter password with atleast 8 charecters.');
                                        }
                                        if (!namesValid) {
                                                  errors.push('Fill in your details correctly')
                                        }
                                        if (!phoneValid) {
                                                  errors.push('Enter your contact number correctly')
                                        }
                                        if (!cpassValid) {
                                                  errors.push('Password doesnt match')
                                        }
                                        res.render('user/signup', { errors });
                              }
                    } catch (err) {
                              console.error('Error:', err);
                              res.send('error')
                    }
          }

}