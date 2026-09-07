import { Box, Image, Text, Link } from "@chakra-ui/react";

import { IoCloudDownloadOutline } from "react-icons/io5";

const linkProps = {
  _hover: {
    cursor: "pointer",
    textDecoration: "underline",
    color: "#ff9393",
  },
  display: "flex",
  fontWeight: "500",
  alignItems: "center",
  gap: "2",
  my: 2,
};

export type TResult = {
  artistName: string;
  artistId?: number;
  artistLinkUrl?: string;
  primaryGenreName?: string;
  collectionType?: string;
  collectionName?: string;
  trackName?: string;
  trackId?: number;
  kind?: string;
  artworkUrl100?: string;
  collectionId?: number;
};

export interface IResultProps {
  result: TResult;
}

const getThumb = (url: string, size: string): string => {
  if (!url) return "";
  return url.replace("100x100bb", `${size}x${size}bb`);
};

const _trimDesc = (desc: string, max: number = 100) => {
  return desc.length > max ? desc.substring(0, max) + "..." : desc;
};

const getDesc = (result: TResult) => {
  if (result.kind === "song" && result.trackName)
    return _trimDesc(result.trackName);
  if (result.collectionName) return _trimDesc(result.collectionName);
  if (result.primaryGenreName) return result.primaryGenreName;
  return undefined;
};

const Result = ({ result }: IResultProps) => {
  const artworkUrl = result.artworkUrl100 ?? "";
  const hasImage = artworkUrl.length > 0;
  return (
    <Box
      bg='rgb(9 11 23 / 60%)'
      key={result.artworkUrl100}
      maxW='sm'
      borderWidth='1px'
      borderColor={"#e4e4e4"}
      borderRadius='lg'
    >
      {hasImage && (
        <Image
          src={getThumb(artworkUrl, "270")}
          alt={result.collectionName ?? result.artistName}
          width='100%'
        />
      )}
      <Box color='#FF5E5E' p='4' pb={5}>
        <Box mb={4}>
          <Text fontWeight='semibold' fontSize='xl'>
            {result.artistName}
          </Text>
          <Text fontSize='sm' fontWeight='normal' letterSpacing='wide'>
            {getDesc(result)}
          </Text>
          {result.kind === "song" && (
            <Text as='b' fontSize='sm' fontWeight='normal' letterSpacing='wide'>
              Album: {result.collectionName}
            </Text>
          )}
        </Box>
        {hasImage ? (
          <Box fontWeight='500' alignItems={"center"} gap={2} my={2}>
            <Link
              {...linkProps}
              href={getThumb(artworkUrl, "600")}
              isExternal
            >
              <IoCloudDownloadOutline />
              Standard res (600px)
            </Link>
            <Link
              {...linkProps}
              href={getThumb(artworkUrl, "2000")}
              isExternal
            >
              <IoCloudDownloadOutline />
              Highest res (2000px)
            </Link>
          </Box>
        ) : result.artistLinkUrl ? (
          <Link {...linkProps} href={result.artistLinkUrl} isExternal>
            <IoCloudDownloadOutline />
            View artist on Apple Music
          </Link>
        ) : (
          `No artwork for ${result.collectionName ?? result.artistName}`
        )}
      </Box>
    </Box>
  );
};

export default Result;
