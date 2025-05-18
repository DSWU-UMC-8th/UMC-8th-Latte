import useForm from "../hooks/useForms";
import { UserSigninInformation, validateSignin } from "../utils/validate";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const LoginPage = () => {
    const { login, accessToken } = useAuth();
    const navigate = useNavigate();

    useEffect(()=> { // 로그인 후 로그인 창 안 뜨게
        if(accessToken){
            navigate("/");
        }
    }, [navigate, accessToken]);

    const { values, errors, touched, getInputProps } = useForm<UserSigninInformation>({
        initialValue: {
            email: "",
            password: "",
        },

        validate: validateSignin,
    });

    const handleSubmit = async () => {
        await login(values);
    };

    const handleGoogleLogin = () => {
        window.location.href = import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
    }

    // 오류가 하나라도 있거나, 입력값이 비어있으면 버튼 비활성화
    const isDisabled = 
        Object.values(errors || {}).some((error) => error.length > 0) || // 오류가 있으면 true
        Object.values(values).some((value) => value === ""); // 입력값이이 비어있으면 true

    return (
        <div className="flex flex-col justify-center items-center h-full gap-4
            w-full bg-black text-white">
            
            <Header title="로그인" />
            
            <div className="flex flex-col gap-3">
                <input
                    {...getInputProps("email")}
                    name="email"
                    className={`disabled:bg-neutral-800 w-[300px] p-[10px] border-1 rounded-sm
                        ${errors?.email && touched?.email ? "border-red-500" : "border-gray-300"}`}
                    type={"email"}
                    placeholder={"이메일"}
                />
                {errors?.email && touched.email && (
                    <div className="text-red-500 text-sm">{errors.email}</div>
                )}

                <input
                    {...getInputProps("password")}
                    className={`disabled:bg-neutral-800 w-[300px] p-[10px] border-1 rounded-sm 
                        ${errors?.password && touched?.password ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                    type={"password"}
                    placeholder={"비밀번호"}
                />
                {errors?.password && touched.password && (
                    <div className="text-red-500 text-sm">{errors.password}</div>
                )}

                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isDisabled}
                    className= "w-full bg-pink-600 text-white py-3 rounded-md text-lg font-medium hover:bg-pink-700 transition-colors cursor-pointer disabled:bg-neutral-800"
                >
                    로그인
                </button>
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
    )
};


export default LoginPage;