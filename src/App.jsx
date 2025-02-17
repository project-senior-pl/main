import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

const BASE_URL = "https://cdn.contentful.com/spaces/";
const SPACE_ID = "pv6fp3qzvkxi";
const ACCESS_TOKEN = "HkDhJTPH2AqqwXUp_9P8wqcfsUrv2tnunIppuQOlssc";
const API_URL = `${BASE_URL}${SPACE_ID}/entries?access_token=${ACCESS_TOKEN}`;

function App() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();

        // Extract post data
        const postItem = result.items[0]; // Assuming only one post
        const title = postItem.fields.title;
        
        // Extract post body paragraphs
        const paragraphs = postItem.fields.postBody.content
          .filter(block => block.nodeType === "paragraph")
          .map(block => block.content.map(text => text.value).join(" "));

        // Extract asset file
        const assets = result.includes?.Asset?.map(asset => ({
          url: `https:${asset.fields.file.url}`,
          name: asset.fields.file.fileName
        })) || [];

        setPost({ title, paragraphs, assets });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {post && (
        <div className="post">
          <h2>{post.title}</h2>
          {post.paragraphs.map((para, index) => (
            <p key={index}>{para}</p>
          ))}
          {post.assets.length > 0 && (
            <div className="assets">
              <h3>Attachments:</h3>
              {post.assets.map((asset, index) => (
                <a key={index} href={asset.url} download target="_blank">
                  {asset.name}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default App;
