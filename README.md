```markdown
# Summify - Web Page Summarizer  

Summify is a Chrome extension that lets you summarize any web page you visit. It uses Chrome's built-in summarization and translation APIs to provide summaries in your chosen format and language.  

## Features  
- Summarizes web pages directly in the browser without requiring server-side calls.  
- Multi-language support using Chrome's translation API.  
- Simple and intuitive interface for seamless usage.  

---

## Getting Started  

### Git Clone This Repo  

```bash  
git clone https://github.com/ketyung/summify-web-summarizer  
cd summify-web-summarizer  
```  

---

### Build Instructions  

Run the following commands to build the project:  

```bash  
yarn build  
yarn build:css  
```  

---

### Load the Extension in Chrome  

1. Open **Chrome** or **Chrome Canary**.  
2. Go to `chrome://extensions/`.  
3. Enable **Developer mode** using the toggle at the top right.  
4. Click **Load unpacked** and select the folder where the repository is cloned and built (`summify-web-summarizer/build`).  
5. The extension should now appear in your list of installed extensions.  

---

### Usage  

1. Once installed, you'll see the **Summarize** button appear on the top right corner of web pages.  
2. Click the button to open a popup window and choose your preferred summary type and language.  
3. Enjoy concise, translated summaries for any web page you visit!  

---

## Contributing  

Feel free to fork the repository, submit issues, or suggest new features. Contributions are always welcome!  

---

## License  

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.  

---

## Built For Devpost Hackathon 
https://devpost.com/software/summify-a-web-page-summarizer

Happy Summarizing!  
```  
