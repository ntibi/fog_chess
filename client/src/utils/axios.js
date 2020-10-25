import Axios from "axios";
import config from "../../../config";
import { makeUseAxios } from "axios-hooks";

const { server: { url } } = config;

const axios = Axios.create({
  baseURL: url,
  withCredentials: true, // only if env == DEVELOPMENT
});

const useAxios = makeUseAxios({ axios });

export {
  useAxios,
  axios,
};