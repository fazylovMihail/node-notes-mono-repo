import { queryClient } from "@client/api/queryClient";
import { fetchUserLogin } from "@client/api/User";
import { setProfile } from "@client/app/features/profileSlice";
import { useAppDispatch } from "@client/app/store";
import { LoginUserSchema, LoginUser, PostAuthUser } from "@shared/models/User";
import { useMutation } from "@tanstack/react-query";
import { FC, FormHTMLAttributes } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../Input";
import { Button } from "../../Button";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "../../Link";
import { TError } from "@shared/models/Error";

import "../AuthForm.scss";

export const LoginForm: FC<FormHTMLAttributes<HTMLFormElement>> = (props) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginUser>({
    resolver: zodResolver(LoginUserSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: fetchUserLogin,
    onSuccess: (data: PostAuthUser) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      dispatch(setProfile(data.user.username));
      navigate("/dashboard", { replace: true });
    },
    onError: (error: TError) => {
      setError("username", {
        type: "server",
        message: error.message,
      });
      setError("password", {
        type: "server",
        message: error.message,
      });
    },
  });

  const onSubmit: SubmitHandler<LoginUser> = (data) => {
    mutate(data);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit(onSubmit)} {...props}>
      <h1 className="auth-form__heading">Вход</h1>

      <div className="auth-form__content">
        <Input
          type="text"
          id="input-username"
          labelText="Имя"
          autoComplete="off"
          {...register("username")}
          isRequire
          errorText={errors.username?.message}
        />
        <Input
          type="password"
          id="input-password"
          labelText="Пароль"
          autoComplete="new-password"
          {...register("password")}
          isRequire
          errorText={errors.password?.message}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Вход..." : "Войти"}
        </Button>
      </div>
      <Link to={"/register"} modificators={[`auth-form__bottom-link`]}>
        Нет аккаунта
      </Link>
    </form>
  );
};
