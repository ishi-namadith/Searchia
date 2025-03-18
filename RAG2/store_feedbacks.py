import json
from langchain.vectorstores import Chroma
from langchain.docstore.document import Document
from langchain_ollama import OllamaEmbeddings

# Function to load JSON data and store it in Chroma DB
def load_and_store_feedback(json_file_path, persist_directory="./chroma_db"):
    with open(json_file_path, 'r') as file:
        feedback_data = json.load(file)
    
    documents = []
    for product_id, feedbacks in feedback_data.items():
        for feedback in feedbacks:
            doc = Document(page_content=feedback, metadata={"product_id": product_id})
            documents.append(doc)
    
    embeddings = OllamaEmbeddings(model="llama3.2")
    vector_store = Chroma.from_documents(documents, embeddings, persist_directory=persist_directory)
    
    print(f"Feedback data has been stored in Chroma DB at '{persist_directory}'.")
    return vector_store

if __name__ == "__main__":
    json_file_path = "feedback_data.json"
    
    load_and_store_feedback(json_file_path)