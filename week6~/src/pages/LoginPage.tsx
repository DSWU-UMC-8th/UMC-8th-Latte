import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { login } from '../apis/auth';
import { useAuth } from '../context/AuthContext';
import Header from "../components/Header";

const LoginPage = () => {
    const navigate = useNavigate();
    const { login: handleLogin } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            handleLogin(data.data.accessToken, data.data.refreshToken);
            navigate('/');
        },
        onError: (error) => {
            console.error('로그인 실패:', error);
            alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await loginMutation.mutateAsync({ email, password });
        } catch {
            // Error will be handled by onError callback
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
    }

    // 오류가 하나라도 있거나, 입력값이 비어있으면 버튼 비활성화
    const isDisabled = 
        Object.values(loginMutation.error || {}).some((error) => error.length > 0) || // 오류가 있으면 true
        email === "" || password === ""; // 입력값이이 비어있으면 true

    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="bg-zinc-900 p-8 rounded-lg w-full max-w-md">
                <Header title="로그인" />
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            placeholder="이메일"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 bg-zinc-800 text-white rounded border border-zinc-700 focus:outline-none focus:border-pink-500"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 bg-zinc-800 text-white rounded border border-zinc-700 focus:outline-none focus:border-pink-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isDisabled}
                        className="w-full py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors"
                    >
                        {loginMutation.isPending ? '로그인 중...' : '로그인'}
                    </button>
                </form>
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className= "w-full bg-white text-black py-3 rounded-md text-lg font-medium hover:bg-pink-700 transition-colors cursor-pointer disabled:bg-neutral-800"
                >
                    <div className="flex items-center justify-center gap-2">
                        <img src={"/googleLogo.png"} alt="구글 로고 이미지" className="size-5"/>
                        <span>구글 로그인</span>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default LoginPage;