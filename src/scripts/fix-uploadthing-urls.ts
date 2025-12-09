import prisma from "@/lib/prisma";

async function fixUploadThingUrls() {
  const appId = process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID;
  
  if (!appId) {
    console.error("NEXT_PUBLIC_UPLOADTHING_APP_ID is not defined in environment variables");
    process.exit(1);
  }

  console.log(`Fixing UploadThing URLs to use app ID: ${appId}`);

  // Find all media records with "undefined" in the URL
  const mediaWithUndefined = await prisma.media.findMany({
    where: {
      url: {
        contains: "/a/undefined/",
      },
    },
  });

  console.log(`Found ${mediaWithUndefined.length} media records with undefined URLs`);

  // Update each record to use the correct app ID
  for (const media of mediaWithUndefined) {
    const fixedUrl = media.url.replace("/a/undefined/", `/a/${appId}/`);
    console.log(`Updating media ${media.id}: ${media.url} -> ${fixedUrl}`);
    
    await prisma.media.update({
      where: { id: media.id },
      data: { url: fixedUrl },
    });
  }

  console.log("Finished fixing UploadThing URLs");
}

fixUploadThingUrls().catch((error) => {
  console.error("Error fixing UploadThing URLs:", error);
  process.exit(1);
});