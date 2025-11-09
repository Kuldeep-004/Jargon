import Routes from "./components/Routes";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <div className="bg-[#333333] text-amber-50 flex min-h-screen flex-col">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            fontSize: "12px",
            borderRadius: "5px",
            padding:"2px 7px",
          },
        }}
      />
      <Routes />
    </div>
  );
};

export default App;
