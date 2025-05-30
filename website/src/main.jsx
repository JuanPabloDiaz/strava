import { render } from "preact";
import { App } from "./app";
import Layout from "./components/Layout";
import "./style.css";

render(
  <Layout>
    <App />
  </Layout>,
  document.getElementById("app")
);
