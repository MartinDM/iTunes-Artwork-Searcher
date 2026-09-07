import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";

describe("App", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("requires a search type before enabling the search field", () => {
    render(<App />);

    const input = screen.getByPlaceholderText("Select what to find");
    const button = screen.getByRole("button", { name: "Find artwork" });

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "album" },
    });

    expect(screen.getByPlaceholderText("Album name")).toBeEnabled();
  });

  it("searches iTunes after selecting a type and entering a term", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => ({
        resultCount: 1,
        results: [
          {
            artistName: "Radiohead",
            collectionName: "OK Computer",
            artworkUrl100: "https://example.com/100x100bb.jpg",
            collectionId: 1,
          },
        ],
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<App />);
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "album" },
    });
    fireEvent.change(screen.getByPlaceholderText("Album name"), {
      target: { value: "Radiohead" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Find artwork" }));

    await waitFor(() => {
      expect(screen.getByText("Displaying 1 results")).toBeInTheDocument();
    });
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("entity=album"),
    );
    expect(screen.getByText("Radiohead")).toBeInTheDocument();
  });
});
