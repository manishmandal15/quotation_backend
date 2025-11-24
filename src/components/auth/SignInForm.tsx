import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

 const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  try {
    setLoading(true);

    // ✅ Use dynamic base URL
    const res = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password,
    });

    if (res.data.success) {
      // ✅ Store logged-in user
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login successful!");

      navigate("/home"); // redirect to dashboard
    } else {
      alert(res.data.message || "Login failed");
    }
  } catch (err: any) {
    alert(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex flex-col flex-1">
   

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <form onSubmit={handleLogin}>
          <h1 className="mb-6 text-xl font-semibold">Sign In</h1>

          <div className="space-y-6">
            <div>
              <Label>Email <span className="text-red-500">*</span></Label>
              <Input
                placeholder="info@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <Label>Password <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeIcon className="size-5" />
                  ) : (
                    <EyeCloseIcon className="size-5" />
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox checked={isChecked} onChange={setIsChecked} />
              <span>Keep me logged in</span>
            </div>

            <Button className="w-full" size="sm" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Sign In"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
