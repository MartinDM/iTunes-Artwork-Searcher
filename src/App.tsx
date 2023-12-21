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
}

function App() {
  const [results, setResults] = useState<TResult[] | null>(null);
  const [type, setType] = useState<entityTypes>(entityTypes.Album);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [term, setTerm] = useState<string>();
  const [searchingFor, setSearchingFor] = useState<string>("Album");
  const [resultCount, setResultCount] = useState<number | null>(null);

  useEffect(() => {
    switch (type) {
      case "musicTrack":
        setSearchingFor("Track");
        break;
      case "album":
        setSearchingFor("Album");
        break;
      default:
        setSearchingFor("Album");
    }
  }, [type]);

  const handleChange = (e: React.FormEvent<HTMLSelectElement>) => {
    setType((e.target as HTMLInputElement).value as entityTypes);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === "Enter") {
      setResults([]);
      getArtwork();
    }
  };

  const getArtwork = () => {
    setIsSearching(true);
    fetch(
      `https://itunes.apple.com/search?term=${term}&country=gb&entity=${type}&limit=20`
    )
      .then((response) => response.json())
      .then((data) => {
        setResultCount(data.resultCount);
        setResults(data.results as TResult[]);
      })
      .finally(() => setIsSearching(false))
      .catch(() => {
        setIsSearching(false);
      });
  };

  return (
    <>
      <Box sx={{ letterSpacing: "-1px" }} bg='gray.800' pb={6} pt={1}>
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
        <SimpleGrid columns={2} spacing='40px'>
          <Box py={4} w={"70%"}>
            <Select
              value={type}
              onChange={(e) => handleChange(e)}
              placeholder='Looking for:'
            >
              <option value='album'>Album</option>
              <option value='musicTrack'>Track</option>
            </Select>
          </Box>
          <Box py={4} w={"70%"}>
            <Input
              variant='outline'
              placeholder={`${searchingFor} name`}
              onChange={(e) => setTerm(e.target.value.replace(" ", "+"))}
              onKeyDown={(e) => handleKeyDown(e)}
            />
          </Box>
        </SimpleGrid>
        <Button onClick={getArtwork} colorScheme='blue'>
          Find artwork
        </Button>
      </Container>
      <Container maxW='900px' mb={6}>
        {results && (
          <Text py={3} fontSize='lg'>
            {results.length > 0
              ? `Displaying ${resultCount} results`
              : "No results"}
          </Text>
        )}

        <SimpleGrid columns={[2, null, 3]} spacing='40px'>
          {results &&
            results.map((r: TResult) => {
              return <Result result={r} />;
            })}
        </SimpleGrid>
        {isSearching && (
          <Center className='loading'>
            <AiOutlineLoading />
          </Center>
        )}
      </Container>
    </>
  );
}

export default App;
