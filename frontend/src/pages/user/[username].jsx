// pages/user/[username].js

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function UserPage({ initialUserData, error }) {
  const router = useRouter();
  const { username } = router.query; 

  const [user, setUser] = useState(initialUserData.user);
  const [isLoading,setisLoading]=useState(false)

  const handleLogout = async () => { 
    setisLoading(true)
    try {
      const response = await fetch('https://seekon.vercel.app/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to logout');
      }

      // Redirect to login page after successful logout
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!user) {
    return <p>User not found</p>;
  }

  return (
    <>
      <div className="flex">
        <div className="flex-1 p-10 mt-40 ml-20">
          <h1 className="text-2xl font-bold mb-4">User Profile</h1>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          {/* Add more user details here */}
        </div>
      </div>
      <div className="ml-40 mt-4">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white font-bold rounded hover:bg-red-700 focus:outline-none focus:bg-red-700"
          disabled={isLoading}
        >
          {isLoading ? (
              <FontAwesomeIcon icon={faSpinner} spin className="text-white-500 text-xl" />
            ) : (
              "Log Out"
            )}
        </button>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { username } = context.params;

  try {
    const res = await fetch(`https://seekon.vercel.app/api/user/${username}`);
    if (!res.ok) {
      throw new Error('Failed to fetch user data');
    }
    const userData = await res.json();
    // console.log(userData)
    return {
      props: {
        initialUserData: userData,
        error: null,
      },
    };
  } catch (error) {
    return {
      props: {
        initialUserData: null,
        error: error.message,
      },
    };
  }
}
