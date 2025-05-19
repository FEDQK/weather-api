export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!email || typeof email !== 'string') return false;
  
  if (!emailRegex.test(email)) return false;
  
  try {
    const [localPart, domain] = email.split('@');
    if (localPart.length > 64) return false;
    if (domain.length > 255) return false;
    if (domain.startsWith('.') || domain.endsWith('.')) return false;
    
    const domainParts = domain.split('.');
    if (domainParts.length < 2) return false;
    if (domainParts[domainParts.length - 1].length < 2) return false;
    
    return true;
  } catch (error) {
    return false;
  }
}
