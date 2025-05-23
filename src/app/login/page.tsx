import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex w-full items-center justify-center h-screen">
      <div className="w-full p-4 max-w-4xl">
        <LoginForm />
      </div>
    </div>
  );
}
