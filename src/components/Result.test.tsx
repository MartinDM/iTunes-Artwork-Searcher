import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Result from "./Result";

describe("Result", () => {
  it("renders artwork and download links", () => {
    render(
      <Result
        result={{
          artistName: "Radiohead",
          collectionName: "OK Computer",
          artworkUrl100: "https://example.com/100x100bb.jpg",
        }}
      />,
    );

    expect(screen.getByRole("img", { name: "OK Computer" })).toHaveAttribute(
      "src",
      "https://example.com/270x270bb.jpg",
    );
    expect(screen.getByRole("link", { name: /Standard res/ })).toHaveAttribute(
      "href",
      "https://example.com/600x600bb.jpg",
    );
    expect(
      screen.getByRole("link", { name: /Highest res/ }),
    ).toHaveAttribute("href", "https://example.com/2000x2000bb.jpg");
  });

  it("shows the artist link when artwork is unavailable", () => {
    render(
      <Result
        result={{
          artistName: "Radiohead",
          artistLinkUrl: "https://music.apple.com/artist/radiohead",
        }}
      />,
    );

    expect(
      screen.getByRole("link", { name: /View artist on Apple Music/ }),
    ).toHaveAttribute(
      "href",
      "https://music.apple.com/artist/radiohead",
    );
  });
});
