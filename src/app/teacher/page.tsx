import { Metadata } from 'next';
import LoginForm from '@/features/auth/components/LoginForm';

export const metadata: Metadata = {
    robots: { index: false, follow: false }
};

export default function TeacherLogin() {
    return <LoginForm role="teacher" roleTitle="Teacher" />;
}
