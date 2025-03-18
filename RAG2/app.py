from langchain_ollama import OllamaLLM
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain.vectorstores import Chroma
from langchain_ollama import OllamaEmbeddings

def summerizer(results):
    llm = OllamaLLM(model="llama3.2", temperature=0.8)
    prompt_template_name = PromptTemplate(
        input_variables=["results"],
        template="Summarize the following user feedbacks and give me the overall idea of what the users are saying about this product: {results}",
    )
    chain = LLMChain(llm=llm, prompt=prompt_template_name)
    
    return chain.invoke({"results": results})

# Function to retrieve and summarize feedback for a specific product ID
def analyze_feedback_for_product(product_id, persist_directory="./chroma_db"):

    embeddings = OllamaEmbeddings(model="llama3.2")
    vector_store = Chroma(persist_directory=persist_directory, embedding_function=embeddings)
    
    retrieved_docs = vector_store.similarity_search(query=product_id, k=10)  

    combined_feedback = " ".join([doc.page_content for doc in retrieved_docs])
    
    summary = summerizer(combined_feedback)
    
    return summary

if __name__ == "__main__":
    product_id = "12345"  

    summary = analyze_feedback_for_product(product_id)
    
    print(f"Summary of feedback for product {product_id}:")
    print(summary)