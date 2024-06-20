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

const loader = new PDFLoader("/workspaces/google-gemini-competition-app-new/demos/example_files/1.pdf");

const docs = await loader.load();

const model = new ChatGoogleGenerativeAI({
    model: "gemini-flash",
    maxOutputTokens: 2048,
    safetySettings: [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
    ],
});

const vectorStore = await Chroma.fromDocuments(docs, new GoogleGenerativeAIEmbeddings({ model: "embedding-001" }), {
    collectionName: "testcollection",
    url: "http://129.152.1.167:8004/", // Optional, will default to this value
    collectionMetadata: {
        "hnsw:space": "cosine",
    },
});

const qaSystemPrompt = `You are an assistant for question-answering tasks.
Use the following pieces of retrieved context to answer the question.
If you don't know the answer, just say that you don't know.
Use three sentences maximum and keep the answer concise.

{context}`;

const qaPrompt = ChatPromptTemplate.fromMessages([
    ["system", qaSystemPrompt],
    new MessagesPlaceholder("chat_history"),
    ["human", "{question}"],
]);

const contextualizedQuestion = (input) => {
    if ("chat_history" in input) {
        return contextualizeQChain;
    }
    return input.question;
};

let chatHistory = [];

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

const aiMsg = await ragChain.invoke({question: "What about the document?", chatHistory})
chatHistory = chatHistory.concat(aiMsg);
