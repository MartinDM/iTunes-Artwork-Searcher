import { Box, Image, Link, Text } from "@chakra-ui/react";

import { IoCloudDownloadOutline } from "react-icons/io5";
import { IResult } from "../App";

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

const getThumb = (url: string, size: string): string => {
  if (!url) return "";
  return url.replace("100x100bb", `${size}x${size}bb`);
};

const Result = (result: IResult) => {
  const hasImage = !!result.artworkUrl100;

  return (
    <Box
      key={result.collectionId}
      maxW='sm'
      borderWidth='1px'
      borderColor={"#e4e4e4"}
      borderRadius='lg'
      bg={"gray.800"}
    >
      {hasImage && (
        <Image
          src={getThumb(result.artworkUrl100, "270")}
          alt={result.collectionName}
          width='100%'
        />
      )}
      <Box color='#FF5E5E' p='4' pb={5}>
        <Box mb={4}>
          <Text fontWeight='semibold' fontSize='xl'>
            {result.artistName}
          </Text>
          <Text fontSize='sm' fontWeight='normal' letterSpacing='wide'>
            {result?.collectionName}
          </Text>
        </Box>
        {hasImage ? (
          <Box fontWeight='500' alignItems={"center"} gap={2} my={2}>
            <Link
              {...linkProps}
              href={getThumb(result.artworkUrl100, "600")}
              isExternal
            >
              <IoCloudDownloadOutline />
              Standard res (600px)
            </Link>
            <Link
              {...linkProps}
              href={getThumb(result.artworkUrl100, "2000")}
              isExternal
            >
              <IoCloudDownloadOutline />
              Highest res (2000px)
            </Link>
          </Box>
        ) : (
          `No artwork for ${result.collectionName}`
        )}
      </Box>
    </Box>
  );
};

export default Result;
