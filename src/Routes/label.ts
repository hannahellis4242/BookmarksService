import { Router } from "express";
import LabelService from "../Service/LabelService";


const label = (service: LabelService) =>
  Router()

export default label;
