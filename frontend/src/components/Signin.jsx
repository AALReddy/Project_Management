import React, { useRef, useState } from 'react';
import { FaLock, FaEnvelope, FaUser, FaPhone } from 'react-icons/fa';
import { apiFetch } from '../utils/api';

export default function Signin() {
  const email = useRef();
  const password = useRef();
  const fullname = useRef();
  const number = useRef();
  const [msg, setMsg] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const form = useRef();
  let select=useRef()

  async function handleSubmit(e) {
    e.preventDefault();
console.log(fullname.current.value)
console.log(select.current.value,"ROLEEEEEEEEEEEEEEEEEEEE")
    const formData = {
      username: fullname.current.value,
      // number: number.current.value,
      email: email.current.value,
      password: password.current.value,
      role:select.current.value
    };

    try {
      const result = await apiFetch('/api/v1/sign-in', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      if (result.token) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('role', result.role || select.current.value);
        const role = result.role || select.current.value;
        if (role === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/home';
        }
      }
    } catch (error) {
      setMsg(error.message || 'Network error');
      setShowPopup(true);
    }
  }

  return (
    <div className="limiter relative overflow-hidden flex justify-center items-center h-screen w-screen">
      <div className="absolute inset-0 z-10 bg-[rgba(0,0,0,0.5)] flex justify-center items-center"></div>
      <div className="gradient w-[450px] h-[90vh] z-[99] rounded-lg shadow-lg backdrop-blur-sm" 
           style={{ backgroundImage: "linear-gradient(to bottom, rgba(0, 0, 255, 0.1), rgba(0, 255, 255, 0.1))" }}>
        <form className="login100-form validate-form" ref={form} onSubmit={handleSubmit}>
          <span className="login100-form-logo">
            <FaUser color="black" />
          </span>
          <h2 className="text-white font-semibold text-4xl text-center p-2">Sign Up</h2>
          
          <div className="wrap-input100 validate-input">
            <input className="input100" ref={fullname} type="text" name="fullname" placeholder="Full Name" />
            <span className="focus-input100"></span>
            <span className="absolute left-0 top-3">
              <FaUser fill="white" color="white" size="1.5em" />
            </span>
          </div>

          <div className="wrap-input100 validate-input">
            <input className="input100" ref={number} type="number" name="phonenumber" placeholder="+91" />
            <span className="focus-input100"></span>
            <span className="absolute left-0 top-3">
              <FaPhone fill="white" color="white" size="1.5em" />
            </span>
          </div>

          <div className="wrap-input100 validate-input">
            <input className="input100" ref={email} type="email" name="email" placeholder="Email id" />
            <span className="focus-input100"></span>
            <span className="absolute left-0 top-3">
              <FaEnvelope fill="white" color="white" size="1.5em" />
            </span>
          </div>

          <div className="wrap-input100 validate-input">
            <input className="input100" ref={password} type="password" name="pass" placeholder="Password" />
            <span className="focus-input100"></span>
            <span className="absolute left-0 top-3">
              <FaLock color="white" size="1.5em" />
            </span>
          </div>
          <select ref={select}>
            <option value="member">Team Member</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
          </select>
          <div className="container-login100-form-btn">
            <button type="submit" className="login100-form-btn">
              Sign Up
            </button>
          </div>
        </form>
      </div>

      {/* Popup for messages */}
      {showPopup && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-2xl z-[200]">
          <p className="text-gray-800 font-semibold text-lg">{msg}</p>
          <button onClick={() => setShowPopup(false)} className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Close</button>
        </div>
      )}
    </div>
  );
}
