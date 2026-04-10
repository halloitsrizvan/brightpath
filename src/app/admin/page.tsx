import { Metadata } from 'next';
import LoginForm from '../components/auth/LoginForm';

export const metadata: Metadata = {
    robots: { index: false, follow: false }
};

export default function AdminLogin() {
    return <LoginForm role="admin" roleTitle="Administrator" />;
}
