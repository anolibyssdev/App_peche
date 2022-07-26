import { useState } from "react";
import axios from "@services/axios";

function CreateCardOverviewAdmin({ setPhotos }) {
  const [containt, setContaint] = useState("");
  const [file, setFile] = useState("");
  const [fileOverview, setFileOverview] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFileOverview(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      return alert("An image is required for the upload");
    }
    if (!containt) {
      return alert("At least one fields is empty");
    }
    const photo = {
      description: containt,
    };
    const formData = new FormData();
    formData.append("Image", file);
    formData.append("photo", JSON.stringify(photo));
    try {
      await axios.post("photo_poisson", formData);
      // setNewProductDetail(result.data);
      await axios.get("phot_poisson").then((result) => setPhotos(result.data));
      setContaint("");
      setFile("");
      setFileOverview(null);
      document.getElementById("file").value = null;
      return alert("Image uploaded in the server");
    } catch (err) {
      console.error(err);
      return alert(
        "A connection error has occured with the server ! Try later !"
      );
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {" "}
        <label htmlFor="containt">
          Description
          <input
            type="text"
            placeholder="Brève description de votre image..."
            id="containt"
            value={containt}
            onChange={(e) => setContaint(e.target.value)}
          />
        </label>
        <label htmlFor="file">
          Select an image
          <input type="file" id="file" onChange={(e) => handleFileChange(e)} />
        </label>
        <button type="submit">Create Image</button>
      </form>
      {fileOverview != null ? <img src={fileOverview} alt="preview" /> : " "}
    </div>
  );
}

export default CreateCardOverviewAdmin;
