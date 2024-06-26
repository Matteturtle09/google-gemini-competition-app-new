import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import {
    ChatPromptTemplate,
    MessagesPlaceholder,
} from "@langchain/core/prompts";
import {
    RunnablePassthrough,
    RunnableSequence,
} from "@langchain/core/runnables";
import { formatDocumentsAsString } from "langchain/util/document";
import { StringOutputParser } from "@langchain/core/output_parsers";




// Initialize PDFLoader with the path to your PDF file
const loader = new PDFLoader("/workspace/google-gemini-competition-app-new/demos/example_files/1.pdf");

// Load documents from the PDF file
const docs = await loader.load();

// Initialize the ChatGoogleGenerativeAI model with your configuration
const model = new ChatGoogleGenerativeAI({
    model: "gemini-pro",
    apiKey: "AIzaSyCUa5wUwsx7A1gZixVzl0bGn2CwwT_kDTI",
    maxOutputTokens: 2048,
    safetySettings: [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
    ],
});

// Set up the Chroma vector store with your documents and embeddings configuration
const vectorStore = await Chroma.fromDocuments(docs, new GoogleGenerativeAIEmbeddings({
    model: "embedding-001",
    apiKey: "AIzaSyCUa5wUwsx7A1gZixVzl0bGn2CwwT_kDTI"
}), {
    collectionName: "testcollection",
    url: "http://129.152.1.167:8004",
    collectionMetadata: {
        "hnsw:space": "cosine",
    },
});
const contextualizeQSystemPrompt = `Given a chat history and the latest user question
which might reference context in the chat history, formulate a standalone question
which can be understood without the chat history. Do NOT answer the question,
just reformulate it if needed and otherwise return it as is.`;

const contextualizeQPrompt = ChatPromptTemplate.fromMessages([
    ["system", contextualizeQSystemPrompt],
    new MessagesPlaceholder("chat_history"),
    ["human", "{question}"],
]);
const contextualizeQChain = contextualizeQPrompt
    .pipe(model)
    .pipe(new StringOutputParser());
// Define the QA system prompt
const qaSystemPrompt = `You are an assistant for question-answering tasks.
Use the following pieces of retrieved context to answer the question.
If you don't know the answer, just say that you don't know.
Use three sentences maximum and keep the answer concise.

{context}`;

// Create the QA prompt template
const qaPrompt = ChatPromptTemplate.fromMessages([
    ["system", qaSystemPrompt],
    new MessagesPlaceholder("chat_history"),
    ["human", "{question}"],
]);

// Function to contextualize questions based on chat history
const contextualizedQuestion = (input) => {
    if ("chat_history" in input) {
        return contextualizeQChain; // Ensure you define or import contextualizeQChain appropriately
    }
    return input.question;
};

// Initialize chatHistory as an empty array
let chat_history = [];

// Define the runnable sequence
const ragChain = RunnableSequence.from([
    RunnablePassthrough.assign({
        context: (input) => {
            if ("chat_history" in input) {
                const chain = contextualizedQuestion(input);
                return chain.pipe(vectorStore.asRetriever()).pipe(formatDocumentsAsString);
            }
            return "";
        },
    }),
    qaPrompt,
    model,
]);

// Invoke the chain with a question and chat history
const aiMsg = await ragChain.invoke({
    question: "What is the document about?",
    chat_history // Pass chat_history here
});

// Update chatHistory with the new interaction
chat_history = chat_history.concat(aiMsg);

// Note: You may need to adjust the structure of chatHistory and the way you handle contextualizeQChain based on your specific requirements.
console.log(aiMsg)
