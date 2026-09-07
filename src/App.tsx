import {
  Box,
  Button,
  Center,
  Container,
  Heading,
  Input,
  Select,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import Result, { TResult } from "./components/Result";

enum entityTypes {
  Album = "album",
  Track = "musicTrack",
  Artist = "musicArtist",
}

type DeezerArtistSearchResponse = {
  data?: Array<{ picture_xl?: string }>;
};

let deezerCallbackId = 0;

const getDeezerArtistImage = (artistName: string): Promise<string | undefined> =>
  new Promise((resolve, reject) => {
    const callbackName = `deezerCallback${deezerCallbackId++}`;
    const script = document.createElement("script");
    const globalWindow = window as unknown as Record<string, unknown>;

    const cleanup = () => {
      delete globalWindow[callbackName];
      script.remove();
    };

    globalWindow[callbackName] = (data: DeezerArtistSearchResponse) => {
      cleanup();
      resolve(data.data?.[0]?.picture_xl);
    };
    script.onerror = () => {
      cleanup();
      reject(new Error("Deezer artist lookup failed"));
    };

    const params = new URLSearchParams({
      q: artistName,
      limit: "1",
      output: "jsonp",
      callback: `window.${callbackName}`,
    });
    script.src = `https://api.deezer.com/search/artist?${params.toString()}`;
    document.body.appendChild(script);
  });

function App() {
  const [results, setResults] = useState<TResult[] | null>(null);
  const [type, setType] = useState<entityTypes | "">("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [term, setTerm] = useState<string>();
  const [searchingFor, setSearchingFor] = useState<string>("Album");
  const [resultCount, setResultCount] = useState<number | null>(null);

  useEffect(() => {
    switch (type) {
      case "musicTrack":
        setSearchingFor("Track");
        break;
      case "musicArtist":
        setSearchingFor("Artist");
        break;
      case "album":
        setSearchingFor("Album");
        break;
      default:
        setSearchingFor("");
    }
  }, [type]);

  const handleChange = (e: React.FormEvent<HTMLSelectElement>) => {
    setType((e.target as HTMLInputElement).value as entityTypes | "");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === "Enter" && term) {
      getArtwork();
    }
  };

  const getArtwork = () => {
    if (!term || !type) return;
    setIsSearching(true);
    const searchParams = new URLSearchParams({
      term,
      country: "gb",
      entity: type,
      limit: "20",
    });

    fetch(`https://itunes.apple.com/search?${searchParams.toString()}`)
      .then((response) => response.json())
      .then(async (data) => {
        let nextResults = data.results as TResult[];

        if (type === entityTypes.Artist) {
          nextResults = await Promise.all(
            nextResults.map(async (artist) => {
              try {
                return {
                  ...artist,
                  artworkUrl100: await getDeezerArtistImage(artist.artistName),
                };
              } catch {
                return artist;
              }
            }),
          );
        }

        setResultCount(data.resultCount);
        setResults(nextResults);
      })
      .finally(() => setIsSearching(false))
      .catch(() => {
        setIsSearching(false);
      });
  };

  return (
    <>
      <Box
        bg='gray.800'
        className='header'
        sx={{ letterSpacing: "-1px" }}
        pb={6}
        pt={1}
      >
        <Container maxW='960px' bg='gray.800' color='white'>
          <Heading
            sx={{ textTransform: "lowercase" }}
            fontWeight='lighter'
            as='h1'
            size='lg'
            noOfLines={1}
          >
            Apple music
          </Heading>
          <Heading mt={-2} pl={2} as='h2' size='xl' noOfLines={1}>
            Artwork Searcher
          </Heading>
        </Container>
      </Box>
      <Container py={4} maxW='900px'>
        <SimpleGrid columns={[1, 2]} spacing='20px'>
          <Box py={4} w={"70%"}>
            <Select
              value={type}
              onChange={(e) => handleChange(e)}
              placeholder='Looking for:'
            >
              <option value='album'>Album</option>
              <option value='musicTrack'>Track</option>
              <option value='musicArtist'>Artist</option>
            </Select>
          </Box>
          <Box py={4} w={"70%"}>
            <Input
              variant='outline'
              placeholder={type ? `${searchingFor} name` : "Select what to find"}
              isDisabled={!type}
              onChange={(e) => setTerm(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e)}
            />
          </Box>
        </SimpleGrid>
        <Button onClick={getArtwork} colorScheme='blue' isDisabled={!type || !term}>
          Find artwork
        </Button>
      </Container>
      <Container maxW='900px' mb={6}>
        {results && (
          <Text py={3} pb={5} fontSize='lg' color='white'>
            {results.length > 0
              ? `Displaying ${resultCount} results`
              : "No results"}
          </Text>
        )}

        <SimpleGrid columns={[1, 2, 3]} spacing='40px'>
          {results &&
            results.map((r: TResult) => {
              return (
                <Result
                  result={r}
                  key={r.trackId ?? r.collectionId ?? r.artistId}
                />
              );
            })}
        </SimpleGrid>
        {isSearching && (
          <Center className='loading'>
            <AiOutlineLoading />
          </Center>
        )}
      </Container>
      <Text
        color='white'
        py={6}
        sx={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "rgba(52,52,52,.4)",
        }}
      >
        A project crafted by Martin ✌️ | &nbsp;
        <a href='https://github.com/MartinDM/iTunes-Artwork-Searcher'>
          View on GitHub
        </a>
      </Text>
    </>
  );
}

export default App;
