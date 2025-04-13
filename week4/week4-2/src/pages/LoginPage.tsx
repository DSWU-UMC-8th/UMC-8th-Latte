import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForms";
import { UserSigninInformation, validateSignin } from "../utils/validate";
import { postSignin } from "../apis/auth";
import Header from "../components/Header";

const LoginPage = () => {

    const { values, errors, touched, getInputProps } = useForm<UserSigninInformation>({
        initialValue: {
            email: "",
            password: "",
        },

        validate: validateSignin,
    });

    const navigate = useNavigate();

    const handleSubmit = async () => {
        console.log(values);

        try {
            const response = await postSignin(values);
            localStorage.setItem("accessToken", response.data.accessToken); 
            console.log(response);
            
            navigate('/');
        } catch (e) {
            // console.log(e);
            alert(e);
        }

    };

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
                    className= "w-full bg-pink-600 text-white/50 py-3 rounded-md text-lg font-medium hover:bg-pink-700 transition-colors cursor-pointer disabled:bg-neutral-800"
                >
                    로그인
                </button>
            </div>
        </div>
    )
};


export default LoginPage;