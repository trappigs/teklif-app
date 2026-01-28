import { isAuthenticated } from '@/app/auth/actions';
import NavbarContent from './NavbarContent';

export default async function Navbar() {
  const isLoggedIn = await isAuthenticated();
  return <NavbarContent isLoggedIn={isLoggedIn} />;
}