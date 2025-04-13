import { useNavigate } from "react-router-dom";
import {z} from 'zod';
import {SubmitHandler, useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResponseSignupDto } from '../types/auth';
import { postSignup } from '../apis/auth';
import Header from "../components/Header";
import { useState } from "react";
import { EnvelopeIcon, UserCircleIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'

const schema = z
    .object({
        email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
        password: z
        .string()
        .min(8, {
            message: "비밀번호는 8자 이상이어야 합니다.",
        })
        .max(20, {
            message: "비밀번호는 20자 이하여야 합니다. ",
        }),
        passwordCheck: z
        .string()
        .min(8, {
            message: "비밀번호는 8자 이상이어야 합니다.",
        })
        .max(20, {
            message: "비밀번호는 20자 이하여야 합니다. ",
        }),
        name: z.string().min(1, { message: "이름을 입력해주세요." }),
    })
    .refine((data) => data.password === data.passwordCheck, {
        message: "비밀번호가 일치하지 않습니다.",
        path: ["passwordCheck"],
    });   

type FormFields = z.infer<typeof schema> // 타입 유추

const SignupPage = () => {

    const navigate = useNavigate();

    const {register, handleSubmit, watch, formState: {errors, isSubmitting},
    } = useForm<FormFields>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            passwordCheck: "",
        },
            resolver: zodResolver(schema),
            mode: "onBlur",
        })
    
    // 단계별 진행 
    const [step, setStep] = useState(1);

    // 입력값 확인용
    const email = watch('email');
    const password = watch('password');
    const passwordCheck = watch('passwordCheck');
    const name = watch('name');
    
    // step에 따른 조건
    const isStep1Valid = !errors.email && email;
    const isStep2Valid = !errors.password && !errors.passwordCheck && password && passwordCheck;
    
    // 비밀번호 보이기
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordCheck, setShowPasswordCheck] = useState(false);

    const onSubmit:SubmitHandler<FormFields> = async (data) => {
        console.log(data); // 계정 확인
        const {passwordCheck, ...rest} = data; // 역구조분해할당
        console.log(passwordCheck);

        const response: ResponseSignupDto = await postSignup(rest);
        console.log(response); // 요청 확인

        navigate('/login');
    };

    return (
        <div className="flex flex-col justify-center items-center h-full gap-4
            w-full bg-black text-white">
            
            <Header title="회원가입" />

            <div className="flex flex-col gap-3">
                {/* 이메일 */}
                {step === 1 && (
                    <>
                        <input
                            {...register('email')}
                            name="email"
                            className={`bg-neutral-800 w-[300px] p-[10px] border-1 rounded-sm
                                ${errors?.email ? "border-red-500" : "border-gray-300"}`}
                            type={"email"}
                            placeholder={"이메일"}
                        />

                        {errors.email && <div className={'text-red-500 text-sm'}>{errors.email.message}</div>}
                        <button
                            type="button"
                            disabled={!isStep1Valid}
                            className="w-full bg-pink-600 text-white py-2 rounded-md text-lg font-medium hover:bg-pink-700 transition-colors 
                                cursor-pointer disabled:bg-neutral-800"
                            onClick={() => setStep(2)}
                        >
                            다음
                        </button>
                    </>
                )}

                {/* 비밀번호 */}
                {step === 2 && (
                    <>  
                        <div className="flex gap-2 items-center mb-2">
                            <EnvelopeIcon className="w-[20px] h-[20px] color-white" />
                            <p>{email}</p>
                        </div>
                        
                        <div className="relative w-[300px]">
                            <input
                                {...register('password')}
                                className={`bg-neutral-800 w-[300px] p-[10px] border-1 rounded-sm 
                                    ${errors?.password ? "border-red-500" : "border-gray-300"}`}
                                type={showPassword ? "text" : "password"}
                                placeholder={"비밀번호"}
                            />
                            <div
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                onClick={() => setShowPassword(prev => !prev)}
                            >
                                {showPassword ? (
                                    <EyeIcon className="w-5 h-5 text-gray-600" />
                                ) : (
                                    <EyeSlashIcon className="w-5 h-5 text-gray-600" />
                                )}
                            </div>
                        </div>
                        {errors.password && <div className={'text-red-500 text-sm'}>{errors.password.message}</div>}
                        
                        {/* 비밀번호 확인 입력 */}
                        <div className="relative w-[300px]">
                            <input
                                {...register("passwordCheck")}
                                type={showPasswordCheck ? "text" : "password"}
                                className={`bg-neutral-800 w-[300px] p-[10px] border-1 rounded-sm
                                    ${errors?.passwordCheck ? "border-red-500" : "border-gray-300"}`}
                                placeholder={"비밀번호 확인"}
                            />
                            <div
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                onClick={() => setShowPasswordCheck(prev => !prev)}
                            >
                                {showPasswordCheck ? (
                                    <EyeIcon className="w-5 h-5 text-gray-600" />
                                ) : (
                                    <EyeSlashIcon className="w-5 h-5 text-gray-600" />
                                )}
                            </div>
                        </div>
                        {errors.passwordCheck && <div className={'text-red-500 text-sm'}>{errors.passwordCheck.message}</div>}
                    
                        <button
                            type="button"
                            disabled={!isStep2Valid}
                            className="w-full bg-pink-600 text-white py-3 rounded-md text-lg font-medium hover:bg-pink-700 transition-colors 
                                cursor-pointer disabled:bg-neutral-800"
                            onClick={() => setStep(3)}
                        >
                                다음
                        </button>
                    </>
                )}

                {/* 이름 */}
                {step === 3 && (
                    <>  
                        <div className="flex flex-col items-center mb-2">
                            <UserCircleIcon className="w-[150px] h-[150px] color-white" />
                        </div>

                        <input
                            {...register('name')}
                            className={`bg-neutral-800 w-[300px] p-[10px] border-1 rounded-sm
                                ${errors?.email ? "border-red-500" : "border-gray-300"}`}
                            type={"name"}
                            placeholder={"이름"}
                        />
                        {errors.name && <div className={'text-red-500 text-sm'}>{errors.name.message}</div>}
                        
                        <button
                            type="button"
                            onClick={handleSubmit(onSubmit)} 
                            disabled={isSubmitting || !name || !!errors.name}
                            className= "w-full bg-pink-600 text-white py-3 rounded-md text-lg font-medium hover:bg-pink-700 transition-colors cursor-pointer disabled:bg-neutral-800"
                        >
                            회원가입
                        </button>
                    </>
                )}
                
            </div>
        </div>
    )
};

export default SignupPage;