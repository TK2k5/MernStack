import { SchemaType, schema } from '@/utils/rules.util';
import { Eye, EyeOff } from 'lucide-react';

import authApi from '@/api/auth.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import path from '@/configs/path.config';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

type LoginFormType = Pick<SchemaType, 'email' | 'password'>;
const loginSchema = schema.pick(['email', 'password']);

export default function LoginPage() {
	const [showPassword, setShowPassword] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormType>({
		resolver: yupResolver(loginSchema),
	});

	// đăng nhập
	const loginMutation = useMutation({
		mutationKey: ['login'],
		mutationFn: (body: LoginFormType) => authApi.login(body),
		onSuccess: (data) => {
			console.log('🚀 ~ LoginPage ~ data:', data);
		},
		onError: (error) => {
			console.log('🚀 ~ LoginPage ~ error:', error);
		},
	});

	const onSubmit = (values: LoginFormType) => {
		loginMutation.mutate(values);
	};

	return (
		<div className="flex flex-col justify-center min-h-screen py-12 bg-gray-100 sm:px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
					Đăng nhập
				</h2>
			</div>

			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
					<form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
						<div>
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								{...register('email')}
								type="text"
								autoComplete="email"
								className="mt-1"
							/>
							{errors.email && (
								<p className="text-sm text-red-500">{errors.email.message}</p>
							)}
						</div>

						<div>
							<Label htmlFor="password">Mật khẩu</Label>
							<div className="relative mt-1">
								<Input
									id="password"
									{...register('password')}
									type={showPassword ? 'text' : 'password'}
									autoComplete="current-password"
									className="pr-10"
								/>
								<button
									type="button"
									className="absolute inset-y-0 right-0 flex items-center pr-3"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? (
										<EyeOff className="w-5 h-5 text-gray-400" />
									) : (
										<Eye className="w-5 h-5 text-gray-400" />
									)}
								</button>
							</div>
							{errors.password && (
								<p className="text-sm text-red-500">
									{errors.password.message}
								</p>
							)}
						</div>

						<div className="flex items-center justify-between">
							<div className=""></div>
							<div className="text-sm">
								<Link
									to={path.forgotPassword}
									className="font-medium text-primary"
								>
									Quên mật khẩu?
								</Link>
							</div>
						</div>

						<div>
							<Button type="submit" className="w-full bg-primary ">
								Đăng nhập
							</Button>
						</div>
					</form>

					<div className="mt-6">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<Separator />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 text-gray-500 bg-white">
									Hoặc đăng nhập bằng
								</span>
							</div>
						</div>
					</div>

					<div className="mt-6 text-center">
						<p className="text-sm text-gray-600">
							Bạn chưa có tài khoản?{' '}
							<a href="#" className="font-medium text-primary">
								Đăng ký ngay
							</a>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
