import type { LdapUserInfo } from './types';

export async function ldapAuthenticate(email: string, password: string): Promise<boolean> {
  try {
    // Simulation - remplacer par la vraie logique LDAP avec ldapjs
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Pour les tests, accepter certains utilisateurs
    const testUsers = ['test.user@ocp.ma', 'admin@ocp.ma'];
    return testUsers.includes(email) && password === 'ldappass';
  } catch (error) {
    console.error('Erreur LDAP:', error);
    return false;
  }
}

export async function getLdapUserInfo(email: string): Promise<LdapUserInfo | null> {
  try {
    // Simulation - remplacer par la vraie logique LDAP avec ldapjs
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (email === 'test.user@ocp.ma') {
      return {
        employeeId: '12345',
        username: 'test.user',
        email: 'test.user@ocp.ma',
        department: 'IT',
        firstName: 'Test',
        lastName: 'User'
      };
    }
    
    return null;
  } catch (error) {
    console.error('Erreur récupération info LDAP:', error);
    return null;
  }
}
