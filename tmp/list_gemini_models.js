const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = "AIzaSyBbA3Qnyz4XoeqgEKv3r05Yu1LhyyXHJpQ";
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
  try {
    const list = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await list.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();
