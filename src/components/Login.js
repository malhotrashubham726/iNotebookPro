import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = (props) => {

    const [credentials , setCredentials] = useState({
        email : "",
        password : ""
    })

    let navigation = useNavigate();

    const onChange = (e) => {
        setCredentials({...credentials , [e.target.name] : e.target.value}); 
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/login" , {
            method : "POST",
            headers : {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email : credentials.email, password : credentials.password})
        })

        const json = await response.json();
        console.log(json);
        if(json.success) {
            localStorage.setItem('token', json.authToken);
            props.showAlert("Login Successfully", "success");
            navigation('/');
        } 
        else {
            props.showAlert("Invalid Credentials", "danger")
        }
    }

  return (
    <div>
        <h3 className='mt-3'>Login to Continue to iNotebookPro</h3>
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" value={credentials.email} onChange={onChange}/>
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" id="password" name="password" value={credentials.password} onChange={onChange}/>
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
        </form>
    </div>
  )
}

export default Login
