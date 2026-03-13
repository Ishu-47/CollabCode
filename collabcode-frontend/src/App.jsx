import Home from "./pages/Home";
import Room from "./pages/Room";

function App() {

  const path = window.location.pathname;

  if (path.startsWith("/room")) {
    return <Room />;
  }

  return <Home />;
}

export default App;