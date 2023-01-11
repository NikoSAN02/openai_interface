import { makeStyles } from "@material-ui/core";
import HomePage from "./HomePage";
import MyAssets from "./MyAssets";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Header";

const useStyles = makeStyles(() => ({
  App: {
    backgroundColor: "#2c0021",
    color: "white",
    minHeight: "100vh",
  },
}));

function App() {
  const classes = useStyles();

  return (
    <BrowserRouter>
       <Header/>
      <div className={classes.App}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dalle-playground" element={<HomePage />} />
          <Route path="/HomePage" element={<HomePage />} />
          <Route path="/MyAssets" element={<MyAssets />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
