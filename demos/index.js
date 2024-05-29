// Codice per generare dei Chunk da un PDF
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { ChromaClient, GoogleGenerativeAiEmbeddingFunction } from 'chromadb'

// Seleziona il PDF dal Fs
const loader = new PDFLoader("example_files/1.pdf");

// Carica il PDF
const docs = await loader.load();

// Crea lo splitter 
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 50,
    chunkOverlap: 5,
  });

// Splitta il PDF 
const output = await splitter.splitDocuments(docs)

// Crea un array con i chunks del PDF
const textChunks = output.map((item) => {return item.pageContent})

console.log(textChunks)

// Crea l'oggetto GoogleGenerativeAI (per chiamare l'AP)
const genAI = new GoogleGenerativeAI(/*process.env.API_KEY*/)

// Crea l'oggetto EmbedderGoogleGenerativeAI
const embedder = new GoogleGenerativeAiEmbeddingFunction({googleApiKey: /*process.env.API_KEY*/""})

// Crea il client Chroma
const client = new ChromaClient({
  path: /*process.env.CHROMA_PATH*/""
});

// Crea una collezione con gli embed del documento
const collection = await client.createCollection({name: "document", embeddingFunction: embedder})

// Cerca dei Risultati nel database
const results = await collection.query({
  queryTexts: [""],
  nResults: 2,
});

// Invia i documenti a GoogleGenerativeAi
const model = genAI.getGenerativeModel({model:"gemini-1.5-flash-latest"})

// Modello Chat con documento pre inserito
const chat = model.startChat({
  history: [
    {
      role: "user",
      parts: [{ text: `Ciao google devi sapere tutto di questo documento ${results.documents.map((doc) => {return doc})}` }],
    },
  ],
  generationConfig: {
    maxOutputTokens: 100,
  },
});

const msg = "Question about document";

// Invia il messaggio alla chat
const result = await chat.sendMessage(msg);

// Il bot risponde
const response = result.response;
const text = response.text();
console.log(text);