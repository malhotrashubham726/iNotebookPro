import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {

  const [credentials, setCredentials] =useState({
    name: "",
    email: "",
    password: "",
    cpassword: ""
  })

  const onChange = (event)=> {
    setCredentials({...credentials, [event.target.name] : event.target.value})
  }

  let navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    if(credentials.password === credentials.cpassword) {
      const {name, email, password} = credentials;
      const response = await fetch('http://localhost:5000/api/auth/createuser', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({name: name, email: email, password: password})
      })
  
      const json = await response.json();
      console.log(json);
  
      if (json.success) {
        localStorage.setItem('token',json.authToken);
        props.showAlert("Account Created Successfully", "success");
        navigate("/");
      }
  
      else {
        props.showAlert("Invalid credentials", "danger")
      }
    }

    else {
      props.showAlert("Password mismatch", "danger");
      setCredentials({
        name: credentials.name,
        email: credentials.email,
        password: "",
        cpassword: ""
      })
    }
  }

  return (
    <div className='container'>
      <h3 className='mt-3'>Create an account to use iNotebookPro</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" name="name" aria-describedby="emailHelp" value={credentials.name} onChange={onChange}/>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
          <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" value={credentials.email} onChange={onChange}/>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" name="password" value={credentials.password} onChange={onChange} required minLength={5}/>
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">Confirm Password</label>
          <input type="password" className="form-control" id="cpassword" name="cpassword" value={credentials.cpassword} onChange={onChange} required minLength={5}/>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default Signup
