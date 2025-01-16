import "./App.css";
import CurrencyConvertor from "./components/currencyConverter";

function App() {
  return (
    <div className="min-h-screen bg-[#796254] flex flex-col items-center justify-center">
      <div className="container">
        <CurrencyConvertor />
      </div>
    </div>
  );
}

export default App;