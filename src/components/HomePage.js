import React from "react";
import { Button } from "react-bootstrap";
import wallpaper from "../images/LeagueBackground.png";

export default function HomePage() {
  return (
    <div className="d-flex align-items-center justify-content-center">
      <img style={{ height: "90vh" }} src={wallpaper} alt="LoL background" />
      <Button>Sign Up</Button>
    </div>
  );
}
