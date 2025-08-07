'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
const router = useRouter();

useEffect(() => {
  // Vérifier si l'utilisateur est déjà connecté
  const authToken = localStorage.getItem("authToken");
  const user = localStorage.getItem("userInfo");
  
  if (authToken && user) {
    // Rediriger vers le dashboard si connecté
    router.push("/dashboard");
  } else {
    // Rediriger vers la page de bienvenue si non connecté
    router.push("/welcome");
  }
}, [router]);

return (
  <div className="min-vh-100 d-flex align-items-center justify-content-center">
    <div className="spinner-border text-success" role="status">
      <span className="visually-hidden">Chargement...</span>
    </div>
  </div>
);
}
