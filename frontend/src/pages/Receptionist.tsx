// Receptionist.tsx (ya está correcto)
/**
 * Receptionist: Main page for receptionist role
 * Purpose: Entry point for receptionist dashboard with stock management
 */
import { User } from '../types/user';
import { useState, useEffect } from 'react';
import NavBarReceiver from '../components/NavBarReceiver';
import ReceiverDashboard from '../components/ReceiverDashboard'; // Esta importación debe ser correcta

interface ReceptionistProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

function Receptionist({ user, setUser }: ReceptionistProps) {
  return (
    <div>
      <NavBarReceiver user={user} setUser={setUser} />
      <ReceiverDashboard />
    </div>
  );
}


export default Receptionist;