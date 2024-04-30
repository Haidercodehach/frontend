"use client";
import React, { useState, useEffect } from "react";
import { sendTextToDjango } from "../utils/api"; // Assuming this is a function
import axios from "axios";

interface TextData {
  text: string;
}
const Upload: React.FC = () => {
  const [rdata, setData] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [ret, setRet] = useState<string | null>(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [isLoadingText, setIsLoadingText] = useState(false);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsLoadingFile(true); // Set loading state before fetch

    try {
      const response = await fetch("http://localhost:8000/api/upload/", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const data = await response.text();
        setData(data);
        alert("File upload success ");
      } else {
        alert("File upload failed");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while uploading the file.");
    } finally {
      setIsLoadingFile(false); // Reset loading state after fetch
    }
  };

  // const handleTextSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   const data: TextData = { text };

  //   setIsLoadingText(true); // Set loading state before fetch

  //   try {
  //     const response = await axios.post<TextData>(
  //       "http://localhost:8000/api/receive-data/",
  //       data
  //     );
  //     setRet(response.data);
  //     console.log("Upload successful:", response.data);
  //   } catch (error) {
  //     console.error("Upload failed:", error);
  //   } finally {
  //     setIsLoadingText(false); // Reset loading state after fetch
  //   }
  // };
  const handleTextSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const enter = text + rdata;
    setText(enter);
    const data: TextData = { text };
    setIsLoadingText(true); // Set loading state before fetch

    try {
      const response = await fetch("http://localhost:8000/api/receive-data/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Indicate JSON data
        },
        body: JSON.stringify(data), // Stringify data object to JSON
      });

      if (response.ok) {
        const responseData = await response.text();
        setRet(responseData);
        console.log("Upload successful:", responseData);
      } else {
        console.error("Upload failed:", await response.text());
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsLoadingText(false); // Reset loading state after fetch
    }
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <span className="text-blue-500 hover:underline">Select File</span>
        </label>
        <button
          type="submit"
          disabled={isLoadingFile}
          className={`py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded disabled:opacity-50 ${
            isLoadingFile ? "cursor-wait" : ""
          }`}
        >
          {isLoadingFile ? "Uploading..." : "Upload"}
        </button>
      </form>
      <p className="text-gray-700">{rdata}</p>
      <form onSubmit={handleTextSubmit} className="flex flex-col space-y-4">
        <input
          type="text"
          name="textInput"
          onChange={(e) => setText(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        />
        <button
          type="submit"
          disabled={isLoadingText}
          className={`py-2 px-4 bg-green-500 hover:bg-green-700 text-white font-bold rounded disabled:opacity-50 ${
            isLoadingText ? "cursor-wait" : ""
          }`}
        >
          {isLoadingText ? "Sending..." : "Send to Django"}
        </button>
      </form>
      <p>{ret}</p>
    </div>
  );
};
export default Upload;
