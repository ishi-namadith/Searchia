# Searchia - AI-Powered Product Search and Comparison Engine

> An advanced web platform that simplifies online shopping by aggregating product data from multiple e-commerce sites and providing AI-powered review analysis.

**Developed as part of BSc (Hons) Computer Science program at Plymouth University**

## 🚀 Features

- **🔍 Cross-platform Product Search**: Search for products across multiple e-commerce platforms simultaneously
- **🤖 AI Review Summarization**: Get concise summaries of customer reviews highlighting pros and cons
- **⚖️ Smart Comparison Tools**: Compare products based on price, ratings, and review sentiment
- **🎨 User-friendly Interface**: Clean, responsive design with intuitive navigation
- **⚡ Real-time Data**: Up-to-date product information fetched through advanced web scraping

## 🛠️ Technology Stack

### Frontend
- **React.js** with TypeScript
- **Tailwind CSS** for styling
- **Zustand** for state management
- **Axios** for API communication

### Backend
- **Python** with Flask
- **Web scraping** with Crawl4AI and Playwright
- **AI analysis** with LLaMA 3.2 and LangChain
- **MongoDB** for review storage

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or above)
- [Python](https://www.python.org/) 3.10+
- [Ollama](https://ollama.ai/) (for LLaMA 3.2)
- [MongoDB](https://www.mongodb.com/)

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/ishi-namadith/Searchia.git
cd Searchia
```

### 2. Set up the AI model

```bash
# Install Ollama (follow instructions from https://ollama.ai/)

# Download LLaMA 3.2
ollama pull llama3:3b

# Run Ollama server
ollama serve
```

### 3. Backend setup

```bash
cd Searchia-backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
python app.py

#if scrappers fail change the ScrapeOPS API key by generating a new one cuz of the limitations in free trial
```

### 4. Frontend setup

```bash
cd Searchia-frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

### 5. Access the application

Open your browser and navigate to `http://localhost:5173`

## 📖 Usage

1. **Search Products**: Enter a product name in the search bar (e.g., "wireless mouse")
2. **Browse Results**: View products from multiple e-commerce platforms
3. **Product Details**: Click on products to:
   - View detailed information
   - See AI-summarized reviews
   - Add to comparison cart
4. **Compare Products**: Use the comparison cart to compare selected products side-by-side

## 📁 Project Structure

```
Searchia/
├── Searchia-backend/       # Backend API and scraping logic
│   ├── app.py             # Main Flask application
│   ├── requirements.txt   # Python dependencies
│   └── ...
├── Searchia-frontend/      # React frontend application
│   ├── src/              # Source code
│   ├── package.json      # Node.js dependencies
│   └── ...
├── docs/                  # Project documentation
├── .gitignore
├── LICENSE
└── README.md
```

## 🔮 Future Improvements

- [ ] Support for more e-commerce platforms worldwide
- [ ] Integration with cloud-based LLMs for better review analysis
- [ ] Performance optimization and caching mechanisms
- [ ] Advanced filtering and personalization options
- [ ] Mobile application development
- [ ] User authentication and personalized recommendations

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Special thanks to:

- **Prof. Chaminda Wijesinghe** for supervision and guidance
- **Plymouth University** for providing resources and support
- **Fellow students** for testing and valuable feedback
- The open-source community for the amazing tools and libraries

## 📞 Contact

**Project Developer**: Ishira Namadith
- Email: namadithishira@gmail.com
- LinkedIn: www.linkedin.com/in/ishira-namadith
- GitHub: [@ishi-namadith](https://github.com/ishi-namadith)

**Project Link**: [https://github.com/ishi-namadith/Searchia](https://github.com/ishi-namadith/Searchia)

---

<p align="center">
  Made with ❤️ for BSc (Hons) Computer Science at Plymouth University
</p>
