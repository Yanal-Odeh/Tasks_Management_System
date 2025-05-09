import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App min-h-screen bg-gray-100 flex items-center justify-center">
      <header className="App-header text-center">
        <img src={logo} className="App-logo h-32 w-32 mb-4" alt="logo" />
        <p className="text-xl font-semibold text-gray-700 mb-4">
          Edit <code className="bg-gray-200 px-2 py-1 rounded">src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link text-blue-500 hover:text-blue-700"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;