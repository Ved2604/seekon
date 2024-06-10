import { useState, FormEvent, useEffect } from 'react';
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

interface Errors {
  [key: string]: string;
}

async function loginApiCall({ usernameOrEmail, password }: { usernameOrEmail: string; password: string }) {
  const response = await fetch('http://localhost:8000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: usernameOrEmail,
      email: usernameOrEmail,
      password,
    }),
  });

  if (!response.ok) {
    const responseData = await response.json();
    throw new Error(responseData.message || 'Error logging in');
  }

  return await response.json();
}

export default function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [redirectToUsersPage, setRedirectToUsersPage] = useState(false);
  const router = useRouter();

  const { mutate, isLoading, isError, data } = useMutation(loginApiCall);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formErrors: Errors = {};
    if (!usernameOrEmail.trim()) {
      formErrors.usernameOrEmail = 'Username or Email is required';
    }
    if (!password.trim()) {
      formErrors.password = 'Password is required';
    }

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      mutate({ usernameOrEmail, password });
    }
  };

  useEffect(() => {
    if (data && data.user) {
      // Store user ID and username in local storage
      localStorage.setItem('userId', data.user._id);
      localStorage.setItem('username', data.user.username);

      // Redirect to users page after a short delay
      setTimeout(() => {
        setRedirectToUsersPage(true);
      }, 2000);
    }
  }, [data]);

  useEffect(() => {
    if (redirectToUsersPage) {
      router.push(`/user/${localStorage.getItem('username')}`);
    }
  }, [redirectToUsersPage]);

  return (
    <div className="flex">
      
      <div className="flex-1 p-10 mt-40 ml-20">
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <input
            type="text"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            placeholder="Username or Email"
            className="w-full px-4 py-2 mb-4 rounded border focus:outline-none focus:border-blue-500"
            disabled={isLoading}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 mb-4 rounded border focus:outline-none focus:border-blue-500"
            disabled={isLoading}
          />

          {errors.password && <p className="text-red-500">{errors.password}</p>}
          {errors.usernameOrEmail && <p className="text-red-500">{errors.usernameOrEmail}</p>}

          {isError && <p className="text-red-500">Internal Server Error</p>}

          {!(errors.usernameOrEmail || errors.password) &&
            data &&
            data.user && (
              <p>
                Logged in as: {data.user.username}...... Redirecting to your profile
              </p>
            )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 rounded bg-blue-500 text-white font-bold hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            {isLoading ? (
              <FontAwesomeIcon icon={faSpinner} spin className="text-white-500 text-xl" />
            ) : (
              "Log In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
