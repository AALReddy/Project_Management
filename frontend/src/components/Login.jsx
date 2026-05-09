import React from 'react'

import {FaLock,FaEnvelope,FaUser} from 'react-icons/fa6'
import { useRef, useState } from 'react';
import { apiFetch } from '../utils/api';
export default function Login() {
    
  const email=useRef()
  let form=useRef()
  const password=useRef()
  const [error, setError] = useState("")
  
 async  function handleSubmit(e){
    e.preventDefault()
    setError("")
    const formData = {
        // fullname: fullname.current.value,
        // number: number.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        const result = await apiFetch('/api/v1/log-in', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
        localStorage.setItem("token",result.token)
        localStorage.setItem("role", result.role)
        if(result.id){
          if(result.role==="admin"){
            window.location.href="/admin"
          }else{
            window.location.href="/home"
          }
        }
      } catch (err) {
        setError(err.message || "Login failed")
      }
  }
  return (
    <>
          <div className="limiter relative   overflow-clip flex justify-center items-center  ">
            <div className="h-[100vh] absolute top-0 z-10 left-0 w-[100vw] grid justify-center items-center bg-[rgba(0,0,0,0.5)]"></div>
            {/* <Image src={rightcity} width={600} height={1500} className='absolute right-0 bottom-[-50px] h-[750px] w-[450px] z-[91]'  ></Image> */}
        <div className="gradient w-[450px] abcdef justify-self-center z-[99] self-center" style={{backgroundImage:"linear-gradient(to bottom,  rgba(0, 0, 255, 0.1),rgba(0, 255, 255, 0.1))",backdropFilter:"blur(10px)",borderRadius:"15px"}}>
                  <form className="login100-form validate-form" ref={form} onSubmit={handleSubmit}>
                      <span className="login100-form-logo relative bottom-3">
                          <i className="zmdi zmdi-landscape"></i>
                          <FaUser />
                      </span>
  
                      <span className="login100-form-title p-b-34 mt-2 p-t-27">
                          Log in
                      </span>
  
                      <div className="wrap-input100 validate-input grid" data-validate = "Enter Email">
                          <input className="input100"  ref={email} style={{outline:"none"}} type="text" name="Email" placeholder="Email"/>
                         <span className="focus-input100" ></span>   
                                                  <span className=" absolute left-0 top-3" style={{borderRadius:"50%"}}><FaEnvelope fill="white"  color="white" enableBackground={false}  size={"1.5em"}/></span>


                     
                      </div>
  
                      <div className="wrap-input100 validate-input grid" data-validate="Enter password">
                          <input className="input100 " style={{outline:"none",borderBottom:"none"}}  type="password" ref={password} name="pass" placeholder="Password"/>
                          <span className="focus-input100 "  ></span>
                          <span className=" absolute left-0 top-3 " style={{borderRadius:"50%"}}><FaLock color="white" enableBackground={true}  size={"1.5em"}/></span>
                      </div>
  
                    
  
                      <div className="container-login100-form-btn">
                          <button type="submit" className="login100-form-btn"> 
                              Login
                          </button>
                      </div>
                      {error && <p className="text-red-200 text-center mt-3">{error}</p>}
                            <p className="text-[aqua] text-xl mt-3 text-center font-semibold underline hover:text-white hover:cursor-pointer"  >Login With Default Credentials</p>

                    
                  </form>
              </div>
            {/* <img src={leftcity} width={600} height={1500} className='absolute left-0 bottom-[-50px] h-[750px] w-[450px] z-[91]'  ></img> */}
        </div>
   </>
  )
}
