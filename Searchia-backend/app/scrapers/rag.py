from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama import OllamaLLM
import json

model = OllamaLLM(model="llama3.2:latest")

def review_summarize(reviews):
    template = """
    Below are customer reviews:

    {reviews}

    Please analyze these reviews and provide a summary of both positive and negative aspects.
    Return your analysis in JSON format with two keys like the following:
    {{
        "positive_reviews": "<summary of the positive reviews in one paragraph>",
        "negative_reviews": "<summary of the negative reviews in one paragraph>"
    }}

    Return ONLY the JSON object without any additional text or markdown formatting.
    """

    prompt = ChatPromptTemplate.from_template(template)
    
    if isinstance(reviews, list):
        reviews_text = json.dumps(reviews, indent=2)
    else:
        reviews_text = reviews
    
    chain = prompt | model
    
    response = chain.invoke({"reviews": reviews_text})
    
    try:
        start_idx = response.find('{')
        end_idx = response.rfind('}') + 1
        if start_idx != -1 and end_idx != -1:
            json_str = response[start_idx:end_idx]
            return json.loads(json_str)
        else:
            return {"error": "No JSON found in response", "raw_response": response}
    except json.JSONDecodeError:
        return {"error": "Failed to parse response as JSON", "raw_response": response}
    except Exception as e:
        return {"error": str(e), "raw_response": response}

def compare_products(data):
    template = """
    Below are different product details for different products:

    {data}

    Please analyze these and provide a concise recommendation for the best product, considering price, reviews, and ratings.

    DO NOT return anything in JSON or code blocks. Just give a clear and clean natural language summary, suitable for displaying in a UI. Avoid any markdown, quotes, or formatting. Keep it readable and professional.
    """


    prompt = ChatPromptTemplate.from_template(template)
    
    if isinstance(data, list):
        products_text = json.dumps(data, indent=2)
    else:
        products_text = data
    
    chain = prompt | model
    response = chain.invoke({"data": products_text})
    
    try:
        structured = json.loads(response)
    except Exception:
        structured = {"raw": response}  # fallback in case parsing fails
    
    return {"analysis": structured}

