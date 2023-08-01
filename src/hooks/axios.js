import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../configs/constant";

const Axios = ({ endpoint, method, headers, data }) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const url = `${API}/${endpoint}`;

  useEffect(() => {
    axios
      .request({ url, method, headers, data })
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [url, method, headers, data]);

  return { response, error, isLoading };
};

export default Axios;
