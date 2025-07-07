import { useContext, useState } from "react";
import styles from "./style.module.scss";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";

import logo from "../../assets/logo.png";
import googleIcon from "../../assets/google-icon.svg";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface FormData {
  identifier?: string;
  nome: string;
  username: string;
  email: string;
  tel: string;
  senha: string;
}

interface FormErrors {
  field: string;
  message: string;
}

const Login = () => {
  const navigate = useNavigate();
  const { setUser, setLoading } = useContext(AuthContext);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formType, setFormType] = useState<"register" | "login">("login");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    if (formType === "register") {
      const response = await axios.post("http://localhost:3001/auth/signup", {
        nome: data.nome,
        username: data.username,
        tel: data.tel,
        email: data.email,
        senha: data.senha,
      });

      const result = await response.data;
      if (result.errors) {
        return result.errors.map((err: FormErrors) => {
          setError(err.field as keyof FormData, {
            type: "manual",
            message: err.message,
          });
          console.log(err);
          return;
        });
      }

      if (result.error) {
        return setError(result.error.field, {
          type: "manual",
          message: result.error.message,
        });
      }
      setFormType("login");
    } else if (formType === "login") {
      const response = await axios.post("http://localhost:3001/auth/signin", {
        identifier: data.identifier,
        senha: data.senha,
      });
      const result = await response.data;
      if (result.error) {
        setError(result.error.field, {
          type: "manual",
          message: result.error.message,
        });
        console.log(result);
        return;
      }
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
      setLoading(false);

      navigate("/");
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        }
      );

      const postUsers = async () => {
        const response = await axios.post(
          "http://localhost:3001/auth/signupgoogle",
          {
            email: userInfo.data.email,
            nome: userInfo.data.name,
            username: `${userInfo.data.name}${userInfo.data.sub.slice(0, 4)}`,
            tel: " ",
            user_role: "cliente",
            senha: userInfo.data.sub.slice(0, 10),
          }
        );
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
        setLoading(false);
        navigate("/");
      };
      postUsers();
    },
  });

  return (
    <div>
      <div className={styles.loginContainer}>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <img
            src={logo}
            className={styles.logo}
            alt=""
            width={160}
            height={160}
          />

          {formType === "login" ? (
            <div className={styles.formContainer}>
              <div className={styles.inputBox}>
                <input
                  type="text"
                  id="email-or-username"
                  required
                  placeholder=" "
                  {...register("identifier", {
                    required: "Campo obrigatório",
                  })}
                />
                <label className={styles.label} htmlFor="email-or-username">
                  Email ou Username
                </label>
                {errors.identifier && (
                  <div className={styles.errorMessage}>
                    {errors.identifier.message}
                  </div>
                )}
              </div>
              <div className={styles.inputBox}>
                {passwordVisible ? (
                  <FaEyeSlash onClick={() => setPasswordVisible(false)} />
                ) : (
                  <FaEye onClick={() => setPasswordVisible(true)} />
                )}
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="senha"
                  required
                  placeholder=" "
                  {...register("senha")}
                />
                <label
                  className={`${styles.label} ${styles.labelSenha}`}
                  htmlFor="senha"
                >
                  Senha
                </label>
                {errors.senha && (
                  <div className={styles.errorMessage}>
                    {errors.senha.message}
                  </div>
                )}
              </div>

              <span>
                Não tem conta?{" "}
                <a onClick={() => setFormType("register")}> Crie uma conta</a>
              </span>

              <button>Entrar</button>
              <span>Ou</span>
              <button
                onClick={() => googleLogin()}
                className={styles.googleBtn}
              >
                <img src={googleIcon} width={16} alt="" />
                Entrar com Google
              </button>
            </div>
          ) : (
            <div className={styles.formContainer}>
              <div className={styles.inputBox}>
                <input
                  type="text"
                  id="nome"
                  required
                  placeholder=" "
                  {...register("nome")}
                />
                <label className={styles.label} htmlFor="nome">
                  Seu nome
                </label>
                {errors.nome && (
                  <div className={styles.errorMessage}>
                    {errors.nome.message}
                  </div>
                )}
              </div>
              <div className={styles.inputBox}>
                <input
                  type="text"
                  id="username"
                  required
                  placeholder=" "
                  {...register("username")}
                />
                <label className={styles.label} htmlFor="username">
                  Username
                </label>
                {errors.username && (
                  <div className={styles.errorMessage}>
                    {errors.username.message}
                  </div>
                )}
              </div>
              <div className={styles.inputBox}>
                <input
                  type="text"
                  id="tel"
                  maxLength={11}
                  required
                  placeholder=" "
                  {...register("tel")}
                  onKeyDown={(e) => {
                    const key = e.key;
                    const allowed = /[0-9- ]$/;

                    if (
                      !allowed.test(key) &&
                      key !== "Backspace" &&
                      key !== "Minus"
                    )
                      e.preventDefault();
                  }}
                  onBlur={(e) => {
                    const raw = e.target.value;
                    if (raw.length === 11) {
                      const formatted = raw.replace(
                        /(\d{2})(\d{5})(\d{4})/,
                        "($1) $2-$3"
                      );
                      e.target.value = formatted;
                    }
                  }}
                />
                <label className={styles.label} htmlFor="tel">
                  Tel
                </label>
                {errors.tel && (
                  <div className={styles.errorMessage}>
                    {errors.tel.message}
                  </div>
                )}
              </div>
              <div className={styles.inputBox}>
                <input
                  type="email"
                  id="email"
                  required
                  placeholder=" "
                  {...register("email")}
                />
                <label className={styles.label} htmlFor="email">
                  Email
                </label>
                {errors.email && (
                  <div className={styles.errorMessage}>
                    {errors.email.message}
                  </div>
                )}
              </div>
              <div className={styles.inputBox}>
                <input
                  type="text"
                  id="senha"
                  required
                  placeholder=" "
                  {...register("senha")}
                />
                <label className={styles.label} htmlFor="senha">
                  Senha
                </label>
                {errors.senha && (
                  <div className={styles.errorMessage}>
                    {errors.senha.message}
                  </div>
                )}
              </div>
              <span>
                Já tem uma conta?{" "}
                <a onClick={() => setFormType("login")}>Faça login</a>
              </span>
              <button>Cadastrar</button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
