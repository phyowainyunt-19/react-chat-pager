import React, { useState } from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'

import signinImage from '../assets/signup.jpg'

const cookies = new Cookies();

const initialState = {
    fullName: '',
    userName: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    avatarURL: '',
}

const Auth = () => {

    const [form, setForm] = useState(initialState)
    const [isSignup, setIsSignup] = useState(false);

    const handleChange = (e) => {
        // ! set the name with square bracket
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ? pass all form value to backend
        const { userName, password, phoneNumber, avatarURL } = form;

        const URL = 'https://chat-pager.herokuapp.com/auth';

        //? axios call
        //! after URL, we have to check if it is login or signup
        const { data: { token, userID, hashedPassword, fullName } } = await axios.post(`${URL}/${isSignup ? 'signup' : 'login'}`, {
            fullName: form.fullName, userName, password, phoneNumber, avatarURL
        });

        //? to add the values from backend to  browser cookies
        cookies.set('token', token);
        cookies.set('userName', userName);
        cookies.set('fullName', fullName);
        cookies.set('userID', userID);

        if (isSignup) {
            cookies.set('phoneNumber', phoneNumber);
            cookies.set('avatarURL', avatarURL);
            cookies.set('hashedPassword', hashedPassword);
        }

        //! reload the browser after adding those values
        //? why realod => we are not going to hit auth again and going to our chat as logged in user a
        //? as we already have a token
        window.location.reload();
    }

    const switchMode = () => {
        setIsSignup((prevIsSignUp) => !prevIsSignUp);
    }

    return (
        <div className="auth__form-container">
            <div className="auth__form-container_fields">
                <div className="auth__form-container_fields-content">
                    <p> {isSignup ? 'Sign Up' : 'Sign In'} </p>
                    <form action="" onSubmit={handleSubmit}>
                        {isSignup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="fullName">Full Name</label>
                                <input
                                    name="fullName"
                                    type="text"
                                    placeholder="Full Name"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="userName">Username</label>
                            <input
                                name="userName"
                                type="text"
                                placeholder="Username"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {isSignup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="phoneNumber">Phone Number</label>
                                <input
                                    name="phoneNumber"
                                    type="text"
                                    placeholder="Phone Number"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                        {isSignup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="avatarURL">Avatar URL</label>
                                <input
                                    name="avatarURL"
                                    type="text"
                                    placeholder="Avatar URL"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="password">Password</label>
                            <input
                                name="password"
                                type="password"
                                placeholder="Password"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {isSignup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Confirm Password"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                        <div className="auth__form__container_fields-content_button">
                            <button>
                                {isSignup ? 'Sign Up' : 'Sign In'}
                            </button>
                        </div>
                    </form>

                    <div className="auth__form-container_fields-account">
                        <p>
                            {isSignup
                                ? "Already have an account? "
                                : "Don't have an account? "
                            }
                            <span onClick={switchMode}>
                                {isSignup ? 'Sign In' : 'Sign Up'}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <div className="auth__form-container_image">
                <img src={signinImage} alt="sign in" />
            </div>
        </div>
    )
}

export default Auth
