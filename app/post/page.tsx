"use client"
import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardHeader,
  Box,
  CircularProgress,
} from "@mui/material";
import { download } from "@/app/api/Admin/Post";

const Contract: React.FC = () => {
  const [postImages, setPostImages] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchImages = async () => {
    try {
      setIsFetching(true);
      const result = await download("ImageNewsPost");
      if (result.success && Array.isArray(result.data)) {
        const posts = result.data.map((item: any) => ({
          postId: item.postId,
          name: item.name,
          content: item.content || "No content",
          describ: item.describ || "",
          image: item.image, // Base64 image string
          createDate: item.createDate || "No Date",
        }));
        setPostImages(posts);
      } else {
        setPostImages([]);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <main>
      <Typography variant="h5" sx={{ mt: 4, mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
        ข่าวสาร
      </Typography>

      {isFetching ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          {postImages.length === 0 ? (
            <Typography variant="h6" sx={{ mt: 4 }}>
              ไม่มีข้อมูล
            </Typography>
          ) : (
            postImages.map((post) => (
              <Grid item xs={12} md={8} lg={6} key={post.postId}>
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    width: "100%",
                    margin: "0 auto",
                  }}
                >
                  {post.image ? (
                    <CardMedia
                      component="img"
                      image={`data:image/jpeg;base64,${post.image}`}
                      alt={post.name}
                      sx={{ objectFit: "contain", maxHeight: "550px", width: "100%" ,marginTop:"10px"}}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: 500,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f0f0f0",
                      }}
                    >
                      <Typography>ไม่มีข้อมูล</Typography>
                    </Box>
                  )}
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", mb: 1 }}
                    >
                      {post.content}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {post.describ}
                    </Typography>
                    <CardHeader
                      subheader={
                        post.createDate
                          ? new Date(post.createDate).toLocaleString('en-GB', {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                          })
                          : "No Date"
                      }
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}
    </main>
  );
};

export default Contract;
