import fb from "./firebase";
import useAuthState from "./hooks";

export default function SignIn() {
  const { user, initializing } = useAuthState(fb.auth());
  const SignInWithGoogle = async () => {
    const provider = new fb.auth.GoogleAuthProvider();
    await fb.auth().useDeviceLanguage();

    try {
      await fb.auth().signInWithRedirect(provider);
    } catch (error) {
      console.log(error);
    }
  };

  if (initializing) return "Loading...";

  return (
    <div className="user-container">
      {user ? (
        <div className="user-info mt-20 text-center">
          <div className="user-info mt-20 text-center">
            <img src={user.photoURL} alt="user" className="user-avatar" />
          </div>
          <div className="user-info mt-20 text-center">
            <p className="user-greeting">Hello, {user.displayName}</p>
          </div>
        </div>
      ) : (
        <div className="user-signin mt-20 text-center">
          <button className="signin-btn" onClick={SignInWithGoogle}>
            Sign In with Google
          </button>
        </div>
      )}

      {/* Return to Home Page */}
      <div className="return-home mt-20 text-center">
        <a href="/" className="home-link">
          Return to Home Page
        </a>
      </div>
    </div>
  );
}
