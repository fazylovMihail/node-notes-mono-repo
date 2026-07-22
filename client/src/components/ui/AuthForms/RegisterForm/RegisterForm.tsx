import { FC, FormHTMLAttributes } from "react";
import { Input } from "../../Input";
import { Link } from "../../Link";
import { Button } from "../../Button";
import { useAppDispatch } from "@client/app/store";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  RegisterUserSchema,
  RegisterUser,
  PostAuthUser,
} from "@shared/models/User";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { fetchUserRegister } from "@client/api/User";
import { queryClient } from "@client/api/queryClient";
import { useNavigate } from "react-router-dom";
import { setProfile } from "@client/app/features/profileSlice";
import { TError } from "@shared/models/Error";

import "../AuthForm.scss";
import { Helmet } from "react-helmet-async";

export const RegisterForm: FC<FormHTMLAttributes<HTMLFormElement>> = (
  props,
) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterUser>({
    resolver: zodResolver(RegisterUserSchema),
  });

  const registerMutate = useMutation({
    mutationFn: fetchUserRegister,
    onSuccess: (data: PostAuthUser) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      dispatch(setProfile(data.user.username));
      navigate(`/dashboard/${data.defaultNote?.note_id}`, { replace: true });
    },
    onError: (error: TError) => {
      setError("username", {
        type: "server",
        message: error.message,
      });
    },
  });

  const onSubmit: SubmitHandler<RegisterUser> = (data) => {
    registerMutate.mutate(data);
  };

  return (
    <>
      <Helmet>
        <title>Регистрация | Заметки</title>
      </Helmet>
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)} {...props}>
        <h1 className="auth-form__heading">Регистрация</h1>
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
          <Button type="submit" disabled={registerMutate.isPending}>
            {registerMutate.isPending ? "Регистрация..." : "Регистрация"}
          </Button>
        </div>
        <Link to={"/login"} modificators={[`auth-form__bottom-link`]}>
          Уже есть аккаунт
        </Link>
      </form>
    </>
  );
};
