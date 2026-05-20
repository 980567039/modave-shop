"use client";
import React, { useState } from "react";

export default function CustomerNote() {
  // State to manage the note input and file upload
  const [note, setNote] = useState("");
  const [fileName, setFileName] = useState("");

  // Handle note change
  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };

  // Handle file selection change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name); // Update the displayed file name
    }
  };

  return (
    <div className="tf-product-customer-note">
      <p className="mb_4">Add your personalization</p>
      <p className="mb_12 text-caption-1 text-secondary">
        Add your name, note, or upload your customized idea image to personalize
        your item.
      </p>
      <fieldset className="mb_8">
        <input
          type="text"
          placeholder="Customize Note"
          name="text"
          tabIndex={2}
          value={note} // Controlled input for personalization note
          onChange={handleNoteChange} // Update state on input change
          aria-required="true"
          required
        />
      </fieldset>
      <div className="tf-product-image-upload uploadfile">
        <label>
          <input
            type="file"
            name="file"
            onChange={handleFileChange} // Handle file selection change
          />
          <span className="filename text-secondary-2">
            {fileName ? fileName : "Upload image"}
          </span>
        </label>
      </div>
    </div>
  );
}
