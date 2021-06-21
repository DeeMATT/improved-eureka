import axios from "axios";
import FormData from "form-data";

export const getFile = async (url) => {
  try {
    const { data } = await axios.get(url, {
      responseType: "arraybuffer",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const deployFile = async (domain, payload) => {
  const formData = new FormData();

  formData.append("template_files", payload, "out.zip");

  domain = domain.replace(/[.,\s]/g, "_");

  try {
    const { data } = await axios.post(
      `https://templates.lolafinance.com/api/upload-template/${domain}`,
      formData,
      {
        headers: formData.getHeaders(),
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};
