from flask import Flask, request, jsonify
from langchain_community.document_loaders import CSVLoader
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

# 1. Vectorize the sales response CSV data
loader = CSVLoader(file_path="salaries.csv")
documents = loader.load()

embeddings = OpenAIEmbeddings()
db = FAISS.from_documents(documents, embeddings)

# 2. Function for similarity search
def retrieve_info(query):
    similar_response = db.similarity_search(query, k=3)
    page_contents_array = [doc.page_content for doc in similar_response]
    return page_contents_array

llm = ChatOpenAI(temperature=0, model="gpt-4-turbo")

template = """
You are a data analyst specializing in machine learning engineer salaries. 
I will share a user's question with you, and you will provide the best insights based on historical salary data, 
following these guidelines:

1/ Your response should be data-driven and use relevant historical data from similar queries.
2/ If direct data is not available, use your best judgment to provide a logical and insightful response.
3/ Ensure the response is clear, concise, and professional.

User's question:
{user_question}

Historical data:
{best_practice}

Please provide the best response to the user's question:
"""

prompt = PromptTemplate(
    input_variables=["message", "best_practice"],
    template=template
)

chain = LLMChain(llm=llm, prompt=prompt)


# 4. Retrieval augmented generation
def generate_response(message):
    best_practice = retrieve_info(message)
    response = chain.run(message=message, best_practice=best_practice)
    return response


@app.route('/generate_response', methods=['POST'])
def generate_response_endpoint():
    data = request.json
    message = data.get('message')
    if not message:
        return jsonify({"error": "Message is required"}), 400
    response = generate_response(message)
    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(port=5000, debug=True)
