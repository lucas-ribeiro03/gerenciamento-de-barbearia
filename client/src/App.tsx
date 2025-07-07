import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import styles from "./styles/global.module.scss";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import { AuthProvider } from "./context/AuthContext";
import { DateProvider } from "./context/DateContext";
import { ScheduledProvider } from "./context/ScheduledContext";
import { ProfileProvider } from "./context/ProfileContext";

function App() {
  return (
    <GoogleOAuthProvider clientId="578224821246-bunavvhql8b56j34rs3qqs1ikk0jtbli.apps.googleusercontent.com">
      <Router>
        <AuthProvider>
          <ProfileProvider>
            <ScheduledProvider>
              <DateProvider>
                <div className={styles.global}>
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Home />} />
                  </Routes>
                </div>
              </DateProvider>
            </ScheduledProvider>
          </ProfileProvider>
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
