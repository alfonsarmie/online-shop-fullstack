import NavBarAdmin from "../components/NavBarAdmin";
import { User } from '../types/user';
import { useState, useEffect } from 'react';

// Admin.jsx
function Admin() {
  // State to manage user authentication
  const [user, setUser] = useState<User | null>(null);

  // Check for user in localStorage on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);
    return (
        
        <div>
            <NavBarAdmin user={user} setUser={setUser} />
            <h1>En desarrollo...</h1>
        </div>
    );
}

export default Admin;