
import { useState, FormEvent } from 'react';
import { useMutation } from 'react-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

interface Errors {
  [key: string]: string;
}

async function signupApiCall({ username, email, password }: { username: string; email: string; password: string }) {
  const response = await fetch('https://seekon.vercel.app/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });

  if (!response.ok) {
    const responseData = await response.json();
    throw new Error(responseData.message || 'Error signing up');
  }

  return await response.json();
}

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  
  const { mutate, isLoading, isError, data } = useMutation(signupApiCall);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formErrors: Errors = {};
    if (!username.trim()) {
      formErrors.username = 'Username is required';
    }
    if (!email.trim()) {
      formErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      formErrors.email = 'Email is invalid';
    }
    if (!password.trim()) {
      formErrors.password = 'Password is required';
    } else if (password.length < 6) {
      formErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(formErrors).length === 0) {
      // If there are no form errors, call the mutate function
      setErrors({});
      mutate({ username, email, password }); 
    } else {
      // If there are form errors, set them in the state
      setErrors(formErrors); 
    }
  };

  if (isError) {
    return <h4>Internal Server Error</h4>
  }

  return (
    <>
      
      <div className="flex justify-center items-center h-screen">
        <form onSubmit={handleSubmit} className="max-w-md w-full p-4 bg-white rounded-lg">
          <input 
            type="text" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            placeholder='Enter Username' 
            className="w-full px-4 py-2 mb-4 rounded border focus:outline-none focus:border-blue-500" 
            disabled={!!(isLoading || (data && data.message))}
          />
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            placeholder='Your Email' 
            className="w-full px-4 py-2 mb-4 rounded border focus:outline-none focus:border-blue-500" 
            disabled={!!(isLoading || (data && data.message))}
          />
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            placeholder='Enter Password' 
            className="w-full px-4 py-2 mb-4 rounded border focus:outline-none focus:border-blue-500" 
            disabled={!!(isLoading || (data && data.message))}
          />
          {errors.password && <p className="text-red-500">{errors.password}</p>}
          {errors.username && <p className="text-red-500">{errors.username}</p>}
          {errors.email && <p className="text-red-500">{errors.email}</p>}
          {!(errors.username || errors.email || errors.password) && data && data.message && <p>{data.message}</p>}
          {!(errors.username || errors.email || errors.password) && isError && <p className="text-red-500">An error occurred during signup.</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 rounded bg-blue-500 text-white font-bold hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            {isLoading ? (
              <FontAwesomeIcon icon={faSpinner} spin className="text-white-500 text-xl" />
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
      </div>
    </>
  );
}
