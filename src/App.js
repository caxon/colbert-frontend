import logo from "./logo.svg";
import "./App.css";

import * as axios from "axios";
import * as querystring from "querystring";

import styled from "@emotion/styled";

import { Helmet } from "react-helmet";

import { Formik } from "formik";
import { useState } from "react";

const Button = styled.div`
  display: inline-block;
  width: 90px;
  height: 30px;
  line-height: 30px;
  border-radius: 8px;
  background-color: #565656;
  color: white;
  font-weight: bold;
  font-size: 12pt;
  cursor: pointer;
  margin: 0 20px 0 20px;
`;

const InfoArea = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const InfoBox = styled.div`
  border: 1px solid grey;
  border-radius: 4px;
  margin: 10px;
  padding: 10px 30px 10px 30px;
  width: 40%;
  min-width: 300px;
`;

const fetchQuery = async (query) => {
  const response = await axios.post(
    "http://colbert-hack.duckdns.org:8000/query?" +
      querystring.stringify({ query: query })
  );

  return response.data.matches;
};

const App = ({ ...props }) => {
  const [results, setResults] = useState([]);

  const handleSubmit = async (s) => {
    console.log(`You submitted ${JSON.stringify(s, null, 2)}`);
    const data = await fetchQuery(s.query);
    setResults(data);
    console.log("FETCHED", data);
  };

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>ColBERT Hack</title>
      </Helmet>
      <h1>ColBERT Hack</h1>
      <div>
        <Formik initialValues={{ query: "" }} onSubmit={handleSubmit}>
          {(formik) => {
            return (
              <form
                style={{
                  margin: "30px",
                }}
                onSubmit={formik.handleSubmit}
              >
                <label
                  htmlFor="query"
                  style={{
                    fontSize: "14pt",
                  }}
                >
                  Enter your search query{" "}
                </label>
                <input
                  style={{
                    fontSize: "12pt",
                  }}
                  id="query"
                  type="text"
                  {...formik.getFieldProps("query")}
                />
                <Button onClick={(e) => formik.handleSubmit()}>Search!</Button>
              </form>
            );
          }}
        </Formik>
      </div>
      <InfoArea>
        {results ? (
          results.map((x, idx) => {
            const content = x[0];
            const score = x[1];

            return (
              <InfoBox key={idx}>
                <p>{content}</p>
                <p style={{ fontWeight: "bold" }}>SCORE: {score}</p>
              </InfoBox>
            );
          })
        ) : (
          <div> Nothing here... search for something new </div>
        )}
      </InfoArea>
    </div>
  );
};

export default App;
