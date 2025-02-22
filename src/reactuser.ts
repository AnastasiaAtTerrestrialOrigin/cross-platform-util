import { useState, useEffect } from "react";

export const useYourFace = () => {
  const [face, setFace] = useState<string>("");

  useEffect(() => {
    setFace("👀");
    console.log(face);
  }, []);
};