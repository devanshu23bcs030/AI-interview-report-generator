import '../auth.form.scss'
import { useNavigate , Link } from 'react-router';
import { useAuth } from '../hooks/useauth';
import { useState } from 'react';

const Register = () => {
    const navigate = useNavigate();
    const { loading , handleRegister} = useAuth()
    const [username, setusername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const result = await handleRegister(username, email, password);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
        }
    }
    if (loading){
        return (
            <main>
                Loading ..... 
            </main>
        )
    }
  return (
    <main>
        <div className="form-container">
            <h1>Register</h1>
            {error ? (
              <p className="auth-error" role="alert">
                {error}
              </p>
            ) : null}
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" id="username" placeholder='Enter your username' value={username} onChange={(e) => setusername(e.target.value)} />
                </div>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button className='button primary-button' type="submit">Register</button>
            </form>
            <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
    </main>
  )
}

export default Register