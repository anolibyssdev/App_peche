import "./RegisterUser.css";
import { useReducer } from "react";
import * as yup from "yup";
import registerUserReducer, {
  initialState,
} from "../reducers/registerUserReducer";
import axios from "../services/axios";

const roles = ["ADMIN", "USER"];

// password must contain almost one upper case, one lower case, a number and a special character contained in [!@#$%^&*], and have 8 to 32 characters
const schemaForCreation = yup.object().shape({
  password: yup
    .string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
      "Password must contain almost one upper case, one lower case, one number and a special character contained in [!@#$%^&*]"
    )
    .min(8, "Password must be almost 8 characters")
    .max(32, "Password must be max 32 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
      "Confirm Password must contain almost one upper case, one lower case, one number and a special character contained in [!@#$%^&*]"
    )
    .min(8, "Confirm Password and Password must be almost 8 characters")
    .max(32, "Confirm Password and Password must be max 32 characters")
    .required("Confirm Password is required")
    .oneOf([yup.ref("password")], "Password and Confirm Password must match"),
  email: yup
    .string()
    .email({
      minDomainSegments: 2,
      // tlds: { allow: ["com", "net"] },
    })
    .required(),
  username: yup.string().required("username is required"),
  firstname: yup.string().required("firstname is required"),
  lastname: yup.string().required("lastname is required"),
  role: yup.string().oneOf(roles),
});

export default function RegisterUser() {
  const [state, dispatch] = useReducer(registerUserReducer, initialState);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await schemaForCreation.validate(state);

      await axios.post("users/register", {
        email: state.email,
        password: state.password,
        role: state.role,
        username: state.username,
        firstname: state.firstname,
        lastname: state.lastname,
      });
      dispatch({ type: "RESET_FORM" });
      return alert("User registered successfully");
    } catch (err) {
      if (err?.response?.status === 400) {
        return alert("Email already used");
      }
      return alert(JSON.stringify(err.message));
    }
  };

  return (
    <section className="login-container">
      <h1 className="login-title">Sign Up</h1>
      <form className="fields" onSubmit={handleSubmit}>
        <label htmlFor="email">
          Email:{" "}
          <input
            className="login-input"
            id="email"
            placeholder="your email"
            type="email"
            required
            value={state.email}
            onChange={(e) =>
              dispatch({ type: "UPDATE_EMAIL", payload: e.target.value })
            }
          />
        </label>
        <label htmlFor="password">
          Password:{" "}
          <input
            className="login-input"
            id="password"
            placeholder="your password"
            type="password"
            required
            value={state.password}
            onChange={(e) =>
              dispatch({ type: "UPDATE_PASSWORD", payload: e.target.value })
            }
          />
        </label>
        <label htmlFor="password">
          Confirm Password:{" "}
          <input
            className="login-input"
            id="confirmPassword"
            placeholder="confirm your password"
            type="password"
            required
            value={state.confirmPassword}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_CONFIRM_PASSWORD",
                payload: e.target.value,
              })
            }
          />
        </label>
        <label htmlFor="username">
          Username:{" "}
          <input
            className="login-input"
            id="username"
            placeholder="your username"
            type="username"
            required
            value={state.username}
            onChange={(e) =>
              dispatch({ type: "UPDATE_USERNAME", payload: e.target.value })
            }
          />
        </label>{" "}
        <label htmlFor="firstname">
          Firstname:{" "}
          <input
            className="login-input"
            id="firstname"
            placeholder="your firstname"
            type="firstname"
            required
            value={state.firstname}
            onChange={(e) =>
              dispatch({ type: "UPDATE_FIRSTNAME", payload: e.target.value })
            }
          />
        </label>{" "}
        <label htmlFor="lastname">
          Lastname:{" "}
          <input
            className="login-input"
            id="lastname"
            placeholder="your lastname"
            type="lastname"
            required
            value={state.lastname}
            onChange={(e) =>
              dispatch({ type: "UPDATE_LASTNAME", payload: e.target.value })
            }
          />
        </label>
        <label htmlFor="role">
          Role:
          <select
            id="role"
            value={state.role}
            onChange={(e) =>
              dispatch({ type: "UPDATE_ROLE", payload: e.target.value })
            }
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </label>
        <button className="login-btn" type="submit">
          Register
        </button>
      </form>
    </section>
  );
}
