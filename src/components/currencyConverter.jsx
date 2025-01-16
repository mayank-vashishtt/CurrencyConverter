import { useEffect } from "react";
import { useState } from "react";
import CurrencyDropdown from "./dropdown";
import { HiArrowsRightLeft } from "react-icons/hi2";

const CurrencyConverter = () => {
  const [currencies, setCurrencies] = useState([]);
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [converting, setConverting] = useState(false);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || ["INR", "EUR"]
  );

  const fetchCurrencies = async () => {
    try {
      const res = await fetch("https://api.frankfurter.app/currencies");
      const data = await res.json();
      setCurrencies(Object.keys(data));
    } catch (error) {
      console.error("Error Fetching", error);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const convertCurrency = async () => {
    if (!amount) return;
    setConverting(true);
    try {
      const res = await fetch(
        `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
      );
      const data = await res.json();
      setConvertedAmount(data.rates[toCurrency] + " " + toCurrency);
    } catch (error) {
      console.error("Error Fetching", error);
    } finally {
      setConverting(false);
    }
  };

  const handleFavorite = (currency) => {
    let updatedFavorites = [...favorites];

    if (favorites.includes(currency)) {
      updatedFavorites = updatedFavorites.filter((fav) => fav !== currency);
    } else {
      updatedFavorites.push(currency);
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="max-w-3xl mx-auto my-10 p-8 bg-[#FCF3E3] from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-lg">
      <h2 className="text-4xl font-semibold text-black bold mb-6 text-center drop-shadow-lg">
      Currency Converter
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
        <CurrencyDropdown
          favorites={favorites}
          currencies={currencies}
          title="From:"
          currency={fromCurrency}
          setCurrency={setFromCurrency}
          handleFavorite={handleFavorite}
        />
        {/* Swap Currency Button */}
        <div className="flex justify-center">
          <button
            onClick={swapCurrencies}
            className="p-4 bg-white bg-opacity-20 backdrop-blur-md rounded-full shadow-lg hover:bg-opacity-30 transition duration-300"
          >
            <HiArrowsRightLeft className="text-2xl text-black" />
          </button>
        </div>
        <CurrencyDropdown
          favorites={favorites}
          currencies={currencies}
          title="To:"
          currency={toCurrency}
          setCurrency={setToCurrency}
          handleFavorite={handleFavorite}
        />
      </div>

      <div className="mt-8">
        <label htmlFor="amount" className="block text-lg font-medium text-black">
          Amount:
        </label>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          className="w-full p-4 bg-black bg-opacity-20 backdrop-blur-md border border-transparent rounded-lg shadow-md focus:ring-2 focus:ring-indigo-600 text-black mt-2"
        />
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={convertCurrency}
          className={`px-6 py-3 bg-indigo-600 text-white rounded-full shadow-xl hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 ${
            converting ? "animate-pulse" : ""
          }`}
        >
          Convert
        </button>
      </div>

      {convertedAmount && (
        <div className="mt-6 text-2xl font-semibold text-center text-green-400">
          Converted Amount: {convertedAmount}
          <br />
          Made by Mayank
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;
