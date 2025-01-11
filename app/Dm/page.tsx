"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Layout from "@/components/Layout";
import { Box, Typography } from "@mui/material"; // ใช้ Box และ Typography จาก Material-UI
import pp from "../../public/PP.jpg";
import kk from "../../public/PP.jpg";

const Page: React.FC = () => {
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768); // 768px เป็น breakpoint สำหรับ desktop
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Layout contentTitle="โครงสร้างองค์กร">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"

      >
        {/* แสดงรูปภาพตามขนาดหน้าจอ */}
        {isDesktop ? (
          <Box width="100%" maxWidth="1200px">
            <Image
              src={pp}
              alt="Desktop Image"
              layout="responsive"
              width={1200}
              height={750}
              className="transition-transform duration-300 hover:scale-105 rounded-lg shadow-lg"
              style={{ objectFit: "contain" }}
            />
          </Box>
        ) : (
          <Box width="100%" position="relative" marginTop="3rem">
            <Image
              src={kk}
              alt="Mobile Image"
              layout="responsive" // ใช้ responsive layout
              width={600}
              height={0} // ปล่อยความสูงให้ปรับอัตโนมัติ
              style={{
                objectFit: "contain",
              }}
              className="transition-transform duration-300 hover:scale-105 rounded-lg shadow-lg"
            />
          </Box>
        )}

        <Typography
          marginTop="2rem"
          textAlign="center"
          variant="h6" // ใช้ variant ที่มีใน Material-UI เช่น h6
        >
          ติดต่อได้ที่อาคารอเนกประสงค์ชั้น 2
        </Typography>
      </Box>
    </Layout>
  );
};

export default Page;
